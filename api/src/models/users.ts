import { Env } from '../typing'

export interface User {
    id: number
    username: string
    display: string
    password: string
    isAdmin: boolean
}

export class Users {
    static async getByUsername(env: Env, username: string) {
        return env.DB.prepare('select * from users where username = ?').bind(username).first<User | null>()
    }
    static async getByDisplay(env: Env, display: string) {
        return env.DB.prepare('select * from users where display = ?').bind(display).first<User | null>()
    }
    static async getById(env: Env, id: number) {
        return env.DB.prepare('select * from users where id = ?').bind(id).first<User | null>()
    }
    static async add(env: Env, username: string, display: string, cipheredPassword: string, isAdmin: boolean) {
        return env.DB.prepare('INSERT INTO users (username, display, password, isAdmin) VALUES (?, ?, ?, ?);')
            .bind(username, display, cipheredPassword, isAdmin ? 1 : 0)
            .run()
    }
}
