<template>
  <div class="fly-panel fly-column">
    <div class="layui-container">
      <ul class="layui-clear">
        <li v-for="(item, index) in labelList" :key="index" :class="{'layui-this':isActive === item.id }">
          <a @click="handleSide(item)">{{ item.labelName }}</a>
        </li>
      </ul>
      <div class="fly-column-right layui-hide-xs">
        <div style="position: relative;margin-left: 10px;display: inline-block;vertical-align: top;">
          <i class="layui-icon" style="loat: left;margin-left: 274px;position: absolute;" @click="handleSerch"></i>
          <input v-model="search" type="text" name="1" placeholder="请输入搜索内容" style="height: 38px;width: 300px; line-height: 38px; border: 1px solid #e6e6e6; background-color: #fff; border-radius: 2px;  box-sizing: border-box!important;">
          <a class="layui-btn" @click="getReload('publish')">发表新帖</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import store from '@/store'
export default {
  data() {
    return {
      search: '',
      isActive: 1
    }
  },
  computed: {
    ...mapGetters([
      'labelList'
    ]),
    labelList() {
      return store.getters.labelList.labelDtoList
    }
  },
  created() {
    const labelId = JSON.parse(sessionStorage.getItem('labelId'))
    if (labelId) {
      this.isActive = labelId.id
    }
  },
  methods: {
    handleSide(data) {
      this.isActive = data.id
      this.eventVue.$emit('getLabelId', data)
      this.$router.push('home')
    },
    handleSerch() {
      this.eventVue.$emit('getSarch', this.search)
    },
    getReload(data) {
      const userInfo = store.getters.userInfo
      if (!userInfo.userName) {
        this.$router.push({ name: 'login', params: { data }})
      } else {
        this.$router.push(data)
        sessionStorage.removeItem('draftId')
      }
    }
  }
}
</script>
