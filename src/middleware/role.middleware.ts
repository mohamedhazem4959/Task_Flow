import { NextFunction,Response,Request } from "express"
import { AuthRequset } from "../types/request.types"

export const authorize = (...roles: string[])=>{
    return (req:AuthRequset,res:Response,next:NextFunction) => {
        const role = req.user!.role;
        if (!role) {
            console.log("role is null")
        }
        if(!roles.includes(role)){
            return res.status(403).json({status:'failed', msg:'Access denied'})
        }
        next();
    }
}
