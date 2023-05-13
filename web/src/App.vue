<template>
  <div>
    <el-container>
      <el-header>
        <el-menu mode="horizontal" :ellipsis="false" router>
          <img src="./assets/logo.svg" style="height: 56px; width: 30px; margin: 0 20px" />
          <el-menu-item v-for="rule in $router.options.routes.filter((r) => !!r.meta?.display)" :index="rule.path">{{ rule.meta?.display }}</el-menu-item>
          <div class="flex-grow" />
          <el-menu-item @click="loginVisible = true" v-if="!authStore.authed()">登录</el-menu-item>
          <el-menu-item @click="registerVisible = true" v-if="!authStore.authed()">注册</el-menu-item>
          <el-menu-item @click="gotoMyRoom" v-if="authStore.authed()">{{ authStore.getDisplay() }} 的直播间</el-menu-item>
          <el-menu-item @click="logout" v-if="authStore.authed()">登出</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <LoginDialog v-model="loginVisible" />
    <RegisterDialog v-model="registerVisible" />
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import LoginDialog from '@/components/LoginDialog.vue'
import RegisterDialog from '@/components/RegisterDialog.vue'
import { useAuthStore } from './stores/stores'
import router from './router'
import { ElNotification } from 'element-plus'
import { ref } from 'vue'

const authStore = useAuthStore()
const loginVisible = ref(false)
const registerVisible = ref(false)

function logout() {
  authStore.logout()
}

function gotoMyRoom() {
  if (!authStore.userInfo.roomId) {
    ElNotification({ title: 'Oops', message: '尚未开通直播间', duration: 5000 })
    return
  }
  router.push({ name: 'RoomView', params: { roomId: authStore.userInfo.roomId } })
}
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>
