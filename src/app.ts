import express from "express";

import auth from "./router/authentication";

const router = express.Router();

router.use("/auth", auth);

export default router;

