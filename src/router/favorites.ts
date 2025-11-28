import { Router } from "express";
import { addFavorite, removeFavorite, getFavorites, getFavoriteVideos } from "../controllers/favoritescontroller";

const router = Router();
router.post("/favorites/add", addFavorite);
router.delete("/favorites/remove", removeFavorite);
router.get("/favorites/:user_id", getFavorites);
router.post("/favorites/batch",getFavoriteVideos );

export default router;
    