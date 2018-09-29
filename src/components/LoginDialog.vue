<template>
  <el-dialog
    :visible.sync="loginDialogVisible"
    :before-close="handleClose"
    width="30%">
    <div class="fly-panel fly-panel-user" pad20 style="width: 91%;">
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
                  <input v-model="pass" type="password" required lay-verify="required" autocomplete="off" class="layui-input">
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
  </el-dialog>
</template>

<script>
export default {
  name: 'LoginDialog',
  props: {
    loginDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: '',
      pass: ''
    }
  },
  methods: {
    // 关闭举报窗口
    handleClose() {
      this.$emit('handleLoginClose')
    },
    getLogin() {
      const userInfo = { userName: this.email, password: this.pass }
      this.$store.dispatch('Login', userInfo).then(res => {
        if (res.restCode === '0000') {
          layer.alert('登录成功！', {
            icon: 1,
            title: '提示'
          })
          this.$emit('handleLoginClose')
        } else {
          layer.alert(res.restMsg, {
            icon: 5,
            title: '提示'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style >
  .el-select .el-input.is-focus .el-input__inner{
    border-color:#dcdfe6;
  }
  .el-select .el-input__inner:focus{
    border-color:#dcdfe6;
  }

  .detail-body {
    min-height: 100px;
  }
  .el-dialog__body {
    padding: 14px 14px;
    color: #606266;
    font-size: 14px;
  }
  .el-dialog__header {
    height: 30px;
  }

</style>
