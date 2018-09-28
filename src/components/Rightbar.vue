<template>
  <div class="layui-col-md4">

    <div class="fly-panel">
      <div class="fly-panel-title">
        <h3 >社区公告</h3>
        <h4 style="float: right;margin-top: -50px;"><a @click="handleMore">更多</a></h4>
      </div>
      <ul class="fly-panel-main fly-list-static " >
        <li v-for="(item, index) in noticeItme" :key="index" style="list-style-type: none;">
          <div class="fly-list-info">
            <a link style="font-size: 14px; color: #c16262;" @click="handleDetail(item.id,2)">{{ item.topicTitle.substring(0, 16) }}</a>
            <span class="fly-list-nums">{{ formatTime(item.modifyTime) }} ... </span>
          </div>
        </li>
      </ul>
    </div>

    <dl class="fly-panel fly-list-one">
      <dt class="fly-panel-title"><h3 >最新评论</h3></dt>
      <dd v-for="(item, index) in latestItme" :key="index" style="border-bottom: 1px dotted #E9E9E9;">
        <label>#{{ item.replyFloor }}楼 {{ item.userNickname }} {{ item.publishedTime }} </label>
        对帖子 <a style="font-size: 15px; color: #999;" @click="handleDetail(item.topicId,item.replyType)"> “{{ item.postTitle }}” </a>    评论内容：<label style="font-size: 15px; color: #c16262;" v-html="item.replyComment"/>

      </dd>
    </dl>

    <div class="fly-panel">
      <div class="layui-tab layui-tab-brief">
        <ul class="layui-tab-title">
          <li class="layui-this">站内统计</li>
          <li>今日统计</li>
        </ul>
        <div class="layui-tab-content">
          <div class="layui-tab-item layui-show">
            <ul class="mine-view jie-row">
              <li>
                <a>站内统计:</a>
                <em>{{ totalCount.commentCount }}</em>
              </li>
              <li>
                <a>回帖数量:</a>
                <em>{{ totalCount.topicCount }}</em>
              </li>
              <li>
                <a>用户数量:</a>
                <em>{{ totalCount.userCount }}</em>
              </li>
            </ul>
          </div>
          <!--
                          作者：349036010@qq.com
                          时间：2018-07-20
                          描述：今日统计
                      -->
          <div class="layui-tab-item">
            <ul class="mine-view jie-row">
              <li>
                <a>站内统计:</a>
                <em>{{ dailyCount.commentCount }}</em>
              </li>
              <li>
                <a>回帖数量:</a>
                <em>{{ dailyCount.topicCount }}</em>
              </li>
              <li>
                <a>用户数量:</a>
                <em>{{ dailyCount.userCount }}</em>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import store from '@/store'
import { mapGetters } from 'vuex'
export default {
  name: 'Rightbar',
  inject: ['reloadAppMain'],
  data() {
    return {
      latestItme: [],
      dailyCount: {},
      totalCount: {},
      noticeItme: []
    }
  },
  computed: {
    ...mapGetters([
      'dictLabels'
    ]),
    dictLabels() {
      return store.getters.dictLabels
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.getAllPost()
      this.getAllLatest()
      this.getCount()
    })
  },
  methods: {
    // 加载公告数据
    getAllPost() {
      this.$store.dispatch('Post', { url: '/bbspost/bulletin/readTop' }).then(res => {
        if (res.restCode === '0000') {
          this.noticeItme = res.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 加载 评论数据
    getAllLatest() {
      this.$store.dispatch('Post', { url: '/bbspost/topicReply/readLast' }).then(res => {
        if (res.restCode === '0000') {
          this.latestItme = res.data
          console.log(this.latestItme)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 加载 统计数据
    getCount() {
      this.$store.dispatch('Post', { url: '/bbscommon/count/bbsCount' }).then(res => {
        if (res.restCode === '0000') {
          this.dailyCount = res.data.dailyCount
          this.totalCount = res.data.totalCount
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 详细信息页面
    handleDetail(id, type) {
      const datas = { id: id, entry: 1, type: type }
      sessionStorage.setItem('detail', JSON.stringify(datas))
      this.reloadAppMain()
      this.$router.push({ path: 'detail' })
    },
    // 日期互转
    formatTime(time) {
      if (time) {
        return parseTime(time)
      }
      return time
    },
    // 公告更多功能
    handleMore() {
      this.$store.commit('SET_NAV_TYPE','2')
      this.$store.commit('SET_LABLE_ITEM')
      this.$router.push('/')
      this.eventVue.$emit('getLabelId')
    }
  }
}
</script>

<style >

</style>
