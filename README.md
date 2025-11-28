# 🚀 StreamSync Lite Server — Setup & Run Guide

This guide contains everything needed to run your Node.js + TypeScript backend in **development** and **production**.

---

# 📁 Project Structure

```
\---src
    |   app.ts
    |   server.ts
    |
    +---configs
    |   |   db.ts
    |   |
    |   \---firebase
    |           firebase.ts
    |
    +---controllers
    |       authentication_controllers.ts
    |       favoritescontroller.ts
    |       fcmControllers.ts
    |       videoscontroller.ts
    |
    +---fcm
    |       fcm.ts
    |       fcmworker.ts
    |       service.ts
    |
    +---middleware
    |       authmiddleware.ts
    |
    +---model
    +---router
    |       authentication.ts
    |       favorites.ts
    |       fcmrouter.ts
    |       youtube.ts
    |
    \---utils
            jwt.ts
            youtubeutils.ts
```

---

# ⚙️ Requirements

* Node.js **v22.15.0**
* npm **v10.9.2**
* serviceAccount.json (Firebase Admin key) — **not stored in Git**

---

# 🗂️ `.env` File Example

```
rdsqlHostlink=
rdsusername=
rdspassword=
rdsdatabase=

JWT_SECRET=
REFRESH_SECRET=

YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
```

---

# 🧩 package.json (Important Scripts)

```
"scripts": {
  "dev": "ts-node-dev --respawn src/server.ts",
  "build": "tsc",  
  "start": "node dist/server.js"
}
```

(for macOS/Linux use `cp` instead of `copy`)

---

# 🔥 Development Mode

Runs TypeScript directly with auto‑reload:

```
npm run dev
```

Server will start at:

```
http://localhost:3000
```

---

# 🏭 Production Mode

Production uses **compiled JavaScript (dist folder)**.

### 1️⃣ Build the project

```
npm run build
```

This will:

* Compile TypeScript → JavaScript
* Copy `serviceAccount.json` into `/dist`

### 2️⃣ Start the production server

```
npm start
```

Runs:

```
node dist/server.js
```

---

# 🔐 Important Notes

### ✔ Do NOT upload `serviceAccount.json` to GitHub

Add to `.gitignore`:

```
serviceAccount.json
```

### ✔ `.env` must exist both in development & deployment server.

### ✔ Always run production using compiled JS, never TypeScript.

---

# 📝 Firebase Admin Initialization (Correct Production Path)

```
import admin from "firebase-admin";
import path from "path";

const serviceAccountPath = path.resolve(
  __dirname,
  "../../../../serviceAccount.json"
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

export default admin;
```

---

# 🧪 Test the Server

After running dev or prod mode:

```
GET http://localhost:3000
```

If your app has `/health` or `/status`, test that endpoint too.

---

# 🎉 You Are Ready!

Your backend now supports:

* Development mode (hot reload)
* Production mode (compiled JS)
* Firebase Admin (working path)
* Secure .env usage
* MySQL, JWT, YouTube API

If you want, I can also generate:

* A full **Dockerfile** for production
* A **PM2 deployment guide**
* A **GitHub-safe folder structure**

Just tell me!
