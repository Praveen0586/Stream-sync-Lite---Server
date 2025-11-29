import admin from "firebase-admin";

const serviceAccount = require("../../../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const fcm = admin.messaging(); // let TS infer type

