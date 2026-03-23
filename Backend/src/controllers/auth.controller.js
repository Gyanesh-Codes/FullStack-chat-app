import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"


export const signup = async (req,res) => {
    const {fullName,email,password} = req.body
    try {
        // 1. CREATE USER
        // 2. HASH PASSWORDS THROUGH BYCRPYT JS 
        // 3. AUTHENTICATION

        if (!fullName || !email || !password)
        {
            return res.status(400).json({message: "All fields are required to be filled! "});
        }
        if (password.length<6) {
            return res.status(400).json({message: "password must be at least 6 characters "});
        }
        const user = await User.findOne({email});

        if(user) return res.status(400).json({message: "Email already exist "});

        // Password Hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //Creating new user - 
        const newUser = new User ({
            fullName, // fullName: fullName, shorten -> fullName, as same name
            email, // email: email, shorten -> email, as same name
            password: hashedPassword,
        });

        if(newUser)
        {
            // we can generate JWT token here - so will make a function for this
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json ({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else
        {
            res.status(400).json({message: "Invalid user data "});
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error "});
    }
};

export const login = async (req,res) => {
    const {email,password} = req.body
    try {
        const user = await User.findOne({email});

        if(!user)
        {
            return res.status(400).json({message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect)
        {
            return res.status(400).json({message: "Invalid credentials" });
        }

        generateToken(user._id,res)

        res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req,res) => {
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message: "Logged out successfully" });

    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const udpateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        
        if(!profilePic){
            return res.status(400).json({message: "Profile Pic is required : " });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true}) // DOUBT 

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in update profiles: ", error);
        res.status(500).json({message: "Internal server error "});
    }
};

export const checkAuth = (req,res) => {
    try {
        res.status(200).json(req.user); // this will be give authenticated user : send user back to the client !
    } catch (error) {
        console.log("Error in checkAuth controller: ", error);
        res.status(500).json({message: "Internal server error "});
    }
}