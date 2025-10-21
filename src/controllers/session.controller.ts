import { createSession, findSessions, updateSession } from "../services/session.service";
import { createNewAcessToken, validatePassword } from "../services/user.service";
import { Request, Response } from "express";
import { signJwt, signRefreshJwt } from "../utils/jwt.utils";
import logger from "../utils/logger";
import ms from 'ms';
import config from "config";
import { AuthRequset } from "../types/request.types";

const refreshExpire = config.get<number>("refresh_expires_in");
const refreshExprireMs = ms(refreshExpire); //604800000 -> 7 days

//login and create session controller
export const createSessionHandler = async (req: Request, res: Response) => {
    const user = await validatePassword(req.body);
    if (!user) {
        return res.status(401).json({ status: 'falied', msg: 'Invalied email or password' })
    }
    if (user.isVerified === false) {
        return res.status(403).json({success:false, msg: "user is not verified"})
    }
    const userId = user._id.toString();
    const session = await createSession(userId, req.get("user-agent") || "", new Date(Date.now() + refreshExprireMs));
    const accessToken = signJwt({ ...user, session: session._id }, config.get<string>("access_key"), { expiresIn: config.get("expires_in") });
    const refreshToken = signRefreshJwt({ ...user, session: session._id }, config.get<string>("refresh_key"), { expiresIn: config.get("refresh_expires_in") });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
    })
    return res.status(200).json({ status: "success", msg: 'session created successfully', accessToken: accessToken });
}

export const getUserSessionHandler = async (req: AuthRequset, res: Response) => {
    const user = req.user;
    logger.warn("user inside the handler");
    logger.warn(user);
    if (!user) {
        return res.status(404).json({ status: 'failed', msg: "user not found" });
    }
    const session = await findSessions({ user: user._id, valid: true });
    return res.status(200).json({ status: 'success', userSession: session })
}

export const deleteSessionHandler = async (req: AuthRequset, res: Response) => {
    const sessionId = req.user!.session;
    if (!sessionId) {
        return res.status(404).json({ status: 'failed', msg: "session not found" });
    }
    await updateSession({_id:sessionId},{valid:false});
    return res.status(200).json({status: 'success' , msg: 'session deleted successfully'})

}

export const refreshHandler = async (req:AuthRequset , res:Response) => {
    const user = req.user;
    if (!user) {
        return res.status(404).json({ status: 'failed', msg: "user not found" });
    }
    const session = await findSessions({ user: user._id, valid: true })
    const accessToken = await createNewAcessToken(user.refreshToken,{ ...user, session: session[0]._id }, { expiresIn: config.get("expires_in") })
    return res.status(200).json({status: 'success', msg: 'new access token is created', accessToken:accessToken});
}