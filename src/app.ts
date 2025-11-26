import express from "express";

import auth from "./router/authentication";
import youtube from "./router/youtube";

const router = express.Router();

router.use("/auth", auth);
router.use("/videos", youtube);

export default router;



