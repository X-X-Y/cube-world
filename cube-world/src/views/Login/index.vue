<template>
  <div id="home">
    <canvas id="interface"></canvas>
    <div id="bkimg">
      <img src="../../assets\image\background/bk.png" alt="">
    </div>
    <el-card class="login-card">
      <el-form ref="loginForm" inline :model="formData" :rules="rules">
        <el-form-item prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入您的昵称"  @keypress.native.enter="enterGame"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="enterGame">进入游戏</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'

export default {
  data() {
    return {
      // 表单信息
      formData: {
        nickname: ''
      },

      // 校验规则
      rules: {
        nickname: [{ required: true, message: '请输入您的昵称' }]
      }
    }
  },
  mounted(){
    const w = require('@/js/interface.js')
    w.init()
    w.animation()
  },
  methods: {
    enterGame() {
      this.$refs.loginForm.validate(async flag => {
        if (!flag) return
        const nickname = this.formData.nickname
        // 昵称是否已经被占用
        const isExist = await this.$store.dispatch('checkUserExist', nickname)
        if (isExist) {
          MessageBox.alert('该昵称已经被占用了，请更换昵称')
        } else {
          localStorage.setItem('nickname', nickname)
          // 跳转到首页
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style scoped>
#home{
  widows: 100vw;
  height: 100vh;
}
#interface{
  background-color: rgb(20, 16, 63);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}
#bkimg{
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  margin-top: -280px;
  margin-left: -220px;
}
#bkimg img{
  width: 420px;
}
.login-card {
  width: 600px;
  height: 100px;
  margin: 0 auto;
  margin-top: 200px;
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  margin-top: -70px;
  margin-left: -300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0);
  border: 0;
}
</style>
