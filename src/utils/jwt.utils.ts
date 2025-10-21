import jwt, { JwtPayload } from "jsonwebtoken";
import config from "config";
import logger from "./logger";


export function signJwt(payload: object, privateKey:string, options?: jwt.SignOptions | undefined) {
    return jwt.sign(payload, privateKey, options);
}
export function signRefreshJwt(payload: object,privateKey:string, options?: jwt.SignOptions | undefined) {
    return jwt.sign(payload, privateKey, options);
}

export function verifyJwt(token: string, privateKey:string) {
    try {
        const decoded = jwt.verify(token, privateKey) as JwtPayload;
        logger.info("decoded token:")
        logger.info(decoded)
        return {
            valid: true,
            expired: false,
            decoded
        };
    } catch (error: any) {
        return {
            valid: false,
            expired: error.message === 'jwt expired',
            decoded: null
        };
    }
}

export function verifyRefreshJwt(token: string, privateKey:string) {
    logger.info(token);
    logger.info(privateKey);
    try {
        logger.info("inside the try catch in the jwt")
        const decoded = jwt.verify(token, privateKey) as JwtPayload;
        logger.warn(decoded);
        return {
            valid: true,
            expired: false,
            decoded
        };
    } catch (error: any) {
        logger.error("there is an error in the jwt utils" , error)
        return {
            valid: false,
            expired: error.message === 'jwt expired',
            decoded: null
        };
    }
}