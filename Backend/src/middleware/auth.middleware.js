import jwt from "jsonwebtoken"; //since we want to validate token we need jwt package
import user from "../models/user.model.js"; //we will need this, as related to authentication 
import User from "../models/user.model.js";


// here we are not only using req-request, res-respone function we are also using next function which means that if the protectRoute is true it will be passed on and allow the next function call which is UpdateProfile to execute
export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt; //we added .jwt extension because in utils file we created token as this way only -line 8

        if(!token)
        {
            return res.status(401).json({message: "Unauthorized - No Token Provided" });
        }
        
        //Decoding with the help of env JWT_SECRET Otherwise we cant extract values from cookie
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({message: "Unauthorized - Invalid Token" });
        }

        //this will extract the data of the user except the password as we deselect it by writing : ".select("-password")"
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(404).json({message: "User not found" });
        }

        // if both of them are same we will pass on to next !
        req.user = user

        next();
    } catch (error) {
        console.log("Error in ProtectRoute Middleware: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};