<template>
  <div class="app-wrapper">
    <navbar :categorys-itme="categorysItme" @getSidebar="getSidebar"/>
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
      isShow: true,
      categorysItme: []
    }
  },
  mounted() {
    this.headeIsShow()
  },
  beforeMount() {
    this.getCategory()
    this.getLableItem()
  },
  methods: {
    getCategory() {
      if (this.categorysItme) {
        this.$store.dispatch('Get', { url: '/bbsadmin/categoryManager/allCategorys' }).then(res => {
          if (res.restCode === '0000') {
            this.categorysItme = res.data
            if (this.categorysItme) {
              this.$store.commit('SET_SIDE', this.categorysItme)
              this.$store.commit('SET_LABLE_ITEM', this.categorysItme[0].labelDtoList)
              sessionStorage.setItem('navType', this.global.categoryItems[this.categorysItme[0].id])
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    getLableItem() {
      this.$store.dispatch('Get', { url: '/bbsadmin/labelManager/getLableList' }).then(res => {
        if (res.restCode === '0000') {
          sessionStorage.setItem('setDidtLabes', JSON.stringify(res.data))
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getSidebar(data) {
      this.$store.commit('SET_LABLE_ITEM', data.labelDtoList)
      this.eventVue.$emit('getLabelId', data.labelDtoList[0])
      this.$router.push('home')
    },
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
