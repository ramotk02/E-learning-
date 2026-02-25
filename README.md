# E-Learning Plattform / E-Learning Platform

Eine moderne Full-Stack E-Learning Webanwendung mit interaktiven Lernspielen, Benutzerverwaltung und statistischer Auswertung.  
A modern full-stack e-learning web application with interactive learning games, user management and statistical tracking.

---

## Team & Aufgabenverteilung / Team & Responsibilities

Dieses Projekt wurde von **Ilyas, Ziad und Omar** entwickelt.  
This project was developed by **Ilyas, Ziad and Omar**.

- **Ilyas**: Vokabel-Spiel / Vocabulary game  
- **Ziad**: Konjugations-Spiel / Conjugation game  
- **Omar**: Mathematik-Spiel + Login/Registrierung (JWT & Datenbank) / Math game + Login/Registration (JWT & Database)  
- **Design/UI**: gemeinsam umgesetzt / Designed together as a team  

Zusätzlich wurde eine Datenbank integriert, um Benutzer-Login sowie den Fortschritt und das Level jeder Person zu speichern und nachzuverfolgen.  
A database was integrated to handle secure login and to store and track each user's progress and level.

---

## Projektübersicht / Project Overview

Die Plattform ermöglicht:  
The platform allows:

- Registrierung und Login (JWT-Authentifizierung)  
- Interaktive Lernspiele (Mathematik, Wortschatz, Konjugation)  
- Speicherung von Spielergebnissen  
- Anzeige von Statistiken im Dashboard  

- Registration and login (JWT authentication)  
- Interactive learning games (Math, Vocabulary, Conjugation)  
- Saving game results  
- Displaying statistics in the dashboard  

---

## Technologien / Technologies

### Frontend
- React (Vite)
- React Router
- Recharts

### Backend
- Node.js
- Express
- MySQL (mysql2)
- JSON Web Token (JWT)
- bcrypt
- CORS

---

## Projektstruktur / Project Structure


E-learning-/
│
├── public/
├── src/
│ ├── pages/
│ ├── games/
│ └── App.jsx
│
└── server/
├── index.js
└── e-learning.sql


---

## Installation & Verwendung / Installation & Usage

### 1. Repository klonen / Clone the repository

```bash
git clone https://github.com/ramotk02/E-learning-.git
cd E-learning-
2. Datenbank importieren / Import the database

Open phpMyAdmin

Create a database (for example: e-learning)

Click on "Import"

Select the file: server/e-learning.sql

Start the import

3. Abhängigkeiten installieren / Install dependencies

Im Hauptordner des Projekts / In the root project folder:

npm install
Projekt starten / Run the project

Du benötigst zwei Terminals.
You need two terminals.

Terminal 1 – Backend starten / Start backend
cd server
node ./index.js
Terminal 2 – Frontend starten / Start frontend
npm run dev

Frontend läuft standardmäßig auf:
The frontend runs by default on:

http://localhost:5173

Backend läuft auf:
The backend runs on:

http://localhost:3001