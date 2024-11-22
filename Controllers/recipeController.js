import Recipe from "../Models/recipeModel.js";
import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";




export const getallRecipes =async (req, res) => {
    try {
        const recipes = await Recipe.find().populate("user");
        res.status(200).json({recipes});
        
    } catch (error) {
        console.log(`Error in singup Controller : ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const addRecipe =async (req, res) => {
    
    
    try {
         const  {title,ingredients,preparationSteps,cookingTime,servings,image,dietary,mealType}=req.body;
        // let {image} = req.body;

         console.log(req.body);

        const userId = req.user._id.toString();
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if(!title || !ingredients || !preparationSteps || !cookingTime || !servings || !image || !mealType || !dietary){
            return res.status(400).json({ error: "All fields are required" });  
        }
        const recipe = new Recipe({
            title,
            ingredients,
            preparationSteps,
            cookingTime,
            servings,
            image,
            mealType,
            dietary,
            user: user._id,
        });
        
        await recipe.save();
        res.status(200).json({ message: "Post created successfully" });

        
    } catch (error) {
        console.log(`Error in Add Controller : ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}

export  const updateRecipe =async (req, res) => {
    try {
        const {title,ingredients,preparationSteps,cookingTime,servings,}=req.body;
        const userId = req.user._id.toString();
        const user = await User.findOne({ _id: userId });
         if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if(!title || !ingredients || !preparationSteps || !cookingTime || !servings){
            return res.status(400).json({ error: "All fields are required" });  
        }
        const recipe = await Recipe.findOne({ _id: req.params.id });
        console.log(recipe);
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        recipe.title = title;
        recipe.ingredients = ingredients;
        recipe.preparationSteps = preparationSteps;
        recipe.cookingTime = cookingTime;
        recipe.servings = servings;
        await recipe.save();
        res.status(200).json({ message: "Post updated successfully" });
        
    } catch (error) {
        console.log(`Error in singup Controller : ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const deleteRecipe =async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id.toString();
    
        // Find the recipe by ID
        const recipe = await Recipe.findById(id);
        if (!recipe) {
          return res.status(404).json({ error: "Recipe not found" });
        }
    
        // Authorization check: ensure the requesting user owns the recipe
        if (recipe.user.toString() !== userId) {
          return res.status(403).json({ error: "Unauthorized to delete this recipe" });
        }
    
        // Remove the recipe
        await Recipe.findByIdAndDelete(id);
        res.status(200).json({ message: "Recipe deleted successfully" });
        
    } catch (error) {
        console.log(`Error in deleteRecipes Controller : ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const singleRecipe =async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findById(id).populate("user");
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        res.status(200).json({recipe});
        
    } catch (error) {
        console.log(`Error in SinfleRecipes Controller : ${error}`);
        res.status(500).json({ error: "Internal Server Error" });  
    }
}


export const likeUnLikePost =async (req, res) => {
    try {
        const userId = req.user._id;
        const {id:postId} = req.params;
        const post = await Recipe.findOne({ _id: postId }); 
        if (!post) {    
            return res.status(404).json({ error: "Post not found" });    
        } 
        const userunlike = post.likes.includes(userId);
        if(userunlike){
            await post.updateOne({ $pull: { likes: userId } });
            return res.status(200).json({ message: "Post unliked successfully" });
        }else{
            await post.updateOne({ $push: { likes: userId } });
            await post.save();
            return res.status(200).json({ message: "Post liked successfully" });
        }      
    } catch (error) {
        console.log(`Error in SinfleRecipes Controller : ${error}`);
        res.status(500).json({ error: "Internal Server Error" });  
    }
}


export const commentPost =async (req, res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        if(!text){
            return res.status(400).json({ error: "Please provide text" });
        }
        const post = await Recipe.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        post.comments.push({text:text,user:userId});
        await post.save();
        res.status(200).json({ message: "Comment added successfully" });
        
    } catch (error) {
        console.log(`Error in SinfleRecipes Controller : ${error}`);
        res.status(500).json({ error: "Internal Server Error" });  
    }
}


export const rateRecipe = async (req, res) => {
    try {
        console.log('hi');
        
      const { id } = req.params;
      const { rating } = req.body; // Rating from the request body
      const userId = req.user._id;

      const recipe = await Recipe.findOne({ _id: id });
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      // Check if the user has already rated the recipe
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the user has already rated the recipe
      const existingRating = recipe.ratings.find((rate) => rate.user.toString() === userId);
      if (existingRating) {
        return res.status(400).json({ error: "You have already rated this recipe" });
      }

      // Add the rating to the recipe
      recipe.ratings.push({ user: userId, rating });
      await recipe.save();

      res.status(200).json({ message: "Rating added successfully" });
  
    } catch (error) {
      console.error(`Error in rateRecipe Controller: ${error.message || error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  