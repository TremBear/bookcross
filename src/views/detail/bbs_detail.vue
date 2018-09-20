<template>
  <div style="margin-top: 7px;">
    <div class="layui-container">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md8 content detail">
          <div class="fly-panel detail-box">
            <h1>{{ topicsItem.topicTitle }}</h1>
            <div class="fly-detail-info">
              <span class="layui-badge layui-bg-blue">{{ lableDic(topicsItem.labelId) }}</span>
              <span v-if="topicsItem.topicType===3 || topicsItem.topicType===4" class="layui-badge layui-bg-red" >置顶</span>
              <span v-if="topicsItem.topicType===2 || topicsItem.topicType===4" class="layui-badge layui-bg-red" >精华</span>
              <span class="fly-list-nums">
                <a @click="handleReportPost(topicsItem)"><i class="layui-icon" title="举报">&#x1007;</i> 举报</a>
                <a @click="handleBBS(2)"><i class="layui-icon" title="收藏">&#xe658;</i> {{ getNum(topicsItem.collectCount) }}</a>
                <a @click="handleBBS(1)"><i class="layui-icon" title="点赞">&#xe6c6;</i> {{ getNum(topicsItem.praiseCount) }}</a>
                <a href="#goto"><i class="layui-icon" title="评论">&#xe611;</i> {{ getNum(topicsItem.replyCount) }}</a>
                <i class="iconfont" title="浏览">&#xe60b;</i> {{ getNum(topicsItem.browseCount) }}
              </span>
            </div>
            <div class="detail-about">
              <a class="fly-avatar" href="#">
                <img :src="!topicsItem.userImagePath?'/static/cweg.jpg':topicsItem.userImagePath" alt="贤心">
              </a>
              <div class="fly-detail-user">
                <a href="user_info.html" class="fly-link">
                  <cite>{{ topicsItem.userNickname }}</cite>
                </a>
                <span>{{ formatTime(topicsItem.modifyTime) }}</span>
              </div>

            </div>
            <div class="detail-body photos" v-html="topicsItem.topicContent"/>
          </div>

          <div id="flyReply" class="fly-panel detail-box">
            <fieldset class="layui-elem-field layui-field-title" style="text-align: center;">
              <legend>回帖</legend>
            </fieldset>

            <ul id="jieda" class="jieda">
              <li v-for="(item, index) in replyDetailList" :key="index" data-id="111" class="jieda-daan">
                <a name="item-1111111111"/>
                <div class="detail-about detail-about-reply">
                  <a class="fly-avatar" href="">
                    <img :src="!item.userImagePath?'/static/cweg.jpg':item.userImagePath" alt=" ">
                  </a>
                  <div class="fly-detail-user">
                    <a href="" class="fly-link">
                      <cite>{{ item.userNickname }}</cite>
                    </a>
                    <span>{{ item.replyFloor }}楼</span>
                  </div>

                  <div class="detail-hits">
                    <span>{{ formatTime(item.replyTime) }}</span>
                  </div>
                </div>
                <div class="detail-body jieda-body photos" >
                  <p v-html="item.replyComment"/>
                </div>
                <div class="jieda-reply">
                  <a href="#goto" @click="handleReplyToReply(item)">
                    <span type="reply">
                      <i class="iconfont icon-svgmoban53" />
                      回复
                    </span>
                  </a>
                  <div class="jieda-admin">
                    <span type="del" @click="reportMsgClick(item)">举报</span>
                  </div>
                </div>
              </li>
              <div style="text-align: center"/>
              <el-pagination
                :page-size="pageSize"
                :current-page="pageNum"
                style="text-align: center"
                prev-text="上一页"
                :total="total"
                next-text="下一页"
                layout="prev, pager, next"
                @current-change="handleCurrentChange"/>
            </ul>
            <div v-show="topicsItem.isOpenComment === 1" id="goto" class="layui-form layui-form-pane">
              <div class="layui-form-item layui-form-text">
                <a name="comment"/>
                <div class="layui-input-block">
                  <wang-editor ref="wangEditor" :menus="menus" :content="content" @handleEditor="handleEditor"/>
                </div>
              </div>
              <div class="layui-item">
                <button class="layui-btn" @click="handleReply">提交回复</button>
              </div>
            </div>
          </div>
        </div>
        <right-bar/>
      </div>
    </div>
    <div><report-msg-div :reply-data="replyData" :reply-title="replyTitle" :dialog-visible="dialogVisible" @handleClose="handleClose" @handleSubmit="handleSubmit"/></div>
  </div>
</template>

