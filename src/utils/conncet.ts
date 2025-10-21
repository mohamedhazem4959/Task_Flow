import mongoose from "mongoose";
import config from "config";
import logger from './logger'
function connect() {
    const dbUrl = config.get<string>("dbUrl");

    return mongoose.connect(dbUrl)
    .then(()=>{
        logger.info(`🟢 connected to DB`);
    })
    .catch((error)=>{
        logger.error(`Could not connect to DB`)
        process.exit(1);
    });
}

export default connect
