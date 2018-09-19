<template>
  <div class="fly-panel fly-panel-user" pad20>
    <div class="layui-tab layui-tab-brief" lay-filter="user">
      <ul class="layui-tab-title" id="LAY_mine">
        <li class="layui-this" lay-id="info">我的资料</li>
        <li lay-id="avatar">头像</li>
      </ul>
      <div class="layui-tab-content" style="padding: 20px 0;">
        <div class="layui-form layui-form-pane layui-tab-item layui-show">
          <div class="layui-form-item">
              <label for="L_email" class="layui-form-label">邮箱</label>
              <div class="layui-input-inline">
                <input type="text" id="L_email" name="email" required lay-verify="email" autocomplete="off" v-model="user.userMail"  class="layui-input" disabled="disabled">
              </div>
            </div>
            <div class="layui-form-item">
              <label for="L_username" class="layui-form-label">昵称</label>
              <div class="layui-input-inline">
                <input type="text" id="L_username" name="username" required lay-verify="required"  v-model="user.userNickname" autocomplete="off"  class="layui-input">
              </div>
            </div>
            <div class="layui-form-item">
              <button class="layui-btn"  v-on:click="handleSubmit"  >确认修改</button>
            </div>
        </div>

        <div class="layui-form layui-form-pane layui-tab-item">
          <div class="layui-form-item">
            <div class="avatar-add" style="width: 287px;height: 287px">
              <el-upload
                class="avatar-uploader"
                :action="action"
                :show-file-list="false"
                :on-success="handleAvatarSuccess">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon">点击上传头像</i>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import  store from '@/store'
export default {
  name: 'user_info',
  data() {
    return {
      user:{},
      imageUrl: '',
      action: process.env.BASE_API+'/udfs/upload'
    }
  },
  created: function(){
    this.user= store.getters.userInfo
    if(this.user.userLogo){
      this.imageUrl= this.user.userLogo
    }

  },
  methods:{
    handleSubmit(){
      this.user.userLogo = this.imageUrl
      this.$store.dispatch('Post', { url: '/front/frontuser/updateInfo', data: this.user }).then(res => {
        if (res.restCode === '0000') {
          layer.alert('修改个人信息成功,需刷新一下页面！', {
            icon: 1,
            title: "提示"
          })
        }else{
          layer.alert(res.restMsg, {
            icon: 4,
            title: "提示"
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleAvatarSuccess(res, file){
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
    width: 287px;
    height: 287px;
    line-height: 287px;
    text-align: center;
  }
  .avatar {
    width: 287px;
    height: 287px;
    display: block;
  }
  .avatar-add img {
    position: absolute;
    left: 30%;
    top: 18%;
    width: 287px;
    height: 287px;
    margin: -50px 0 0 -84px;
    border-radius: 100%;
  }


</style>
