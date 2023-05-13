<template>
  <div class="view">
    <!--header area-->
    <div class="room-header">
      <el-skeleton class="left" animated v-if="loading">
        <template #template>
          <el-skeleton-item variant="h1" style="width: 10%" />
          <el-skeleton-item variant="p" style="width: 5%" />
        </template>
      </el-skeleton>
      <div class="left" v-if="!loading">
        <h1>{{ roomInfo.display }}</h1>
        <el-text type="info">{{ statusMap[roomInfo.status] }}</el-text>
      </div>

      <el-skeleton class="right" animated v-if="loading">
        <template #template>
          <el-skeleton-item variant="button" />
        </template>
      </el-skeleton>
      <div class="right">
        <el-button type="info" @click="showWHIPUrl" v-if="roomInfo.whipUrl">通过浏览器直播</el-button>
        <el-button type="danger" @click="showWHIPUrl" v-if="roomInfo.whipUrl">绝密的推流信息</el-button>
      </div>
    </div>

    <!--video area-->
    <el-skeleton animated v-if="loading">
      <template #template>
        <el-skeleton-item variant="image" style="width: 100%; height: 300px" />
      </template>
    </el-skeleton>
    <div style="position: relative" v-if="!loading">
      <video @contextmenu.prevent="showNerdInfo" id="remote-video" controls autoplay muted></video>
      <div class="debug-info" v-if="nerdMode">
        <p>Browser: {{ adapter.browserDetails.browser }} {{ adapter.browserDetails.version }}</p>
        <p>input: {{ roomInfo.status }}</p>
        <p>playback: -</p>
        <p>Video Pkt: {{ playbackStat.videoPktLoss }}/{{ playbackStat.videoPktRecv }}</p>
        <p>Audio Pkt: {{ playbackStat.audioPktLoss }}/{{ playbackStat.audioPktRecv }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import adapter from 'webrtc-adapter'
import { apiRoomInfo } from '@/api/room'
import { onBeforeUnmount, onMounted, ref, h, reactive } from 'vue'
import WHEPClient from '@/utils/WHEPClient'
import { ElMessageBox } from 'element-plus'
import type { RoomInfo } from '@/api/room'
import router from '@/router'

const props = defineProps({
  roomId: {
    type: String,
    required: true
  }
})
const loading = ref<Boolean>(true)
const nerdMode = ref<Boolean>(false)
const roomInfo = ref<RoomInfo>({
  display: '',
  status: '',
  whepUrl: '',
  whipUrl: null
})
const playbackStat = reactive({
  videoPktLoss: 0,
  videoPktRecv: 0,
  audioPktLoss: 0,
  audioPktRecv: 0
})

let stopLoops = false
var client: WHEPClient | null = null
const statusMap: Record<string, string> = {
  disconnected: '等待推流',
  connected: '正在直播'
}

function showNerdInfo() {
  nerdMode.value = !nerdMode.value
}

function showWHIPUrl() {
  ElMessageBox.alert(h('div', { class: 'message-wrap', innerHTML: roomInfo.value.whipUrl }), 'WHIP推流地址')
}

async function loadRoomInfo() {
  console.log('room fetching')
  const resp = await apiRoomInfo(parseInt(props.roomId))
  if (resp.code == 0) {
    roomInfo.value = resp.data
    loading.value = false
    return true
  } else {
    return false
  }
}

function mantainingLoop() {
  setTimeout(async () => {
    if (stopLoops) return

    // room info & playback tracking
    await loadRoomInfo()
    if (roomInfo.value.status == 'disconnected' && client?.connActive()) {
      client.close()
    } else if (roomInfo.value.status == 'connected' && !client?.connActive()) {
      initPlayback()
    }

    mantainingLoop()
  }, 7000)
}

function statLoop() {
  setTimeout(async () => {
    if (stopLoops) return

    // playback stat
    if (client) {
      const statsReport = await client.peerConn.getStats()
      statsReport.forEach((report) => {
        if (report.type === 'inbound-rtp') {
          const packetsLost = report.packetsLost
          const packetsReceived = report.packetsReceived
          const track = report.kind
          if (track == 'audio') {
            playbackStat.audioPktLoss = packetsLost
            playbackStat.audioPktRecv = packetsReceived
          }
          if (track == 'video') {
            playbackStat.videoPktLoss = packetsLost
            playbackStat.videoPktRecv = packetsReceived
          }
        }
      })
    }

    statLoop()
  }, 1000)
}

function initPlayback() {
  console.log('playback initializing')
  const videoElement = document.getElementById('remote-video')
  client = new WHEPClient(roomInfo.value.whepUrl, videoElement as HTMLVideoElement)
}

onMounted(async () => {
  if (await loadRoomInfo()) {
    initPlayback()
    mantainingLoop()
    statLoop()
  } else {
    router.push({ name: 'Home' })
  }
})

onBeforeUnmount(async () => {
  if (client) client.close()
  stopLoops = true
})
</script>

<style scoped lang="less">
.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 10px;
  height: 70px;

  .left {
    display: flex;
    flex-direction: column;
  }
  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

.debug-info {
  color: white;
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40%;
  height: 40%;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
}

#remote-video {
  width: 100%;
}
</style>
