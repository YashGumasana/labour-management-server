import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response } from 'express'
import http from 'http'
import cors from 'cors'
import { mongooseConnection } from './database/connection'
import { router } from './Routes'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'

const app = express();
app.use(cors())
app.use(cookieParser());
app.use(mongooseConnection)
app.use(express.json())
app.use(fileUpload({ useTempFiles: true }));


app.get('/', (req, res) => {
    res.send('Hello world!');
})
const health = (req: Request, res: Response) => {
    return res.status(200).json({
        message: "Zois backend server is running",
    })
}

const bad_gateway = (req: Request, res: Response) => {
    return res.status(502).json({ status: 502, message: "Zois Backend API Bad Gateway" })
}

app.get('/', health);
app.get('/health', health);
app.get('/isServerUp', (req: Request, res: Response) => {
    res.send('Server is running');
})

app.use(router)
app.use('*', bad_gateway)

let server = new http.Server(app);
export default server