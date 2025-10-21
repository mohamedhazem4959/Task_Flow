import express,{ Router,Request,Response,Express } from "express";

const router:Router = express.Router();

router.get('/health-check' , (req:Request, res:Response) => res.sendStatus(200));

export default router;