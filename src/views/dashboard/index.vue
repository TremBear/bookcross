<template>
  <div>
    <div class="layui-container">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md8">
          <div class="fly-panel" style="margin-bottom: 0;">
            <div class="fly-panel-title fly-filter">
              <a :class="classActive==1?'layui-this':''" @click="handleEssences(1)">全部</a>
              <span class="fly-mid"/>
              <a :class="classActive==2?'layui-this':''" @click="handleEssences(2)">精华</a>
              <span class="fly-mid"/>
            </div>
            <ul class="fly-list">
              <li v-for="(item, index) in topicsItme" :key="index">
                <a href="#" class="fly-avatar">
                  <img :src="!item.userImagePath?'./static/cweg.jpg':item.userImagePath" :alt="item.userNickname">
                </a>
                <h2>
                  <a class="layui-badge" v-if="item.labelId" >{{ lableDic(item.labelId) }}</a>
                  <a @click="handleDetail(item)" >{{ item.topicTitle }}</a>
                </h2>
                <div class="fly-list-info">
                  <a href="#" link>
                    <cite>{{ item.userNickname }}</cite>
                  </a>
                  <span>{{ formatTime(item.modifyTime) }}</span>

                  <span class="fly-list-kiss layui-hide-xs" >
                    <span v-if="item.publishedTime">•{{ item.publishedTime }} </span>
                    <span v-if="item.replyUsername">•最后回复来自{{ item.replyUsername }}</span>
                  </span>
                  <span class="fly-list-nums">
                    <a onclick="clickCollectBBS()"><i class="layui-icon" title="收藏">&#xe658;</i>{{ item.collectCount }}</a>
                    <a onclick="clickLikeBBS()"><i class="layui-icon" title="点赞">&#xe6c6;</i>{{ item.praiseCount }}</a>
                    <a href="#comment"><i class="layui-icon" title="评论">&#xe611;</i>{{ item.replyCount }}</a>
                    <i class="iconfont" title="浏览">&#xe60b;</i>{{ item.browseCount }}
                  </span>
                </div>
                <div class="fly-list-badge">
                  <span v-if="item.topicType===3 || item.topicType===4" class="layui-badge layui-bg-red" >置顶</span>
                  <span v-if="item.topicType===2 || item.topicType===4" class="layui-badge layui-bg-red" >精华</span>
                </div>
              </li>

            </ul>
            <div style="text-align: center"/>
            <el-pagination
              :page-size="pageSize"
              :current-page="pageNum"
              :total="total"
              style="text-align: center"
              prev-text="上一页"
              next-text="下一页"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"/>
          </div>
        </div>
        <keep-alive><right-bar/></keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import Rightbar from '@/components/Rightbar'
import Sidebar from '@/components/Sidebar'
import { mapGetters } from 'vuex'
import store from '@/store'
export default {
  name: 'Dashboard',
  components: {
    'right-bar': Rightbar,
    'side-bar': Sidebar
  },
  computed: {
    ...mapGetters([
      'dictLabels',
      'navType'
    ]),
    dictLabels() {
      return store.getters.dictLabels
    },
    navType() {
      return store.getters.navType
    }
  },
  data() {
    return {
      topicsItme: [],
      total: 0,
      lableItem: {},
      url: '/bbspost/topic/readAllTopics',
      pageSize: 13,
      labelId: 1,
      lableName: '',
      keyword: '',
      pageNum: 1,
      type: 1,
      classActive: 1
    }
  },
  watch: {
    labelList() {
      this.getAlNotice()
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.eventVue.$emit('getIsShow', true)
      this.handleLabelId()
      this.handleSarch()
      this.getAlNotice()
    })
  },
  methods: {
    getAlNotice() {
      const labelId = JSON.parse(sessionStorage.getItem('labelId'))
      if (labelId) {
        this.labelId = labelId.id
      }
      const data = { labelId: this.labelId, pageSize: this.pageSize, pageNum: this.pageNum, type: this.navType, keyword: this.keyword }
      this.$store.dispatch('Post', { url: this.url, data: data }).then(res => {
        if (res.restCode === '0000') {
          this.topicsItme = res.data.list
          this.total = res.data.total
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取首页帖子信息 、首页搜索功能分页
    handleEssences(data) {
      if (data === 1) {
        this.url = '/bbspost/topic/readAllTopics'
      }
      if (data === 2) {
        this.url = '/bbspost/topic/readEssences'
      }
      this.classActive = data
      this.pageNum = 1
      this.getAlNotice()
    },
    // 页面分页
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAlNotice()
    },
    // 查询
    handleSarch() {
      this.eventVue.$on('getSarch', (message) => { // 这里最好用箭头函数，不然this指向有问题
        this.keyword = message
        if (this.keyword) {
          this.url = '/bbspost/topic/search'
        } else {
          this.url = '/bbspost/topic/readAllTopics'
        }
        this.pageNum = 1
        this.getAlNotice()
      })
    },
    // 标签点击事件
    handleLabelId() {
      this.eventVue.$on('getLabelId', (data) => { // 这里最好用箭头函数，不然this指向有问题
        if (data){
          sessionStorage.setItem('labelId', JSON.stringify(data))
          this.labelId = data.id
          this.getAlNotice(data.id)
        }else{
          this.getAlNotice()
        }
      })
    },
    handleDetail(data) {
      const datas = { id: data.id, entry: 1 }
      sessionStorage.setItem('detail', JSON.stringify(datas))
      this.$router.push({ path: 'detail#goto' })
    },
    // 翻译数据字典
    lableDic(val) {
      let lable = ''
      this.dictLabels.map((item, index) => {
        if (item.id === val) {
          lable = item.labelName
        }
      })
      return lable
    },
    // 日期进行转换
    formatTime(time) {
      if (time) {
        return this.parseTime(time)
      }
      return time
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.el-pager li.active  {
  color: #5FB878;
  cursor: default;
}
</style>
