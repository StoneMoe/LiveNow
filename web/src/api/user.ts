import axios from 'axios'
import type { APIBody } from './base'

export async function apiUserLogin(username: string, password: string): Promise<APIBody<string>> {
  const response = await axios.post('/api/user/login', { username, password })
  return response.data
}

export async function apiUserRegister(display: string, username: string, password: string): Promise<APIBody<null>> {
  const response = await axios.post('/api/user/register', { display, username, password })
  return response.data
}

export interface UserListItem {
  id: number
  username: string
  display: string
  isAdmin: boolean
}

export async function apiUserList(): Promise<APIBody<UserListItem[]>> {
  const response = await axios.get('/api/user/list')
  return response.data
}

export interface UserInfo {
  id: number
  username: string
  display: string
  isAdmin: boolean
  roomId: number | null
}

export async function apiUserInfo(): Promise<APIBody<UserInfo>> {
  const response = await axios.get('/api/user/info')
  return response.data
}
