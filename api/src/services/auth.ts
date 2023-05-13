import { BizError, InvalidSessError } from '../errors/generic'
import { User, Users } from '../models/users'
import { Env, Req } from '../typing'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { PasswordUtil } from '../utils/password'
import i from '../i18n/base'

interface Session extends Omit<User, 'password'> {}

export class Auth {
    static async login(env: Env, username: string, password: string): Promise<string | null> {
        const user = await Users.getByUsername(env, username)
        if (!user) return null

        const pwdOk = await PasswordUtil.verify(password, user.password)
        if (!pwdOk) return null

        const sess: Session = { id: user.id, username: user.username, display: user.display, isAdmin: user.isAdmin }
        const token = await jwt.sign(sess, env.JWT_KEY)
        return token
    }
    static async parse(env: Env, req: Req): Promise<Session | null> {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null
        }

        const token = authHeader.slice('Bearer '.length)
        const ok = await jwt.verify(token, env.JWT_KEY)
        if (!ok) {
            return null
        }
        const decodedToken = jwt.decode(token)
        return decodedToken.payload as Session
    }
    static async isLoggedIn(env: Env, req: Req): Promise<boolean> {
        try {
            const sess = await this.parse(env, req)
            return !!sess?.id
        } catch (error) {
            return false
        }
    }
    static async getCurrentUser(env: Env, req: Req) {
        const sess = await this.parse(env, req)
        if (!sess) throw new BizError(i(req, 'not logged in'))

        const u = await Users.getById(env, sess.id)
        if (!u) throw new InvalidSessError(i(req, 'user not found'))

        return u
    }
    static async getCurrentAdmin(env: Env, req: Req) {
        const u = await this.getCurrentUser(env, req)
        if (!u.isAdmin) throw new BizError(i(req, 'user is not admin'))

        return u
    }
}
