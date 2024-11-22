import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import clodninary from "cloudinary";




export const getprofile  =async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json(user);
    } catch (error) {
    console.log(`Error in user profile conntroller : ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateUser =async (req, res) => {
    try {
        const userid = req.user._id;
        console.log(userid);
        
       const { username, fullname, email,currentPassword,newPassword,bio,link } = req.body;
       
       let {profileImg,coverImg} = req.body;
       let user = await User.findById(userid);
       if(!user){
        return res.status(404).json({ error: "User not found" });
      }
      if((!newPassword && currentPassword)|| (newPassword && !currentPassword)){
        return res.status(400).json({ error: "Please provide both current password and new password" });
      }

      if(currentPassword && newPassword){
        const ispasswordCorrct = await bcrypt.compare(currentPassword, user.password || " ");
        if(!ispasswordCorrct){
           return res.status(400).json({ error: "Invalid Current Password" });
        }
        if(newPassword.length < 6){
          return res.status(400).json({ error: "Password must be at least 6 characters" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedhpassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedhpassword;
      }
      
    //    if(profileImg){
    //     if(user.profileImg){
    //         await clodninary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
    //     }
    //  const uploadResopnse = await clodninary.uploader.upload(profileImg);
    //  profileImg = uploadResopnse.secure_url;
    // }
    // if(coverImg){
    //     if(user.coverImg){
    //         await clodninary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
    //     }
    //     const uploadResopnse = await clodninary.uploader.upload(coverImg);
    //     coverImg = uploadResopnse.secure_url;
    //    }


       user.username = username || user.username;
       user.fullname = fullname || user.fullname;
       user.email = email || user.email;
       user.bio = bio || user.bio;
       user.link = link || user.link;
    //    user.profileImg = profileImg || user.profileImg;
    //    user.coverImg = coverImg || user.coverImg;
       await user.save();
       res.status(200).json({ message: "Update Successfully" });
        
    } catch (error) {
        console.log(`Error in user profile conntroller : ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const updatecoverimage = async (req, res) => {
    try {

        const userId = req.user._id; // Assuming `req.user` is populated by auth middleware
        const { coverimg } = req.body;

        if (!coverimg) {
            return res.status(400).json({ message: "Cover image URL is required." });
          }
      
          const user = await User.findByIdAndUpdate(
            userId,
            { coverImg: coverimg },
            { new: true }
          );
      
          if (!user) {
            return res.status(404).json({ message: "User not found." });
          }
      
          res.status(200).json({ message: "Cover image updated successfully!", user });
        } catch (error) {
          console.error("Error updating cover image:", error.message);
          res.status(500).json({ message: "Internal Server Error" });
        }
      };



      export const updateProfileimage = async (req, res) => {
        try {
    
            const userId = req.user._id; // Assuming `req.user` is populated by auth middleware
            const { profileimg } = req.body;
            console.log(profileimg);
            console.log(userId);
            
            
    
            if (!profileimg) {
                return res.status(400).json({ message: "profile image URL is required." });
              }
          
              const user = await User.findByIdAndUpdate(
                userId,
                { profileimg: profileimg },
                { new: true }
              );
          
              if (!user) {
                return res.status(404).json({ message: "User not found." });
              }
          
              res.status(200).json({ message: "profile image updated successfully!", user });
            } catch (error) {
              console.error("Error updating cover image:", error.message);
              res.status(500).json({ message: "Internal Server Error" });
            }
          };
    

    

  
    
       
        

        
