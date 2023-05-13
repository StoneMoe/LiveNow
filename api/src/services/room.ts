import { BizError } from '../errors/generic'
import i from '../i18n/base'
import { Rooms } from '../models/rooms'
import { Users } from '../models/users'
import { Env, Req } from '../typing'
import Cloudflare from '../utils/cloudflare'

export class RoomServ {
    static async createRoom(env: Env, req: Req, ownerId: number, display: string) {
        const owner = await Users.getById(env, ownerId)
        if (!owner) throw new BizError(i(req, 'invalid room owner'))

        const room = await Rooms.getByOwnerId(env, ownerId)
        if (room) throw new BizError(i(req, 'room already existed'))

        const cf = Cloudflare.fromEnv(env)
        const input = await cf.createLiveInput(owner.username, owner.id)
        if (!input.success) throw new Error(i(req, 'stream create failed'))

        const metric = await Rooms.insertOne(env, ownerId, display, input.result.uid)
        return { metric, ...input }
    }
    static async getRoom(env: Env, req: Req, roomId: number) {
        const room = await Rooms.getById(env, roomId)
        if (!room) throw new BizError(i(req, 'room not found'))
        const cf = Cloudflare.fromEnv(env)
        const input = await cf.getLiveInput(room.inputId)
        if (!input.success) throw new Error(i(req, 'stream retrieve failed'))

        const pubInfo = {
            display: room.display,
            status: input.result.status?.current.state, // status is not consistent
            whepUrl: input.result.webRTCPlayback.url
        }
        const privInfo = {
            display: room.display,
            status: input.result.status?.current.state, // status is not consistent
            whipUrl: input.result.webRTC.url,
            whepUrl: input.result.webRTCPlayback.url
        }

        return {
            room: room,
            ownerData: privInfo,
            viewerData: pubInfo
        }
    }
}
