# StockQ Commands

## API Server

```bash
# Start the API (from project root)
uvicorn api.app.main:app --reload --port 8000

# With explicit Python path
PYTHONPATH=/Users/jay/code/project/stockQ uvicorn api.app.main:app --reload
```

## Database

```bash
# Create a new migration (after changing models)
PYTHONPATH=/Users/jay/code/project/stockQ alembic --config api/alembic.ini revision --autogenerate -m "description"

# Create an empty migration (manual SQL)
PYTHONPATH=/Users/jay/code/project/stockQ alembic --config api/alembic.ini revision -m "description"

# Apply migrations
PYTHONPATH=/Users/jay/code/project/stockQ alembic --config api/alembic.ini upgrade head

# Rollback one step
PYTHONPATH=/Users/jay/code/project/stockQ alembic --config api/alembic.ini downgrade -1
```

## Frontend

```bash
# Start Next.js dev server (from frontend/)
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

## Docker

```bash
# Build API image
docker build -t stockq-api api/

# Run with compose (once compose.yml exists)
docker compose up -d

# Stop everything
docker compose down

# View logs
docker compose logs -f
```

## Python Environment

```bash
# Create venv (Python 3.13)
/usr/local/bin/python3.13 -m venv .venv

# Activate
source .venv/bin/activate

# Install API dependencies
pip install -r api/requirements.txt
# or install each package directly (see pyproject.toml)
```

## Git Workflow

```bash
# Commit after each agent phase
git add -A
git commit -m "feat: Agent N description"

# Push
git push origin master
```

## Common Checks

```bash
# Verify all API imports work
PYTHONPATH=/Users/jay/code/project/stockQ python -c "from api.app.main import app; print(f'{len(app.routes)} routes OK')"

# List all registered routes
PYTHONPATH=/Users/jay/code/project/stockQ python -c "from api.app.main import app; [print(r.path) for r in app.routes]"
```