<template>
  <div class="view">
    <el-skeleton animated :rows="5" v-if="loading" />
    <div v-if="!loading">
      <ul>
        <li v-for="room in rooms" :key="room.id">
          <router-link :to="{ name: 'RoomView', params: { roomId: room.id } }">{{ room.display }}</router-link>
        </li>
      </ul>
      <p v-if="!rooms">一个房间都没有</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { apiRoomList, type RoomListItem } from '@/api/room'

const loading = ref<Boolean>(true)
const rooms = ref<RoomListItem[]>([])

onMounted(async () => {
  rooms.value = (await apiRoomList()).data
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
