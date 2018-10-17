<template>
  <div class="fly-panel fly-panel-userInfo" pad20>
    <div class="layui-tab layui-tab-brief" lay-filter="userInfo">
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
                  <img v-if="userInfo.userLogo" :src="userInfo.userLogo" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"/>
                </el-upload>
              </div>
            </div>
          </div>
          <div class="layui-form-item">
            <label for="L_email" class="layui-form-label">邮箱</label>
            <div class="layui-input-inline">
              <input id="L_email" v-model="userInfo.userMail" type="text" name="email" required lay-verify="email" autocomplete="off" class="layui-input input_color" disabled="disabled" >
            </div>
          </div>
          <div class="layui-form-item">
            <label for="L_userInfoname" class="layui-form-label">昵称</label>
            <div class="layui-input-inline">
              <input id="L_userInfoname" v-model="userInfo.userNickname" :disabled="0 === userInfo.nicknameChangeTimes"
                     :class="isDisableFlag ? 'input_color layui-input' : 'layui-input'" type="text" name="userNickname"
                     required lay-verify="required" autocomplete="off" >

            </div>
          </div>
          <div class="layui-form-item">
            <span style="font-size: xx-small; color: red;">您还剩下{{userInfo.nicknameChangeTimes}}次修改昵称的机会哦~</span>
          </div>
          <div class="layui-form-item">
            <button class="layui-btn" @click="handleSubmit" >确认修改</button>
          </div>
        </div>

        <div class="layui-form layui-form-pane layui-tab-item">
          <div class="layui-form-item"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  name: 'UserInfo',
  inject: ['reload'],
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    userInfo() {
      // 输入框是否置灰
      if (store.getters.userInfo.nicknameChangeTimes === 0) {
        this.isDisableFlag = true
      }
      return store.getters.userInfo
    }
  },
  data() {
    return {
      isDisableFlag: false,
      isModify: false,
      imageUrl: '',
      action: process.env.BASE_API + 'bbscommon/udfs/upload'
    }
  },
  watch: {
    'userInfo.userNickname': {
      handler(newValue, oldValue) {
        if (newValue != oldValue) {
          this.isModify = true
        }
      },
      deep: true
    },
    'userInfo.userLogo': {
      handler(newValue, oldValue) {
        if (newValue != oldValue) {
          this.isModify = true
        }
      },
      deep: true
    }
  },
  methods: {
    handleSubmit() {
      if (this.isModify) {
        this.$store.dispatch('Post', { url: '/bbsusercenter/frontuser/updateInfo', data: this.userInfo }).then(res => {
          console.info(res)
          if (res.restCode === '0000') {
            layer.msg('修改个人信息成功')
            this.$store.dispatch('GetInfo')
            this.isModify = false

            // 输入框是否置灰
            isDisableFlag(this.userInfo)

            this.reload() //  刷新页面
          } else {
            layer.alert(res.restMsg, {
              icon: 4,
              title: '提示'
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    handleAvatarSuccess(res, file) {
      this.userInfo.userLogo = res.data
    },
    isDisableFlag(userInfo) {
      if (userInfo.nicknameChangeTimes === 0) {
        this.isDisableFlag = true
      }
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
    width: 131px;
    height: 131px;
    line-height: 131px;
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

  .input_color {
    height: 38px;
    line-height: 1.3;
    border-width: 1px;
    border-style: solid;
    background:#F2F2F2;
    display: block;
    width: 100%;
    padding-left: 10px;
  }
</style>
