import { ZodError, ZodType, z } from "zod";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        })
        next()
    } catch (e: unknown) {
         if (e instanceof ZodError) {
        return res.status(400).json({
          success: false,
          errors: e.issues.map((issue) => ({
            path: issue.path.join("."), // e.g. "body.email"
            message: issue.message,     // e.g. "Invalid email address"
          })),
        });
      }
    logger.error('error inside the validate middleware', e)
    res.status(400).json({ success: false, err: `error in the validation:${e}`});
}
};

export default validate