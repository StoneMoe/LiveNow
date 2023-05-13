<template>
  <div class="view">
    <el-skeleton animated :rows="5" v-if="loading" />
    <div v-if="!loading && users">
      <h2>用户列表</h2>
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="id" label="用户 ID" width="180" />
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="display" label="昵称" />
        <el-table-column prop="isAdmin" label="管理员" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button link type="primary" @click="handleCreateRoom(scope.row)">开通直播间</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { apiUserList, type UserListItem } from '@/api/user'
import { ElNotification } from 'element-plus'
import { apiRoomAdd } from '@/api/room'

const loading = ref<Boolean>(true)
const users = ref<UserListItem[]>([])

async function handleCreateRoom(userData: UserListItem) {
  const resp = await apiRoomAdd(userData.id, `${userData.display}的房间`)
  ElNotification({ title: '', message: resp.data, duration: 0 })
}

onMounted(async () => {
  users.value = (await apiUserList()).data
  loading.value = false
})
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

a {
  color: #409eff;
  text-decoration: none;
}
</style>
