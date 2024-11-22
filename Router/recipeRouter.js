import express from "express";
import { getallRecipes,addRecipe,updateRecipe,deleteRecipe,likeUnLikePost,commentPost,rateRecipe,singleRecipe} from "../Controllers/recipeController.js";
import usermiddleware from "../Middleware/userMiddleware.js";



const router = express.Router();

router.get("/all",getallRecipes);
router.get("/singlerecipe/:id",singleRecipe);

router.post("/add",usermiddleware,addRecipe);//crerate
router.put("/update/:id",usermiddleware,updateRecipe);
router.delete("/delete/:id",usermiddleware,deleteRecipe);

router.post("/like/:id",usermiddleware, likeUnLikePost);
router.post("/comment/:id",usermiddleware, commentPost);
router.post('/rating/:id',usermiddleware ,rateRecipe);







export default router;