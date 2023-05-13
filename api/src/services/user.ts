import { BizError } from '../errors/generic'
import i from '../i18n/base'
import { Users } from '../models/users'
import { Env, Req } from '../typing'
import { PasswordUtil } from '../utils/password'

export class UserServ {
    static async createUser(env: Env, req: Req, username: string, display: string, password: string, isAdmin: boolean) {
        //username
        if (!/^[a-z_]+$/.test(username)) {
            throw new BizError(i(req, 'Username can only contain lowercase letters and underscores'))
        }
        if (username.length < 3) {
            throw new BizError(i(req, 'Username must be at least 3 characters long'))
        }
        //display
        if (!display || /\s+/.test(display)) {
            throw new BizError(i(req, 'Nickname cannot contain spaces'))
        }
        if (display.length < 2) {
            throw new BizError(i(req, 'Nickname must be at least 2 characters long'))
        }
        //password
        if (password.length < 8) {
            throw new BizError(i(req, 'Password must be at least 8 characters long'))
        }
        if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/.test(password)) {
            throw new BizError(i(req, 'Password can only contain alphabets, numbers, and special characters'))
        }
        const usernameExisted = await Users.getByUsername(env, username)
        if (usernameExisted) {
            throw new BizError(i(req, 'Username already exists'))
        }
        const displayExisted = await Users.getByDisplay(env, display)
        if (displayExisted) {
            throw new BizError(i(req, 'Nickname already exists'))
        }
        const hashedPwd = await PasswordUtil.encrypt(password)
        return Users.add(env, username, display, hashedPwd, isAdmin)
    }
    static async countUser(env: Env): Promise<number> {
        const stmt = env.DB.prepare('SELECT COUNT(1) AS total FROM users')
        return stmt.first('total')
    }
}
