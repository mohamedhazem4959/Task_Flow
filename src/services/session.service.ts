import { FilterQuery, UpdateQuery } from "mongoose";
import Session, { ISessionDocument } from "../models/session.model";
import { signJwt, verifyJwt, verifyRefreshJwt } from "../utils/jwt.utils";
import config from 'config'
import { findUser } from "./user.service";
import logger from "../utils/logger";

export const createSession = async (userId: string, userAgent: string, expiresAt: Date) => {
    const session = await Session.create({ user: userId, userAgent: userAgent, expiresAt: expiresAt });
    return session.toJSON();
}

//find all the sessions with a filter
export const findSessions = async (query: FilterQuery<ISessionDocument>) => {
    return Session.find(query).lean();
}

export const updateSession = async (query: FilterQuery<ISessionDocument>, update: UpdateQuery<ISessionDocument>) => {
    return Session.updateOne(query, update);
}

export const reIssueAccessToken = async ({refreshToken}:{refreshToken:string}) => {
    const { decoded,expired } = verifyRefreshJwt(refreshToken, config.get("refresh_key"));
    logger.warn(expired)
    if (!decoded) {
        logger.warn("no decoded found")
        return false;
    }
    const session = await Session.findById(decoded.session);
    if(!session || !session.valid) return false

    const user = await findUser({_id: session.user});
    if(!user) return false;
    logger.info(user);
    const accessToken = signJwt({...user, session:session._id}, config.get("access_key"),{expiresIn:config.get("expires_in")});

    return accessToken;
}