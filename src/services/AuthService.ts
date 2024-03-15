import { prisma } from '../utils/PrismaClient';

const create = async (email: string, name: string, password: string) => {
    return await prisma.user.create({
        data: {
            email,
            name,
            password
        }
    })
}

const authgoogleuser = async (googleId: string, displayName: string) => {
    return await prisma.authId.create({
        data: {
            googleId,
            displayName
        }
    })
}

const authfacebookuser = async (facebookId: string, displayName: string) => {
    return await prisma.authId.create({
        data: {
            facebookId,
            displayName
        }
    })
}

const find = async (email: string) => {
    return await prisma.user.findFirst({
        where: {
            email
        }
    })
}

export default {
    create,
    find,
    authgoogleuser,
    authfacebookuser
}