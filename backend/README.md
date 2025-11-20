# Solo Gym App - Backend

Python FastAPI backend for the Solo Leveling inspired gym app.

## Setup

1. Install Python 3.11 or higher
2. Create virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Run the server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`
