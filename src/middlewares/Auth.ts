import { NextFunction, Response } from 'express';
import httpStatus from 'http-status'
import config from '../config/Index';
import jwt from 'jsonwebtoken'
import AuthService from '../services/AuthService';

const auth =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (req: any, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization
            if (accessToken) {
                accessToken.split(' ')[1]
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const payload = jwt.verify(accessToken, config.secretkey) as any
                const email = payload.email
                req.user = await AuthService.find(email)
            } else {
                res.statusCode = httpStatus.UNAUTHORIZED
                return res.send({ message: 'Unauthorized' })
            }
            next()
            return
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            res.statusCode = httpStatus.UNAUTHORIZED
            return res.send({ message: 'Unauthorized' })
        }
    }
export default auth