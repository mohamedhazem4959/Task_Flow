import { Document, FilterQuery } from "mongoose";
import User,{IUser, IUserDocument} from '../models/user.model';
import logger from "../utils/logger";
import {signJwt, verifyRefreshJwt} from '../utils/jwt.utils'
import  config  from "config";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { redisClient } from "../utils/redisClient";

export async function createUser(input:IUser) {
    try {
        
        return await User.create(input);
    } catch (e:any) {
        throw new Error(e);
    }
}

export async function createAdmin(input:IUser) {
    try {
        const adminData = {...input, role: 'admin'};
        return await User.create(adminData);
    } catch (e:any) {
        throw new Error(e.message || 'Error creating admin');
    }
}

//to check the password then reutrn the user object WITHOUT PASSWORD!!!!!!
export async function validatePassword({ email, password }: { email: string, password: string }) {
    const user = await User.findOne({email:email});
    if (!user) {
        logger.error('can not find the user in email');
        return false;
    }
    logger.warn(password);
    const checkPassword = await user.comparePassword(password);
    if (!checkPassword) {
        logger.error('password is incorrect');
        return false;
    }
    const { password: _password, ...userWithoutPassword } = user.toJSON();
    logger.warn(password);
    logger.info(userWithoutPassword);
    return userWithoutPassword;
}


export async function createNewAcessToken(refreshToken:string, payload:object, options?: jwt.SignOptions | undefined) {
    const checkRefreshToken = verifyRefreshJwt(refreshToken, config.get<string>("refresh_key"));
    if (!checkRefreshToken) {
        return false; 
    }
    const newAcessToken = signJwt(payload,config.get<string>("access_key"));
    return newAcessToken;
}

export async function findUser(query: FilterQuery<IUserDocument>) {
  return User.findOne(query).lean();
}

// export async function getUserIdByEmail(email:string) {
//     const cacheKey = `user:${email}`;

//     const cached = await redisClient.get(cacheKey);
//     if(cached) return cached;

//     const user = await User.findOne({email}).select("_id");
//     if(!user) throw new Error("user not found");
    
//     await redisClient.set(cacheKey, user._id.toString(), {expiration:})
// }