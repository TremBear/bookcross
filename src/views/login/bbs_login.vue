<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li class="layui-this">登入</li>
        </ul>
        <div class="layui-form layui-tab-content" style="padding: 20px 0;">
          <div class="layui-tab-item layui-show">
            <div class="layui-form layui-form-pane">
              <div class="layui-form-item">
                <label class="layui-form-label">邮箱</label>
                <div class="layui-input-inline">
                  <input v-model="email" type="text" required lay-verify="required" autocomplete="off" class="layui-input">
                </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label">密码</label>
                <div class="layui-input-inline">
                  <input v-model="pass" type="password" @keyup.enter="getLogin" required lay-verify="required" autocomplete="off" class="layui-input">
                </div>
              </div>
              <div class="layui-item">
                <button class="layui-btn" @click="getLogin">立即登录</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BbsLogin',
  data() {
    return {
      email: '',
      pass: ''
    }
  },
  mounted() {
    this.$store.commit('SET_IS_SHOW_SIDE', false)
    const params = this.$route.params
    if (params) {
      sessionStorage.setItem('path', JSON.stringify(this.$route.params))
    }
  },
  methods: {
    getLogin() {
      const userInfo = { userName: this.email, password: this.pass }
      this.$store.dispatch('Login', userInfo).then(res => {
        if (res.restCode === '0000') {
          const path = JSON.parse(sessionStorage.getItem('path'))
          layer.alert('登录成功！', {
            icon: 1,
            title: '提示'
          })
          if (path.data) {
            this.$router.push({ path: path.data })
          } else {
            this.$router.push('/home')
          }
        } else {
          layer.alert(res.restMsg, {
            icon: 5,
            title: '提示'
          })
        }
      }).catch((err) => {
        layer.msg('后台处理异常，联系管理员')
      })
    }
  }
}
</script>

<style scoped>

</style>
