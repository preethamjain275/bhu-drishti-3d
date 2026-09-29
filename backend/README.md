# BHOO-MITRA AI — Backend

## Phase 15: PostgreSQL + PostGIS Persistence

### Architecture

```
Next.js UI
    ↓
API Client (src/lib/api/client.ts)
    ↓
FastAPI (backend/app/main.py)
    ↓
Service Layer (backend/app/services/)
    ↓
Repository Layer (backend/app/repositories/)
       /                    \
      /                      \
PostgreSQL/PostGIS         MockRepository
(postgres_repository.py)  (mock_repository.py)
      ↓
  Spatial Data Store
  (GeoAlchemy2 + PostGIS)
```

### Quick Start

#### 1. Start the database (Docker required)

```bash
docker-compose up -d
```

#### 2. Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### 3. Run migrations

```bash
cd backend
alembic upgrade head
```

#### 4. Seed synthetic demo data

```bash
cd backend
python -m app.db.seed
```

#### 5. Start the API server

```bash
cd backend
python -m uvicorn app.main:app --reload
```

### Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```env
DATABASE_URL=postgresql://bhoomitra_user:bhoomitra_pass@localhost:5432/bhoomitra_db
REPOSITORY_MODE=postgres   # or "mock" for demo-only mode
```

### Repository Mode Selection

| `REPOSITORY_MODE` | Database Required | Behaviour |
|---|---|---|
| `postgres` | Yes (Docker) | Full PostGIS persistence |
| `mock` | No | In-memory synthetic data |

If `REPOSITORY_MODE=postgres` but the database is offline, the system **automatically falls back to mock mode** — the frontend remains fully functional.

### API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/health` | Database + PostGIS status |
| `GET /api/status` | Full system status |
| `GET /api/sources` | Data sources |
| `GET /api/entities` | Canonical entities (with geometry) |
| `GET /api/conflicts` | Conflict cases |
| `GET /api/evidence` | Evidence nodes |
| `GET /api/recommendations` | Harmonisation recommendations |
| `GET /api/verification` | Verification records |
| `GET /api/audit` | Audit events |

### Database Tables

All tables include `is_synthetic_demo = TRUE` on seeded demo records.

| Table | Description |
|---|---|
| `data_sources` | Government/institutional data providers |
| `source_assets` | Individual files/layers from sources |
| `canonical_entities` | Harmonised land parcel records + PostGIS geometry |
| `entity_observations` | Raw per-source parcel claims + PostGIS geometry |
| `conflict_cases` | Detected conflicts between observations |
| `evidence` | Provenance-anchored evidence items |
| `recommendations` | Harmonisation recommendations |
| `verification_records` | Human reviewer decisions |
| `audit_events` | Append-only audit trail |
| `quality_signals` | Geometry/attribute/CRS quality metrics |

### Spatial Indexes

PostGIS GiST indexes are created on:
- `canonical_entities.geometry`
- `entity_observations.geometry`

These support future operations: `ST_Intersects`, `ST_Within`, `ST_DWithin`, `ST_Area`, `ST_Distance`.

### Alembic Migrations

```bash
# Apply all migrations
alembic upgrade head

# Create new migration (autogenerate from models)
alembic revision --autogenerate -m "description"

# Downgrade one step
alembic downgrade -1
```

### NOT Implemented (Future Phases)

- GDAL processing
- PROJ transformations
- GeoPandas pipelines
- Advanced spatial conflict algorithms
- Real uploaded-file processing
- Authentication/RBAC
