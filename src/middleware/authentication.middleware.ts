import { verifyJwt } from '../utils/jwt.utils';
import { Response, NextFunction } from "express";
import logger from '../utils/logger';
import { AuthRequset } from '../types/request.types';
import config from "config";
import { reIssueAccessToken } from '../services/session.service';
import { cleanRegex } from 'zod/v4/core/util.cjs';

export const authenticate = async (req: AuthRequset, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token: string | undefined;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        // return res.status(401).json({ status: 'failed', msg: 'no token provided' });
    }else if (req.headers["x-access-token"]) {
        token = req.headers["x-access-token"] as string;
    }
    logger.info("New Token",token)
    if (!token) {
        return res.status(401).json({success:false, error:'no token provided'})
    }
    const refreshToken = req.cookies.refreshToken;
    logger.warn("token: ", token);
    try {
        logger.info("inside the try catch block")
        const { decoded, expired } = verifyJwt(token, config.get<string>("access_key"));
        if (decoded) {
            logger.info("user token: ");
            logger.info(decoded);
            req.user = decoded
            return next();
        }

        if (expired && refreshToken) {
            logger.warn("token is expired")
            console.log("refresh token:",refreshToken);
            
            const newAccessToken = await reIssueAccessToken({ refreshToken })

            if (newAccessToken) {
                logger.info("new access token:")
                logger.info(newAccessToken)
                res.setHeader("x-access-token", newAccessToken);
            }
            const result = verifyJwt(newAccessToken as string, config.get("access_key"));
            req.user = result.decoded;
            return next();
        }
        return res.status(401).json({ status: "failed", error: "Invalid or expired token" });
    } catch (error) {
        logger.error(error)
        return res.status(500).json({ status: 'failed', error: 'Authentication error' });
    }
}