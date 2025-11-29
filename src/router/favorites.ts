import { Router } from "express";
import { addFavorite, removeFavorite, getFavorites, getFavoriteVideos } from "../controllers/favoritescontroller";
import { authMiddleware } from "../middleware/authmiddleware";

const router = Router();
router.post("/favorites/add", authMiddleware, addFavorite);
router.delete("/favorites/remove", authMiddleware, removeFavorite);
router.get("/favorites/:user_id", authMiddleware,getFavorites);
router.post("/favorites/batch",authMiddleware,getFavoriteVideos );

export default router;
    