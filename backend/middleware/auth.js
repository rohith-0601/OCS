import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async(req,res,next) =>{
    let token;

    if(req.heaaders.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return res.status(401).json({
            success : false,
            message : "Not authorized,no token",
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(401).json({
                success : false,
                message : "User does not exist",
            });
        }

        if(!user.isActive){
            return res.status(401).json({
                success : false,
                message : "Your acc is deactivated"
            });
        }

        req.user = user;
        next();
    }catch(error){
        return res.status(401).json({
            success : false,
            messsage : "not authorized"
        });
    }
};

export {protect};