import { Router } from 'itty-router'
import { Env, Req } from './typing'
import { BizError, InvalidSessError } from './errors/generic'
import { Auth } from './services/auth'
import { APIBody } from './utils/response'
import { RoomServ } from './services/room'
import { Rooms } from './models/rooms'
import { UserServ } from './services/user'
import i from './i18n/base'

const router = Router()

router.get('/', () => APIBody.ok(null, 'Running'))

router.post('/api/user/login', async (req: Req, env: Env) => {
    if (await Auth.isLoggedIn(env, req)) return APIBody.error(i(req, 'already logged in'))

    const { username, password } = await req.json<any>()

    const token = await Auth.login(env, username, password)
    if (!token) throw new BizError(i(req, 'login failed'))

    //todo: captcha
    return APIBody.ok(token)
})

router.post('/api/user/register', async (req: Req, env: Env) => {
    const { display, username, password } = await req.json<any>()
    let asAdmin = false

    if ((await UserServ.countUser(env)) == 0) {
        asAdmin = true
    }

    await UserServ.createUser(env, req, username, display, password, asAdmin)

    //todo: captcha
    return APIBody.ok(null)
})

router.get('/api/user/info', async (req: Req, env: Env) => {
    const u = await Auth.getCurrentUser(env, req)
    const r = await Rooms.getByOwnerId(env, u.id)
    return APIBody.ok({
        id: u.id,
        username: u.username,
        display: u.display,
        isAdmin: u.isAdmin,
        roomId: r?.id || null
    })
})

router.get('/api/user/list', async (req: Req, env: Env) => {
    await Auth.getCurrentAdmin(env, req)
    const users = (await env.DB.prepare('SELECT id, username, display, isAdmin FROM users').all()).results
    return APIBody.ok(users)
})

router.post('/api/user/add', async (req: Req, env: Env) => {
    await Auth.getCurrentAdmin(env, req)
    const { username, display, password, isAdmin } = await req.json<any>()
    const metric = await UserServ.createUser(env, req, username, display, password, isAdmin)
    return APIBody.ok(metric)
})

router.get('/api/room/info/:roomId', async (req: Req, env: Env) => {
    var u
    try {
        u = await Auth.getCurrentUser(env, req)
    } catch {
        u = null
    }

    const resp = await RoomServ.getRoom(env, req, parseInt(req.params.roomId))
    if (u && u.id == resp.room.userId) {
        return APIBody.ok(resp.ownerData)
    } else {
        return APIBody.ok(resp.viewerData)
    }
})

router.post('/api/room/add', async (req: Req, env: Env) => {
    await Auth.getCurrentAdmin(env, req)
    const { userId, display } = await req.json<any>()
    const res = await RoomServ.createRoom(env, req, userId, display)
    return APIBody.ok(res)
})

router.get('/api/room/list', async (req: Req, env: Env) => {
    await Auth.getCurrentUser(env, req)
    const rooms = (await env.DB.prepare('SELECT * FROM rooms').all()).results
    return APIBody.ok(rooms)
})

router.all('*', (req: Req) => APIBody.error(i(req, 'notfound'), 404))

export default (req, ...args) =>
    router.handle(req, ...args).catch(async (err) => {
        if (err instanceof InvalidSessError) {
            return APIBody.error(i(req, 'invalid session'), -1)
        }
        if (err instanceof BizError) {
            return APIBody.error(err)
        }
        // TODO: to sentry
        console.log(err)
        return APIBody.error(err, 1)
    })
