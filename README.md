# Student Information System: Progressive Web App (PWA)

This project is part of the practical assignments given in class for the **Mobile Web and Technologies** course.

- **Student:** SHELDON KASERA
- **Registration number:**SSHEKA2311
- **Institution / Lecturer:** Mr. Felix Chepsiror

**Live demo:** https://ka-sera.github.io/student-progressive-web-app/

## Assignment topics

1. Progressive Web Apps (PWAs)
2. Cloud-based application deployment

## What the application does

A simple student information system built with HTML, CSS and JavaScript that:

1. Displays student information, with search and course filter.
2. Uses a **web app manifest** (`manifest.json`).
3. Implements a **service worker** (`sw.js`).
4. Works **offline** after the first visit.
5. Can be **installed** on a mobile device or desktop.
6. Is **deployed to the cloud** using GitHub Pages.

## Project files

| File | Purpose |
|---|---|
| `index.html` | App page, install guide and deployment guide |
| `style.css` | Styling |
| `app.js` | Loads and displays students, online/offline indicator, install button, service worker registration |
| `sw.js` | Service worker: caches the app and serves it offline |
| `manifest.json` | Web app manifest: name, icons, theme colour, display mode |
| `students.json` | Student data |
| `offline.html` | Fallback page when a page is not cached |
| `icon-192.png`, `icon-512.png` | App icons |

## How the offline support works

- On **install**, the service worker stores the app files in a cache.
- On **fetch**, pages and data are loaded from the network when online and from the cache when offline. Static files (CSS, JS, icons) are served from the cache first.
- If a page is not cached, `offline.html` is shown.
- A copy of the student data is also kept in `localStorage` as a last resort.

## Running it locally

1. Copy the project to `C:\xampp\htdocs\student_pwa\`.
2. Start **Apache** in XAMPP.
3. Open `http://localhost/student_pwa/index.html` in Chrome.

Service workers only run on `localhost` or HTTPS, so do not open `index.html` by double-clicking it.

## Installing on a mobile device

- **Android (Chrome):** open the live link, tap **Install app** (or the **⋮** menu → **Install app**).
- **iPhone (Safari):** open the live link, tap **Share → Add to Home Screen → Add**.

## Deployment (GitHub Pages)

1. Push the project files to the root of this repository.
2. Open **Settings → Pages**.
3. Set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, then **Save**.
4. The site is published over HTTPS at the live demo link above.

## Technologies

HTML5, CSS3, JavaScript, Service Worker API, Cache API, Web App Manifest, GitHub Pages.
