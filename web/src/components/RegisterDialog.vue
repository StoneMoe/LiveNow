<template>
  <el-dialog title="注册新账户" v-model="visible" width="500">
    <el-form :model="form" :rules="rules" label-width="auto">
      <el-form-item label="昵称" prop="display">
        <el-input v-model="form.display"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="login" width="100%">注册</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { apiUserRegister } from '@/api/user'
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
  display: '',
  username: '',
  password: ''
})

const rules = reactive({
  display: [{ required: true, min: 2, message: '请输入至少2位长度的昵称', trigger: 'blur' }],
  username: [{ required: true, min: 3, message: '请输入至少3位长度的用户名', trigger: 'blur' }],
  password: [{ required: true, min: 8, message: '请输入至少8位长度的密码', trigger: 'blur' }]
})

const login = async () => {
  const { display, username, password } = form
  try {
    const resp = await apiUserRegister(display, username, password)
    const ok = resp.code
    if (ok != 0) {
      ElNotification({ title: '注册错误', message: resp.msg, duration: 5000 })
      return
    }

    ElNotification({ title: '注册成功', message: '可以去登录啦', duration: 5000 })
    visible.value = false
  } catch (error) {
    ElNotification({ title: '错误', message: error as any, duration: 0 })
    console.error(error)
  }
}
</script>

<style scoped></style>
