import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId , io } from "../lib/socket.js";
// this was for fetching other user Ids, to show in side bar !
export const getUsersForSidebar = async (req,res) => {
    try {
        const loggedInUserId = req.user._id;
        // by the below we can get the list of user except the one we are talking to 
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUsersforSideBar: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

// this is for seeing the message and all of conversation history when tapped on any user!
export const getMessages = async (req,res) => {
    try {
        const { id:userToChatId } = req.params; // as we are using dynamic :id in the route we need to get req.params to ger other used id
        const myId = req.user._id; //_id : means your id which is authenticated !

        // this finds out all the messages into an array via or condition for either my to other or orher to myid type of messages !
        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({error: "Internal server error "});
    }
};

// this is the one which will be used to send messages it will be either text or image
export const sendMessage = async (req,res) => {
    try {
        const {text, image } = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        // checks if the user uploads any image or not 
        let imageUrl;
        if (image) {
            //upload base64 img to cloudinary as a temp storage
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        //this creates a message : message template
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl, //either this will be undefined or it will be saved via cloudinary 
        });

        // saves the message in the database 
        await newMessage.save();

        // todo : realtime functionality goes here=> socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({error: "Internal server error "});
    }
};
