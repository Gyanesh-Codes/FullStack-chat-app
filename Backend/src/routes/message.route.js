import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";


const router = express.Router();

// it is being fetched for the side bar in the chat box view !
router.get("/users", protectRoute, getUsersForSidebar)

// this is for seeing the message and all of conversation history when tapped on any user!
router.get("/:id",protectRoute, getMessages);

// this is for sending message from myId to user: 
router.post("/send/:id", protectRoute, sendMessage)

export default router; //to index.js this function is transfered !