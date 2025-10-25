"""
Stubbed bank adapter client. Implement bank-specific logic here.

Functions to implement:
- start_oauth_flow(user, provider) -> redirect URL (for hosted OAuth)
- fetch_accounts(credential) -> list of account dicts
- fetch_transactions(account, since=None) -> list of tx dicts
- handle_webhook(request) -> process incoming webhook
- enqueue_sync_account(account_id) -> schedule background sync (Celery)
"""
import logging
from urllib.parse import urljoin, urlencode

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

# Configurable bases (defaults for Nessie-like API)
BASE_CUSTOMER = getattr(settings, "BANK_API_BASE_CUSTOMER", "https://api.nessieisreal.com")
BASE_ENTERPRISE = getattr(settings, "BANK_API_BASE_ENTERPRISE", "https://api.nessieisreal.com/enterprise")
API_KEY = getattr(settings, "BANK_API_KEY", "")

DEFAULT_TIMEOUT = 10  # seconds
DEFAULT_HEADERS = {"Accept": "application/json"}

class BankAPIError(Exception):
    pass

def _build_url(path: str, enterprise: bool = False) -> str:
    base = BASE_ENTERPRISE if enterprise else BASE_CUSTOMER
    # ensure path doesn't double up slashes
    return urljoin(base.rstrip("/") + "/", path.lstrip("/"))

def _request(method: str, path: str, enterprise: bool = False, params: dict | None = None, json: dict | None = None):
    if params is None:
        params = {}
    # API requires the key in query string: ?key=KEY
    if API_KEY:
        params.setdefault("key", API_KEY)

    url = _build_url(path, enterprise=enterprise)
    try:
        resp = requests.request(method, url, params=params, json=json, headers=DEFAULT_HEADERS, timeout=DEFAULT_TIMEOUT)
    except requests.RequestException as exc:
        logger.exception("Bank API request failed")
        raise BankAPIError(str(exc)) from exc

    if resp.status_code >= 400:
        logger.error("Bank API returned error %s: %s %s", resp.status_code, resp.text, resp.url)
        raise BankAPIError(f"{resp.status_code}: {resp.text}")

    try:
        return resp.json()
    except ValueError:
        return resp.text

# Public API stubs — adapt endpoints per provider docs

def start_oauth_flow(user, provider: str):
    """
    For customer connections: return a redirect URL where user completes OAuth/consent.
    Implementation detail depends on the bank: this is a placeholder.
    """
    # placeholder path; replace with actual endpoint once provided
    path = f"/connect/{provider}"
    return _build_url(path, enterprise=False) + ("?key=" + API_KEY if API_KEY else "")

def fetch_accounts(credential, enterprise: bool = False):
    """
    Fetch accounts for a credential. If enterprise=True use enterprise endpoints (read-only).
    credential may be a model instance or dict with external_id / provider info.
    """
    # placeholder path, replace with actual endpoint (e.g., /accounts or /customers/{id}/accounts)
    if enterprise:
        path = "/accounts"  # enterprise: returns all accounts
    else:
        # customer: fetch accounts owned by the credential/external user
        path = f"/customers/{credential.external_id}/accounts" if getattr(credential, "external_id", None) else "/accounts"
    return _request("GET", path, enterprise=enterprise)

def fetch_transactions(account, since: str | None = None, enterprise: bool = False, params: dict | None = None):
    """
    Fetch transactions for a specific account. 'since' can be an ISO date string.
    """
    params = params or {}
    if since:
        params["since"] = since
    # placeholder path
    path = f"/accounts/{account.external_id}/transactions"
    return _request("GET", path, enterprise=enterprise, params=params)

def fetch_customers(enterprise: bool = True, params: dict | None = None):
    """
    Enterprise-only: return list of customers the enterprise analyst can view.
    """
    if not enterprise:
        raise BankAPIError("fetch_customers is enterprise-only")
    return _request("GET", "/customers", enterprise=True, params=params)

def handle_webhook(request):
    """
    Process incoming webhook request from bank.
    - Validate signature / key if required.
    - Return parsed payload or raise BankAPIError.
    """
    # many banks will include verification headers; add verification here.
    try:
        payload = request.body
        # For now, just parse JSON via DRF or requests-like logic:
        data = request.json() if hasattr(request, "json") else None
    except Exception:
        data = None
    logger.debug("Received bank webhook: %s", data or payload)
    # TODO: verify signature and process events (create transactions, update accounts, etc.)
    return {"ok": True, "data": data}

def enqueue_sync_account(account_id: int):
    """
    Placeholder to schedule background sync for an account.
    Replace/extend this to call a Celery task or other background worker.
    Example:
      from .tasks import sync_account_task
      sync_account_task.delay(account_id)
    """
    logger.info("enqueue_sync_account called for account_id=%s (no-op)", account_id)
    return True