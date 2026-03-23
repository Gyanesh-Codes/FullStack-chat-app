import express from "express"; //this is our web framework which will help make api and all quickly 
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // to get token from cookie required in middleware for ProtectRoute function - token Validation !

import cors from "cors";

import path from "path";

import {connectDB} from './lib/db.js'
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { app, server } from "./lib/socket.js";

dotenv.config()

const PORT = process.env.PORT
const __dirname = path.resolve();


// 1. CORS must be at the very top!
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

// 2. Body parsers next (👇 INCREASED LIMIT TO 50MB TO FIX CLOUDINARY CRASH)
app.use(express.json({ limit: "50mb" })); //THIS WILL ALLOW TO USE JSON DATA OUT OF THE BODY !
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser()); // it will allow to parse the cookie therefore we can extract values from cookie 

// 3. Routes go last!
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)


// POST - DEPLOYEMENT CHANGES ! 
if(process.env.NODE_ENV==="production")
{
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));

    app.get(/.*/, (req,res) => {
        res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));

    })
}

// 4. Global Error Handler (👇 GUARANTEES A JSON ERROR FOR YOUR TOAST)
app.use((err, req, res, next) => {
    // Specifically catch the payload error if someone somehow uploads a 51MB file
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ message: "Image is too large. Please upload a smaller file." });
    }
    
    // Catch any other server errors and force them into JSON format
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "An unexpected error occurred" });
});

server.listen(PORT, () => {
    console.log("server is running on PORT:"+PORT);
    connectDB();
});
