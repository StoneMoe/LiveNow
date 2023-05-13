<template>
  <el-dialog title="登录" v-model="visible" width="500">
    <el-form :model="form" :rules="rules" label-width="auto">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="login" width="100%">登录</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/stores'
import { apiUserInfo, apiUserLogin } from '@/api/user'
import { ElNotification } from 'element-plus'

const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})
const form = reactive({
  username: '',
  password: ''
})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const login = async () => {
  const { username, password } = form
  try {
    const response = await apiUserLogin(username, password)
    const token = response.data
    if (!token) {
      ElNotification({ title: '错误', message: '用户名或密码错误', duration: 5000 })
      return
    }

    const store = useAuthStore()
    store.setToken(token)

    const userInfoResp = await apiUserInfo()
    store.setUserInfo(userInfoResp.data)
    visible.value = false
  } catch (error) {
    ElNotification({ title: '错误', message: error as any, duration: 0 })
    console.error(error)
  }
}
</script>

<style scoped></style>
