import { Request, Response } from 'express';
import httpStatus from 'http-status';
import AuthService from '../services/AuthService';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/CatchAsync';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import config from '../config/Index'

const signUp = catchAsync(async (req: Request, res: Response) => {
    const { email, name, password } = req.body

    const existingUser = await AuthService.find(email)
    if (existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already registered.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await AuthService.create(email, name, hashedPassword)

    res.json(user)
})

const signIn = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await AuthService.find(email)
    if (!existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Credentials')
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password)
    if (!matchPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Credentials')
    }

    const accessToken = jwt.sign(
        { email: existingUser.email, id: existingUser.id },
        config.secretkey, { expiresIn: '24h' }
    )
    const user = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name
    }

    res.json({ user, accessToken })
})

const getCurrentUser = catchAsync(async (req: any, res: Response) => {
    const loggedInUser = req.user
    if (!loggedInUser)
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found.')
    res.json({
        user: await AuthService.find(loggedInUser.email)
    })
})

export default {
    signUp,
    signIn,
    getCurrentUser
}