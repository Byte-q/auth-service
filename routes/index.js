import authRouter from "./auth-route.js";

export function setupRoutes(app) {
    app.use('/auth', authRouter);
}