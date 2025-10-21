export default {
    port: 1337,
    dbUrl: "mongodb://localhost:27017/TaskFlow",
    saltWorkFactor: 10,
    access_key: process.env.ACCESS_KEY,
    refresh_key: process.env.REFRESH_KEY,
    expires_in: process.env.JWT_LIFE_TIME,
    refresh_expires_in: process.env.REFRESH_LIFE_TIME,
    redis_client:process.env.REDIS_URL,
    senderEmail:"mohamed2004hazem@gmail.com",
    appPassword:process.env.APP_PASSWORD
}