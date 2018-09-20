<template>
  <div class="fly-panel fly-panel-user" pad20>
    <div class="layui-tab layui-tab-brief" lay-filter="user">
      <ul id="LAY_mine" class="layui-tab-title">
        <li class="layui-this" lay-id="info">我的资料</li>
      </ul>
      <div class="layui-tab-content" style="padding: 20px 0;">
        <div class="layui-form layui-form-pane layui-tab-item layui-show">
          <div class="layui-form-item">
            <label for="L_email" class="layui-form-label" style="background-color: rgba(0, 0, 0, 0);border-style: none;">上传头像</label>
            <div class="layui-input-inline" style="margin-left: 17px;">
              <div class="avatar-add" style="width: 120px;height: 120px">
                <el-upload
                  :action="action"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  class="avatar-uploader">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon">点击上传头像</i>
                </el-upload>
              </div>
            </div>
          </div>
          <div class="layui-form-item">
            <label for="L_email" class="layui-form-label">邮箱</label>
            <div class="layui-input-inline">
              <input id="L_email" v-model="user.userMail" type="text" name="email" required lay-verify="email" autocomplete="off" class="layui-input" disabled="disabled">
            </div>
          </div>
          <div class="layui-form-item">
            <label for="L_username" class="layui-form-label">昵称</label>
            <div class="layui-input-inline">
              <input id="L_username" v-model="user.userNickname" type="text" name="username" required lay-verify="required" autocomplete="off" class="layui-input">
            </div>
          </div>
          <div class="layui-form-item">
            <button class="layui-btn" @click="handleSubmit" >确认修改</button>
          </div>
        </div>

        <div class="layui-form layui-form-pane layui-tab-item">
          <div class="layui-form-item">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'UserInfo',
  data() {
    return {
      user: {},
      imageUrl: '',
      action: process.env.BASE_API + 'bbscommon/udfs/upload'
    }
  },
  created: function() {
    this.user = store.getters.userInfo
    if (this.user.userLogo) {
      this.imageUrl = this.user.userLogo
    }
  },
  methods: {
    handleSubmit() {
      this.user.userLogo = this.imageUrl
      this.$store.dispatch('Post', { url: '/front/frontuser/updateInfo', data: this.user }).then(res => {
        if (res.restCode === '0000') {
          layer.alert('修改个人信息成功,需刷新一下页面！', {
            icon: 1,
            title: '提示'
          })
        } else {
          layer.alert(res.restMsg, {
            icon: 4,
            title: '提示'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data
    }
  }
}
</script>

<style >
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #009688;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 220px;
    height: 220px;
    line-height: 220px;
    text-align: center;
  }
  .avatar {
    width: 220px;
    height: 220px;
    display: block;
  }
  .avatar-add img {
    position: absolute;
    left: 70%;
    top: 43%;
    width: 120px;
    height: 120px;
    margin: -50px 0 0 -84px;
    border-radius: 100%;
  }

</style>
