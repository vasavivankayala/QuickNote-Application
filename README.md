# QuickNote – Full-Stack Notes Application

A single-page notes application built with React + Vite, Python Flask, and SQLite.

## Features
- Create, view, edit, and delete notes
- Search notes by title or content
- Notes are saved in SQLite and remain after restarting the app
- Responsive interface
- REST API between React and Flask
- Created/updated timestamps

## Requirements
- Python 3.9+
- Node.js 18+
- npm

## Run the backend (Terminal 1)

```bash
cd backend
python -m venv venv
```

Activate the environment:

**Windows PowerShell**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows Command Prompt**
```cmd
venv\Scripts\activate
```

Install and start:
```bash
pip install -r requirements.txt
python app.py
```

Backend runs at: http://127.0.0.1:5000

The SQLite database file `quicknotes.db` is created automatically in the backend folder.

## Run the frontend (Terminal 2)

Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/notes` | List notes |
| GET | `/api/notes/<id>` | Get one note |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/<id>` | Update a note |
| DELETE | `/api/notes/<id>` | Delete a note |
| GET | `/api/health` | API health check |

Example POST body:
```json
{
  "title": "Internship preparation",
  "content": "Build and understand a full-stack project."
}
```

## Project structure

```text
QuickNote_Internship_Project/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── api.js
│       └── style.css
└── README.md
```

## Troubleshooting
- If `python` is not recognized, install Python and enable **Add Python to PATH**.
- If `npm` is not recognized, install Node.js LTS.
- Keep the backend terminal running while using the frontend.
- If port 5000 is occupied, change `app.run(port=5000)` in `backend/app.py` and update the proxy in `frontend/vite.config.js`.
