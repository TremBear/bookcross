<template>
  <div class="app-wrapper">
    <navbar />
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
  mixins: [ResizeMixin],
  data() {
    return {
      isShow: true
    }
  },
  mounted() {
    this.headeIsShow()
  },
  beforeMount() {
    this.$store.dispatch('GetCategorys', { url: '/bbsadmin/categoryManager/allCategorys' })
    this.$store.dispatch('GetLablesList', { url: '/bbsadmin/labelManager/getLableList' })
  },
  methods: {
    headeIsShow() {
      this.eventVue.$on('getIsShow', (message) => { // 这里最好用箭头函数，不然this指向有问题
        this.isShow = message
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
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
