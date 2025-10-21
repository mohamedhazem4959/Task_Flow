import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import http from "http";
import { Server } from "socket.io";
import { connectRedis } from "./utils/redisClient";
import cors from "cors";
import config from 'config';
import connect from "./utils/conncet";
import logger from "./utils/logger";
import healthRoute from "./routes/healthCheck.routes";
import userRoutes from "./routes/user.routes";
import cookie from "cookie-parser";
import tasksRoutes from "./routes/tasks.routes";
import projectsRoutes from './routes/project.routes';
const app = express();
const port = config.get<number>('port');

app.use(express.json());
app.use(cookie());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
});


io.on('connection', (socket) => {
    logger.info(`🟢 User connected: ${socket.id}`);

    socket.on("joinProject", (projectId: string) => {
        socket.join(projectId);
        logger.info(`User ${socket.id} joined project room: ${projectId}`);
    });
    socket.on('disconnect', () => {
        logger.warn(`🔴 User disconnected: ${socket.id}`);
    });
});

export { io }

app.use('/api', healthRoute);
app.use('/api/user', userRoutes);
app.use('/api/tasks',tasksRoutes);
app.use('/api/v1/projects', projectsRoutes);

server.listen(port, async () => {
    logger.info(`🟢 App is running on http://localhost:${port}`)
    await connect(); //MongoDB
    await connectRedis(); // redis cache server
})