<script>
import Rightbar from '@/components/Rightbar'
import Sidebar from '@/components/Sidebar'
import ReportMsgDiv from '@/components/ReportMsgDiv'
import store from '@/store'
import wangeditor from '@/components/wangeditor'
import { mapGetters } from 'vuex'
export default {
  name: 'BbsDetail',
  components: {
    'right-bar': Rightbar,
    'side-bar': Sidebar,
    'report-msg-div': ReportMsgDiv,
    'wang-editor': wangeditor
  },
  computed: {
    ...mapGetters([
      'labelList'
    ]),
    labelList() {
      return store.getters.labelList
    }
  },
  data() {
    return {
      topicsItem: [],
      // 回显内容
      content: '',
      // 输入的内容
      editor: '',
      dialogVisible: false,
      item: {},
      userInfo: {},
      replyDetailList: [],
      replyTitle: '',
      replyData: {},
      clearEditor: Object,
      pageSize: 6,
      total: 0,
      pageNum: 1,
      replyType: '',
      menus: [
        'head', // 标题
        'bold', // 粗体
        'fontName', // 字体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'emoticon' // 表情
      ]
    }
  },
  mounted() {
    this.getPosts()
    this.eventVue.$emit('getIsShow', true)
  },
  methods: {
    // 初始加载帖子详细信息
    getPosts() {
      const detail = JSON.parse(sessionStorage.getItem('detail'))
      if (!detail.type) {
        const type = this.global.categoryItems[this.labelList.id]
        detail['type'] = type
      }
      detail['pageSize'] = this.pageSize
      detail['pageNum'] = this.pageNum
      this.$store.dispatch('Post', { url: '/bbspost/topic/getPost', data: detail }).then(res => {
        if (res.restCode === '0000') {
          this.topicsItem = res.data
          if (res.data.replyDetail) {
            this.replyDetailList = res.data.replyDetail.list
            this.total = res.data.replyDetail.total
          }
          const index = this.labelList.id
          this.replyType = this.global.categoryItems[index]
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 翻译 数字
    getNum(data) {
      return !data ? 0 : data
    },
    // 翻译日期
    formatTime(time) {
      if (time) {
        return this.parseTime(time)
      }
      return time
    },
    // 翻译数据标签字典
    lableDic(val) {
      let lable = ''
      if (val) {
        this.labelList.labelDtoList.map((item, index) => {
          if (item.id === val) {
            lable = item.labelName
          }
        })
      }
      return lable
    },
    // 回复的回复
    handleReplyToReply(item) {
      this.content = '@' + item.userNickname + ' ' + this.formatTime(item.replyTime) + ' ' + item.replyComment + '\n'
      this.content = this.content.replace('\r\n', '＜br＞')
      this.item = item
    },
    handleEditor(data) {
      this.editor = data
    },
    // 回复提交菜单
    handleReply() {
      if (this.handleVerifUser()) {
        const data = {
          topicId: this.topicsItem.id,
          replyType: this.replyType,
          replyComment: this.editor,
          token: '',
          quoteId: ''
        }
        if (this.item) {
          data.quoteId = this.item.id
        }
        this.$store.dispatch('TokenPost', { url: '/bbspost/topicReply/add', data: data }).then(res => {
          if (res.restCode === '0000') {
            this.item = {}
            this.getPosts()
            this.$refs.wangEditor.handleClearEditor()
            layer.alert('该回复添加成功！', {
              icon: 1,
              title: '提示'
            })
          }
        }).catch((err) => {
          console.log(err)
          this.item = {}
        })
      }
    },
    // 关闭举报框
    handleClose() {
      this.dialogVisible = false
    },
    // 举报帖子
    handleReportPost(item) {
      if (this.handleVerifUser()) {
        this.dialogVisible = true
        this.replyTitle = '举报该帖子'
        this.replyData = {
          userId: this.userInfo.userId,
          postId: item.id,
          reportReson: '',
          reportTypes: ''
        }
      }
    },
    // 举报回复
    reportMsgClick(item) {
      if (this.handleVerifUser()) {
        this.dialogVisible = true
        this.replyTitle = '举报该评论'
        this.replyData = {
          userId: this.userInfo.userId,
          commentId: item.id,
          postId: this.topicsItem.id,
          reportReson: '',
          reportTypes: '',
          token: ''
        }
      }
    },
    // 提交举报内容
    handleSubmit(data) {
      this.$store.dispatch('TokenPost', { url: '/reprotManager/addReport', data: data }).then(res => {
        if (res.restCode === '0000') {
          layer.alert('该内容已经举报成功！', {
            icon: 1,
            title: '提示'
          })
        } else {
          layer.alert('该内容已经举报,不可重复举报！', {
            icon: 5,
            title: '提示'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
      this.dialogVisible = false
    },
    // 点赞 或 收藏
    handleBBS(item) {
      const data = {
        id: this.topicsItem.id,
        topicTitle: this.topicsItem.topicTitle,
        type1: item,
        type2: this.replyType,
        token: ''
      }
      this.$store.dispatch('TokenPost', { url: '/bbspost/topic/praiseOrCancel', data: data }).then(res => {
        if (res.restCode === '0000') {
          if (item === 2) {
            this.topicsItem.collectCount = res.data.num
          }
          if (item === 1) {
            this.topicsItem.praiseCount = res.data.num
          }
        }
      }).catch((err) => {
        console.log(err)
      })
      //
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getPosts()
    },
    // 验证用户是否登录
    handleVerifUser() {
      this.userInfo = store.getters.userInfo
      if (!this.userInfo.userName) {
        const data = 'detail#goto'
        this.$router.push({ name: 'login', params: { data }})
        return false
      } else {
        return true
      }
    }

  }
}
</script>

<style scoped>

</style>
