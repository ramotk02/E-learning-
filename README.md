#  E-Learning Plattform / E-Learning Platform

##  Beschreibung / Description

**DE:**  
Eine moderne **Full-Stack E-Learning Webanwendung** mit interaktiven Lernspielen, Benutzerverwaltung und statistischer Auswertung.  
Die Plattform kombiniert Lernen und Spielen, um Motivation und Lernerfolg zu steigern.

**EN:**  
A modern **full-stack e-learning web application** with interactive learning games, user management, and statistical tracking.  
The platform combines learning and gaming to improve motivation and learning outcomes.

---

##  Team & Aufgabenverteilung / Team & Responsibilities

**DE:**  
Dieses Projekt wurde von **Ilyas, Ziad und Omar** entwickelt.

**EN:**  
This project was developed by **Ilyas, Ziad, and Omar**.

### Aufgabenverteilung / Responsibilities
- **Ilyas** – Vokabel-Spiel / Vocabulary Game und Design / UI +login design
- **Ziad** – Konjugations-Spiel / Conjugation Game  
- **Omar** – Mathematik-Spiel + Login & Registrierung (JWT & Datenbank)  
  / Math Game + Login & Registration (JWT & Database)  


Zusätzlich wurde eine **Datenbank integriert**, um Benutzer-Login sowie den **Fortschritt und das Level** jeder Person zu speichern und nachzuverfolgen.  

A **database was integrated** to handle secure login and to store and track each user’s **progress and level**.

---

##  Projektübersicht / Project Overview

**DE – Die Plattform ermöglicht:**
- Registrierung und Login (JWT-Authentifizierung)
- Interaktive Lernspiele (Mathematik, Wortschatz, Konjugation)
- Speicherung von Spielergebnissen
- Anzeige von Statistiken im Dashboard

**EN – The platform allows:**
- Registration and login (JWT authentication)
- Interactive learning games (Math, Vocabulary, Conjugation)
- Saving game results
- Displaying statistics in the dashboard

---

##  Technologien / Technologies

### Frontend
- React (Vite)
- React Router
- Recharts

### Backend
- Node.js
- Express
- phpmyadmin
- JSON Web Token (JWT)
- bcrypt
- CORS

---

##  Projektstruktur / Project Structure


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

##  Installation & Verwendung / Installation & Usage

### 1. Repository klonen / Clone the repository
```bash
git clone https://github.com/ramotk02/E-learning-.git
cd E-learning-
2. Datenbank importieren / Import the database

DE:

phpMyAdmin öffnen

Neue Datenbank erstellen (z. B. e-learning)

Auf Import klicken

Datei auswählen: server/e-learning.sql

Import starten

EN:

Open phpMyAdmin

Create a database (e.g. e-learning)

Click on Import

Select the file: server/e-learning.sql

Start the import

3. Abhängigkeiten installieren / Install dependencies

Im Hauptordner / In the root project folder:

npm install
▶️ Projekt starten / Run the project

Du benötigst zwei Terminals.
You need two terminals.

Terminal 1 – Backend starten / Start backend
cd server
node ./index.js
Terminal 2 – Frontend starten / Start frontend
npm run dev
🌐 Lokale Server / Local Servers

Frontend: http://localhost:5173

Backend: http://localhost:3001

 Fazit / Summary

DE:
Diese Plattform bietet eine moderne, spielbasierte Lernumgebung mit sicherer Benutzerverwaltung und Fortschrittsverfolgung.

EN:
This platform provides a modern, game-based learning environment with secure user management and progress tracking.
