import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  persist: true,
  state: () => ({
    token: '',
    userInfo: {
      id: 0,
      username: '',
      display: '',
      isAdmin: false,
      roomId: 0
    }
  }),
  actions: {
    authed() {
      return !!this.token
    },
    getDisplay() {
      return this.authed() ? this.userInfo.display : '尚未登录'
    },
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    },
    logout() {
      this.token = ''
      this.userInfo.id = 0
      this.userInfo.username = ''
      this.userInfo.display = ''
      this.userInfo.isAdmin = false
    }
  }
})
