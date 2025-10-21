import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthRequset extends Request {
    user?: JwtPayload | null;
}