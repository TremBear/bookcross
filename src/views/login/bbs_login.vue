<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li class="layui-this">登入</li>
        </ul>
        <div class="layui-form layui-tab-content"  style="padding: 20px 0;">
          <div class="layui-tab-item layui-show">
            <div class="layui-form layui-form-pane">
              <div class="layui-form-item">
                  <label  class="layui-form-label">邮箱</label>
                  <div class="layui-input-inline">
                    <input type="text" v-model="email"  required lay-verify="required" autocomplete="off" class="layui-input">
                  </div>
                </div>
                <div class="layui-form-item">
                  <label  class="layui-form-label">密码</label>
                  <div class="layui-input-inline">
                    <input type="password" v-model="pass"  required lay-verify="required" autocomplete="off" class="layui-input">
                  </div>
                </div>
                <div class="layui-item">
                  <button class="layui-btn" v-on:click="getLogin">立即登录</button>
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
  name: 'bbs_login',
  data() {
    return {
      email:'',
      pass: ''

    }
  },
  created() {
    let params =this.$route.params
    if(params){
      sessionStorage.setItem("path",JSON.stringify(this.$route.params))
    }
    this.eventVue.$emit('getIsShow',false)
  },
  methods: {
    getLogin(){
      const  userInfo ={ userName: this.email, password: this.pass }
      this.$store.dispatch('Login',userInfo ).then(res => {
        if (res.restCode === '0000') {
          this.$store.dispatch('GetInfo').then(ress => {
            if (ress.restCode === '0000') {
              let path =JSON.parse(sessionStorage.getItem("path"))
              layer.alert('登录成功！', {
                icon: 1,
                title: "提示"
              })
              if(path.data){
                this.$router.push({path:path.data})
              }else {
                this.$router.push('/home')
              }
            }
          }).catch((err) => {
            console.log(err)
          })
        }else{
          layer.alert(res.restMsg, {
            icon: 5,
            title: "提示"
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
