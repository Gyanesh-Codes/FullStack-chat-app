import express from "express"

// as writing inside codes will make this messy we are gonna import it from the controllers fodlder. 
import {login, logout, signup, udpateProfile, checkAuth} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

// Now we implement below this line of code just for the updation of profile pic is only allowed not username or email ! so we need to make changes in the API part 
router.put("/update-profile", protectRoute, udpateProfile)

// To check the authentication of the user - it is called when the page is refreshed only !
router.get("/check", protectRoute, checkAuth)

export default router; // to index.js this function is transfered !
