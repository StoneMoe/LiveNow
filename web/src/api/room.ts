import axios from 'axios'
import type { APIBody } from './base'

export interface RoomListItem {
  display: string
  id: number
  inputId: string
  userId: number
}

export async function apiRoomList(): Promise<APIBody<RoomListItem[]>> {
  const response = await axios.get('/api/room/list')
  return response.data
}

export interface RoomInfo {
  display: string
  status: string
  whepUrl: string
  whipUrl: string | null
}

export async function apiRoomInfo(roomId: number): Promise<APIBody<RoomInfo>> {
  const response = await axios.get(`/api/room/info/${roomId}`)
  return response.data
}

export async function apiRoomAdd(userId: number, display: string): Promise<APIBody<any>> {
  const response = await axios.post(`/api/room/add`, { userId, display })
  return response.data
}
