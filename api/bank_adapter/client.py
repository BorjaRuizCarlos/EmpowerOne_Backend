"""
Stubbed bank adapter client. Implement bank-specific logic here.

Functions to implement:
- start_oauth_flow(user, provider) -> redirect URL (for hosted OAuth)
- fetch_accounts(credential) -> list of account dicts
- fetch_transactions(account, since=None) -> list of tx dicts
- handle_webhook(request) -> process incoming webhook
- enqueue_sync_account(account_id) -> schedule background sync (Celery)
"""
def start_oauth_flow(user, provider):
    # return a placeholder URL for dev
    return f"https://bank.example/connect?user={user.id}&provider={provider}"

def fetch_accounts(credential):
    # return [] or sample structure
    return []

def fetch_transactions(account, since=None):
    return []

def handle_webhook(request):
    # verify and process bank webhook
    return {"ok": True}

def enqueue_sync_account(account_id):
    # placeholder; integrate with Celery tasks in your implementation
    return True