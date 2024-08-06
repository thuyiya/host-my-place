import { RedisClientType } from 'redis'
import { v4 as uuidv4} from 'uuid'

export const createConfirmedEmailLink = async (url: string, userId: string, redis: RedisClientType) => {
    const id = uuidv4()
    await redis.set(id, userId, {
        EX: 60*60*24,
    })
    return `${url}/confirm/${id}`
}