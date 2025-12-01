# 🚀 StreamSync Lite Server — Setup & Run Guide

This guide contains everything needed to run your Node.js + TypeScript backend in **development** and **production**.
Note: Make sure to check out the [StreamSync Lite Android app repository](https://github.com/Praveen0586/Stream-sync--Lite-Android/) for the front-end code.
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

# 📌 API Documentation

## 🔐 Authentication
```

  Method     Endpoint           Description
  ---------- ------------------ -------------------------------
  **POST**   `/auth/register`   Register a new user
  **POST**   `/auth/login`      Log in and receive JWT tokens
  **POST**   `/auth/refresh`    Refresh access token

------------------------------------------------------------------------
```
## ⭐ Favorites
```
  ------------------------------------------------------------------------
  Method             Endpoint                Description
  ------------------ ----------------------- -----------------------------
  **POST**           `/favorites/add`        Add a video to favorites

  **DELETE**         `/favorites/remove`     Remove a video from favorites

  **GET**            `/favorites/:user_id`   Get all favorite video IDs of
                                             a user

  **POST**           `/favorites/batch`      Fetch full video objects for
                                             favorite IDs
  ------------------------------------------------------------------------
```
------------------------------------------------------------------------

## 👤 User / FCM Token
```
  ------------------------------------------------------------------------
  Method             Endpoint                Description
  ------------------ ----------------------- -----------------------------
  **POST**           `/users/:id/fcmToken`   Register or update user's FCM
                                             token

  **DELETE**         `/users/:id/fcmToken`   Delete user's FCM token
  ------------------------------------------------------------------------
```
------------------------------------------------------------------------

## 🔔 Notifications
```
  -----------------------------------------------------------------------------
  Method             Endpoint                     Description
  ------------------ ---------------------------- -----------------------------
  **POST**           `/notifications/send-test`   Send test notification
                                                  (admin)

  **POST**           `/notifications`             Send notification to users
                                                  (admin)

  **GET**            `/notifications`             Get notifications for user

  **GET**            `/notifications/count`       Get unread notification count

  **DELETE**         `/notifications/:id`         Delete a specific
                                                  notification

  **POST**           `/notifications/mark-read`   Mark notifications as read
  -----------------------------------------------------------------------------
```
------------------------------------------------------------------------

## 🎬 Videos
```
  Method     Endpoint                 Description
  ---------- ------------------------ -------------------------------
  **GET**    `/videos/latest`         Get the latest videos
  **GET**    `/videos/:videoid`       Get video details by ID
  **POST**   `/videos/progress`       Update user video progress
  **POST**   `/videos/progress/get`   Get video progress for a user
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
# ServiceAccount.json

```
make sure to paste your serviceAccount.json file in  ./src/configs/firebase/serviceAccount.json
```

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
