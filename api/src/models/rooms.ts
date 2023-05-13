import { Env } from "../typing";

export interface Room {
    id: number;
    userId: number;
    display: string;
    inputId: string;  // cloudflare stream live input id
}

export class Rooms {
    static async getByOwnerId(env: Env, ownerId: number) {
        return env.DB.prepare("select * from rooms where userId = ?").bind(ownerId).first<Room | null>()
    }
    static async getById(env: Env, id: number) {
        return env.DB.prepare("select * from rooms where id = ?").bind(id).first<Room | null>()
    }
    static async insertOne(env: Env, ownerId: number, roomDisplay: string, inputId: string) {
        return env.DB.
            prepare("INSERT INTO rooms (userId, display, inputId) VALUES (?,?,?);").
            bind(ownerId, roomDisplay, inputId).run()
    }
}