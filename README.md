# EmpowerOne_Backend - minimal scaffold

Quickstart (dev, Docker)
1. From this folder:
   docker compose up --build
2. Create a superuser (in another shell):
   docker compose exec web python manage.py createsuperuser
3. Open API docs:
   http://localhost:8000/api/docs/  (Swagger UI)

Notes
- The bank adapter stubs are in api/bank_adapter/client.py — implement the real bank calls there.
- Celery is included as a worker service; adapt enqueue_sync_account to schedule tasks.
- CORS origin defaults to http://localhost:5173. Set FRONTEND_ORIGIN env var to change.
