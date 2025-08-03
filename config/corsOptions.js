import { whiteList } from "./allowedOrigins.js"

export const corsOptions = {
        origin: (origin, callback) => {
            if(whiteList.indexOf(origin) !== -1 || !origin) {
                callback(null, true)
            } else {
                callback(new Error('Not Allowed By Cors'))
            }
        },
        optionsSuccessStatus: 200
    }