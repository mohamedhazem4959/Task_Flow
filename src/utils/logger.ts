import { createLogger, format, transports, Logger } from "winston";
import type { TransformableInfo } from "logform"; // Winston uses logform under the hood

const { combine, timestamp, printf, colorize, splat, json } = format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
  splat(),
  printf((info: TransformableInfo) => {
    const { level, message, timestamp, ...meta } = info;
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

const prodFormat = combine(timestamp(), json());

const logger: Logger = createLogger({
  level: "info",
  format: devFormat,
  transports: [new transports.Console()],
});


export default logger;





// import logger from 'pino';
// import dayjs from "dayjs";

// const log = logger({
//     base:{ pid: false},
//     timestamp:() => `, "time":" ${dayjs().format()}`,
//     transport:{
//         target: "pino-pretty",
//         options: {
//             colorize:true,
//             translateTime:false
//         }
//     },
// })
// export default log;
