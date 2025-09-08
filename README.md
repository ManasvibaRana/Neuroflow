[![Django](https://img.shields.io/badge/Django-4.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/REST-Framework-A30F0F?style=for-the-badge&logo=django-rest-framework&logoColor=white)](https://www.django-rest-framework.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Preact](https://img.shields.io/badge/Preact-10-673AB8?style=for-the-badge&logo=preact&logoColor=white)](https://preactjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

### Neuroflow
**A fast, focused wellness companion** that helps you build habits, journal with images, stay productive with timers and matrices, shows the analysis, and engage with a supportive community.

---

### Table of contents
- **What it does**
- **Quick start**
- **Core modules**
- **Tech stack**
- **Structure**
- **Team**
- **Notes**

### What it does 
- **Journal faster**: create entries, attach images; browse history with calendar.
- **Build habits that stick**: define habits, track completion, visualize progress.
- **Stay productive**: Pomodoro timer and productivity boards (e.g., Eisenhower Matrix).
- **Community support**: share posts, like, and comment.
- **All-in-one**: songs for focus, simple analysis endpoints ready for future insights.

### Tech stack 
- Backend: Django 4.2, DRF, CORS, Pillow, Whitenoise
- Frontend: Vite, Preact, Tailwind, Router, Chart.js/Recharts, Lottie

### Structure
```text
Neuroflow/
  Backend/                # Django project and apps
    Backend/              # Django project settings/urls
    users/ community/ journal/ journalmedia/ habit_tracker/ productivity/ songs/ chatbot/ analysis/
    media/                # Uploaded files (e.g., journal images, songs)
    manage.py
  Frontend/               # Vite app
    src/                  # UI modules/pages
```

### Quick start
```bash
# Backend (Django)
cd Backend
python -m venv .venv && .venv\Scripts\activate   # Windows
pip install -r ../requirements.txt
python manage.py migrate && python manage.py runserver

# Frontend (Vite + Preact)
cd ../Frontend
npm install
npm run dev
```
Backend: `http://127.0.0.1:8000` • Frontend: typically `http://localhost:5173`

### Core modules
- `users` • `journal` • `journalmedia` • `habit_tracker` • `productivity` • `community` • `songs` • `chatbot` • `analysis`

### Notes
- Uses SQLite by default; media stored in `Backend/media/`.
- To change ports: `python manage.py runserver 8001` or `vite --port 5174`.

### Team (4 members)
| Member | GitHub | Role |
|---|---|---|
| Rana Manasviba | [@Manasvi](https://github.com/ManasvibaRana) | Role Backend |
| Bhavsar Meet | [@Meet](https://github.com/meetBhavsar2701) | Role Backend |
| Panchal Sakshi | [@Sakshi](https://github.com/Sakshii1410) | Role Frontend|
| Bhalodia Chand | [ | Role Frontend|

---

Built with ❤️ by team.
