import jwt from "jsonwebtoken"
export const generateToken= (userId, res) => {
    // creating token 
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d",
    });
    // sendig it to user as cookie which is gonna live 7d - also only allows https for security
    res.cookie("jwt", token, {
        maxAge : 7*24*60*60*1000, //Converted to millisec
        httpOnly: true, // it prevents XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgetry attacks
        secure: process.env.NODE_ENV !== "development",
    })

    return token;
};


