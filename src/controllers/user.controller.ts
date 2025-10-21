import User from "../models/user.model";
import { Request, Response, Errback } from "express";
import logger from "../utils/logger";
import { createAdmin, createUser } from "../services/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import config from "config";
import { transporter, verifyEmailTemplate } from '../utils/sendMail'
import { AuthRequset } from "../types/request.types";

export const createUserHandler = async (req: Request<{}, {}, CreateUserInput["body"]>, res: Response) => {
    try {
        const checkExist = await User.findOne({ email: req.body.email });
        if (checkExist) {
            logger.warn('there is a user with the same email')
            return res.status(400).json({ success: false, msg: 'Invalied credintiales' });
        }
        const user = await User.create({
            email: req.body.email,
            name:req.body.name,
            password:req.body.password,
            isVerified: false
        })
        const token = signJwt({email: req.body.email,name: req.body.name, userId: user._id}, config.get<string>("access_key"), {expiresIn: config.get("expires_in")})
        const verifyLinkHandler = `http://localhost:1337/api/user/verify?token=${token}`

        const html = verifyEmailTemplate(verifyLinkHandler)
        
        await transporter.sendMail({
            from: config.get<string>("senderEmail"),
            to: req.body.email,
            subject: "Verify your email",
            html
        })
        return res.status(200).json({ success: true, msg: 'Verification email sent'});
    } catch (error: any) {
        logger.error(error);
        return res.status(409).json({ success: false, err: `error while creating user ${error.message}` }) //409 means conflict
    }
}

export const verifyEmail = async (req:AuthRequset, res: Response) => {
    try {
        logger.info("verifing email")
        let token = req.query.token?.toString();
        logger.info(token);
        logger.warn(token)
        if (!token) {
            throw Error("token not found");
        }
        const { decoded } = verifyJwt(token, config.get<string>("access_key"));
        logger.info(decoded);
        if (!decoded) {
            return res.status(400).send("Invalid or expired token");
        }
        const {userId} = decoded as {userId:string};
        const user = await User.findByIdAndUpdate(userId, {isVerified:true},{new:true})
        if (!user) {
            return res.status(404).send("User not found");
        }
         return res.status(200).send("<h2>Email verified successfully! You can now log in.</h2>");
    } catch (error:any) {
        return res.status(409).json({ success: false, err: `Invalid or expired token ${error.message}`})
    }
}

export const createAdminHandler = (role: any) => {
    return async (req: Request<{}, {}, CreateUserInput["body"]>, res: Response) => {
        try {
            if (role === 'admin') {
                const checkExistingAdmin = await User.findOne({ role: 'admin' });
                if (checkExistingAdmin) {
                    console.error('there is an Admin in the system');
                    return res.status(301).json({
                        success: false,
                        msg: 'Register request is denied'
                    })
                }
            }
            const admin = await createAdmin(req.body);
            const { password, ...userWithoutPassword } = admin.toJSON();
            return res.status(200).json({ success: true, msg: 'admin created successfully', data: userWithoutPassword });
        } catch (err) {
            logger.error(err);
            return res.status(409).json({ success: false, msg: 'error while creating user', err })
        }
    }
}
