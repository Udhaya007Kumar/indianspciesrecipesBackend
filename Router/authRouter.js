import express from "express";
import { authSingup,authLogin,authLogout,allUserList,userList} from "../Controllers/authController.js";
import usermiddleware from "../Middleware/userMiddleware.js";



const router = express.Router();

router.post("/signup",authSingup)
router.post("/login",authLogin)
router.post("/logout",authLogout)

router.get("/all",allUserList)
router.get("/user",usermiddleware,userList)



export default router;