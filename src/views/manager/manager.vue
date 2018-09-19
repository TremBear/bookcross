<template>
  <div class="layui-container fly-marginTop fly-user-main">
    <ul class="layui-nav layui-nav-tree layui-inline" lay-filter="user">
      <li class="layui-nav-item " v-for="(item, index) in menuList" :key="index" :class="{'layui-this':isActive === item.listLink }">
        <a v-on:click="handleClass(item)">
          <router-link :to="item.listLink"><i class="layui-icon">{{item.icon}}</i>{{item.title}} <span class="layui-badge" v-show="false">99+</span></router-link>
        </a>
      </li>
    </ul>

    <div class="site-tree-mobile layui-hide">
      <i class="layui-icon">&#xe602;</i>
    </div>
    <div class="site-mobile-shade"></div>

    <div class="site-tree-mobile layui-hide">
      <i class="layui-icon">&#xe602;</i>
    </div>
    <div class="site-mobile-shade"/>
    <transition  name="fade" mode="out-in">
      <router-view v-if="isRouterAlive"></router-view>
    </transition>
  </div>
</template>

<script>
export   default {
  name: 'manager',
  provide(){
    return{
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true,
      menuList:[
        {
          listLink:'/manager/user',
          title:'基本设置',
          icon:''
        },
        {
          listLink:'/manager/user_bbs',
          title:'帖子管理',
          icon:''
        },
        {
          listLink:'/manager/user_message',
          title:'我的消息',
          icon:''
        }
      ],
      isActive:'/manager/user'
    }
  },
  methods: {
    handleClass(data) {
      this.isActive =  data.listLink
    },
    reload(){
      this.isRouterAlive =false
      this.$nextTick(function(){
        this.isRouterAlive =true
      })
    }

  },
  created() {
    const urlItems=this.$router.currentRoute.fullPath.split('?')
    if(urlItems){
      this.isActive = urlItems[0]
    }
    this.eventVue.$emit('getIsShow',false)
  }
}
</script>

<style>
  .layui-nav-tree .layui-nav-item a:hover {
     background-color:rgba(0,0,0,0);
  }
</style>
