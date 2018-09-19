<template>
  <div>
    <div class="layui-container">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md8">
          <div class="fly-panel" style="margin-bottom: 0;">
            <div class="fly-panel-title fly-filter">
              <a v-on:click="handleEssences(1)" :class="classActive==1?'layui-this':''">全部</a>
              <span class="fly-mid"/>
              <a v-on:click="handleEssences(2)" :class="classActive==2?'layui-this':''">精华</a>
              <span class="fly-mid"/>
            </div>
            <ul class="fly-list">
              <li v-for="(item, index) in topicsItme" :key="index">
                <a href="#" class="fly-avatar">
                  <img :src="!item.userImagePath?'/static/cweg.jpg':item.userImagePath" :alt="item.userNickname">
                </a>
                <h2>
                  <a class="layui-badge">{{lableDic(item.labelId)}}</a>
                  <a v-on:click="handleDetail(item)" >{{ item.topicTitle }}</a>
                </h2>
                <div class="fly-list-info">
                  <a href="#" link>
                    <cite>{{ item.userNickname }}</cite>
                  </a>
                  <span>{{ formatTime(item.modifyTime) }}</span>

                  <span class="fly-list-kiss layui-hide-xs" >
                    <span>•{{ item.publishedTime }} </span>
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
            <el-pagination style="text-align: center"
                           @current-change="handleCurrentChange"
                           :page-size="pageSize"
                           :current-page="pageNum"
              prev-text="上一页"
              next-text="下一页"
              layout="prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </div>
        <right-bar/>
      </div>
    </div>
  </div>
</template>

<script>
import Rightbar from '@/components/Rightbar'
import Sidebar from '@/components/Sidebar'
import store from '@/store'
import { mapGetters ,mapState} from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    'right-bar': Rightbar,
    'side-bar': Sidebar
  },
  computed: {
    ...mapGetters([
      'labelList'
    ])
  },
  data() {
    return {
      topicsItme: [],
      total: 0,
      lableItem:{},
      url: '/bbspost/topic/readAllTopics',
      pageSize:13,
      labelId: 1,
      lableName: '',
      keyword: '',
      pageNum: 1,
      type:1,
      classActive: 1
    }
  },
  created() {
    this.eventVue.$emit('getIsShow',true)
    this.handleLabelId()
    this.handleSarch()
    this.getAlNotice()
  },
  watch:{
    labelList(){
      this.getAlNotice()
    }
  },
  methods: {
    getAlNotice() {
      const labelId =JSON.parse(sessionStorage.getItem('labelId'))
       if(labelId){
         this.labelId = labelId.id
       }
      const type= JSON.parse(sessionStorage.getItem('navType'))
      let  data ={ labelId: this.labelId ,pageSize: this.pageSize ,pageNum: this.pageNum ,type: type ,keyword: this.keyword }
      this.$store.dispatch('Post', { url: this.url, data:data }).then(res => {
        if (res.restCode === '0000') {
          this.topicsItme = res.data.list
          this.total = res.data.total
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取首页帖子信息 、首页搜索功能分页
    handleEssences(data){
      if(data ===1){
        this.url = '/bbspost/topic/readAllTopics'
      }
      if(data ===2){
        this.url = '/bbspost/topic/readEssences'
      }
      this.classActive = data
      this.pageNum = 1
      this.getAlNotice()
    },
    // 页面分页
    handleCurrentChange(val){
      this.pageNum=val
      this.getAlNotice()
    },
    // 查询
    handleSarch(){
      this.eventVue.$on("getSarch",(message)=>{   //这里最好用箭头函数，不然this指向有问题
        this.keyword = message
        this.url = '/bbspost/topic/search'
        this.pageNum = 1
        this.getAlNotice()
      })
    },
    // 标签点击事件
    handleLabelId(){
      this.eventVue.$on("getLabelId",(data)=>{   //这里最好用箭头函数，不然this指向有问题
        sessionStorage.setItem("labelId",JSON.stringify(data))
         this.labelId = data.id
         this.getAlNotice(data.id)
      })

    },
    handleDetail(data){
      let datas={id:data.id, entry:1}
      sessionStorage.setItem("detail",JSON.stringify(datas))
      this.$router.push({path:'detail#goto'})
    },
    // 翻译数据字典
    lableDic(val){
      let lable = ''
      this.labelList.labelDtoList.map((item, index) => {
        if(item.id === val){
          lable= item.labelName
        }
      })
      return  lable
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
