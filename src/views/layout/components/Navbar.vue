<template>
  <div class="fly-header layui-bg-black">
    <div class="layui-container">
      <a class="fly-logo" href="/">
        <img src="/static/logo.png" alt="layui">
      </a>
      <ul class="layui-nav fly-nav layui-hide-xs">
        <li class="layui-nav-item layui-this" v-for="(item, index) in categorysItme" :key="index">
          <a v-on:click="handleCategory(index)"><i class="iconfont" :class="item.categoryLogo"/>{{item.categoryName}}</a>
        </li>
      </ul>
      <ul class="layui-nav fly-nav-user" v-show="notlogin">
        <!-- 未登入的状态 -->
        <li class="layui-nav-item">
          <a class="iconfont icon-touxiang layui-hide-xs" href="login.html"/>
        </li>
        <li class="layui-nav-item">
          <a ><router-link to="/login">登入</router-link></a>
        </li>
      </ul>
      <ul class="layui-nav fly-nav-user"  v-show="login">
        <!-- 登入后的状态 -->
        <li class="layui-nav-item">
          <el-dropdown @command="handleCommand">
             <span class="el-dropdown-link">
              {{userInfo.userName}}
             </span>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item command="/manager/user"><i class="layui-icon">&#xe620;</i>个人中心</el-dropdown-item>
              <el-dropdown-item command="/manager/user_message"><i class="layui-icon">&#xe611;</i>我的消息</el-dropdown-item>
              <el-dropdown-item command="exit">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="el-dropdown-link fly-nav-avatar">
            <img :src="imgUrl">
          </span>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import store from '@/store'

export default {
  props: {
    categorysItme: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      login: false,
      notlogin: true,
      imgUrl:'/static/cweg.jpg'
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    userInfo(){
      return store.getters.userInfo
    }
  },
  watch: {
    $route(route) {
      this.toggleSideBar()
    }
  },
  mounted() {
    this.toggleSideBar()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('GetInfo').then(ress => {
        if(ress.restCode === '0000'){
          if (this.userInfo) {
            this.notlogin = false
            this.login = true
            if(this.userInfo.userLogo){
              this.imgUrl = this.userInfo.userLogo
            }
          }
        }
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    handleCategory(index){
      this.$emit('getSidebar', index)
      this.$router.push('/')
    },
    handleCommand(data){
      if(data === 'exit'){
        this.$store.dispatch('LogOut').then(res=>{

        })
        this.$router.push('/')
        this.$router.go()

      }else{
        this.$router.push(data)
      }

    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" >
  .el-dropdown-menu__item:focus,.el-dropdown-menu__item:not(.is-disabled):hover{
    background-color:#dcdfe6;
    color:#009688
  }
  .el-pager li:hover{
    color:#009688;
  }
  .el-pagination button:hover {
    color:#009688
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #f1eeee;
  }
  .el-dropdown-menu__item{
    color: #606266;
  }
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

