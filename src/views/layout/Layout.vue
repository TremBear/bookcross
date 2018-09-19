<template>
  <div class="app-wrapper">
    <navbar v-bind:categorysItme="categorysItme" @getSidebar="getSidebar"/>
    <sidebar v-show="isShow" />
    <div>
      <app-main/>
    </div>
    <footbar/>
  </div>
</template>

<script>
import { Navbar, Footbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Footbar
  },
  data() {
    return {
      categorysItme: [],
      isShow: true
    }
  },
  mixins: [ResizeMixin],
  created() {
    this.getCategory()
    this.headeIsShow()
  },
  methods: {
    getCategory() {
      this.$store.dispatch('Get', { url: '/bbsadmin/categoryManager/allCategorys'}).then(res => {
        if (res.restCode === '0000') {
          this.categorysItme = res.data
           if(this.categorysItme ) {
             this.$store.commit('SET_SIDE', this.categorysItme)
             this.$store.commit('SET_LABLE_ITEM', this.categorysItme[0])
             sessionStorage.setItem("navType",this.global.categoryItems[this.categorysItme[0].id])
           }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getSidebar(data){
      console.log(this.categorysItme[data])
      this.$store.commit('SET_LABLE_ITEM', this.categorysItme[data])
      this.$store.commit('SET_SIDE', this.categorysItme)
      sessionStorage.setItem("navType",this.global.categoryItems[this.categorysItme[data].id])
    },
    headeIsShow(){
      this.eventVue.$on("getIsShow",(message)=>{   //这里最好用箭头函数，不然this指向有问题
        this.isShow = message
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
