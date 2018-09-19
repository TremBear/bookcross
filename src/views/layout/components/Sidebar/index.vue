<template>
  <div class="fly-panel fly-column">
    <div class="layui-container">
      <ul class="layui-clear">
        <li v-for="(item, index) in sideItem" :key="index" v-bind:class="classObject(index)">
          <a v-on:click="handleSide(item)">{{item.labelName}} s</a>
        </li>
      </ul>
      <div class="fly-column-right layui-hide-xs">
        <div style="position: relative;margin-left: 10px;display: inline-block;vertical-align: top;">
          <i class="layui-icon" v-on:click="handleSerch" style="loat: left;margin-left: 274px;position: absolute;"></i>
          <input type="text" name="1"  v-model="search" placeholder="请输入搜索内容" style="height: 38px;width: 300px; line-height: 38px; border: 1px solid #e6e6e6; background-color: #fff; border-radius: 2px;  box-sizing: border-box!important;">
          <a v-on:click="getReload('publish')" class="layui-btn">发表新帖</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import store from '@/store'
  export default {
    data(){
      return {
        search: ''
      }
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      sideItem(){
        return store.getters.sideItem.labelDtoList
      }
    },
    methods: {
      classObject(val) {
        if (val === 0) {
          return 'layui-this'
        }
      },
      handleSide(data) {
        console.log(data)
       // this.$router.push('home')
      },
      handleSerch(){
        this.eventVue.$emit('getSarch', this.search)
      },
      getReload(data){
        const userInfo=JSON.parse(sessionStorage.getItem("userInfo"))
        if(!userInfo){
          this.$router.push({name:'login',params:{data}})
        }else{
          this.$router.push(data)
        }
      }
    }
  }
</script>
