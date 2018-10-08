<template>
  <div style="margin-top: 7px;">
    <div class="layui-container">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md8 content detail">
          <div class="fly-panel detail-box">
            <h1>{{ topicsItem.topicTitle }}</h1>
            <div class="fly-detail-info">
              <span class="layui-badge layui-bg-blue" :style="topicsItem.labelId?'':{height: 0 +'px' }">{{ lableDic(topicsItem.labelId) }}</span>
              <span v-if="topicsItem.topicType===3 || topicsItem.topicType===4" class="layui-badge layui-bg-red" >置顶</span>
              <span v-if="topicsItem.topicType===2 || topicsItem.topicType===4" class="layui-badge layui-bg-red" >精华</span>
              <span class="fly-list-nums">
                <a @click="handleReportPost(topicsItem)"><i class="layui-icon" title="举报">&#x1007;</i> 举报</a>
                <a @click="handleBBS2" :disabled="collectDisabled"><i class="layui-icon" title="收藏">&#xe658;</i> {{ getNum(topicsItem.collectCount) }}</a>
                <a @click="handleBBS1" :disabled="praiseDisabled" ><i class="layui-icon" title="点赞">&#xe6c6;</i> {{ getNum(topicsItem.praiseCount) }}</a>
                <a @click="handleReplyToReply"><i class="layui-icon" title="评论">&#xe611;</i> {{ getNum(topicsItem.replyCount) }}</a>
                <i class="iconfont" title="浏览">&#xe60b;</i> {{ getNum(topicsItem.browseCount) }}
              </span>
            </div>
            <div class="detail-about">
              <a class="fly-avatar" href="#">
                <img :src="!topicsItem.userImagePath?'./static/cweg.jpg':topicsItem.userImagePath" alt="贤心">
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
                <div class="detail-body jieda-body photos">
                  <p v-html="item.replyComment"/>
                </div>
                <div class="jieda-reply" v-if="item.status != 0">
                  <a  @click="handleReplyToReply(item,index)">
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
                  <wang-editor ref="wangEditor" :menus="menus" :replyConent="replyConent" :content="content" @handleEditor="handleEditor"/>
                </div>
              </div>
              <div class="layui-item">
                <button  style="margin-top: -3px;" :class="activeClass ? 'layui-btn layui-btn-disabled':'layui-btn'" :disabled="activeClass"  @click="handleReply">提交回复</button>
                <div class="layui-form-item" style="display: inline-block;margin-left: 7px;">
                  <label  class="layui-form-label">发布形式</label>
                  <div class="layui-input-block">
                    <el-select v-model="issueValue" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <keep-alive><right-bar/></keep-alive>
      </div>
    </div>
    <div><report-msg-div :reply-data="replyData" :reply-title="replyTitle" :dialog-visible="dialogVisible" @handleClose="handleClose" @handleSubmit="handleSubmit"/></div>
    <div><login-dialog :login-dialog-visible="loginDialogVisible" @handleLoginClose="handleLoginClose"/></div>
  </div>
</template>

<script>
import Rightbar from '@/components/Rightbar'
import Sidebar from '@/components/Sidebar'
import ReportMsgDiv from '@/components/ReportMsgDiv'
import LoginDialog from '@/components/LoginDialog'
import store from '@/store'
import wangeditor from '@/components/wangeditor'
import { mapGetters } from 'vuex'
export default {
  name: 'BbsDetail',
  components: {
    'right-bar': Rightbar,
    'side-bar': Sidebar,
    'report-msg-div': ReportMsgDiv,
    'wang-editor': wangeditor,
    'login-dialog': LoginDialog
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
  watch: {
    activeClass() {

    }
  },
  data() {
    return {
      options: [{
        label: '昵称',
        value: 0
      },{
        label: '匿名',
        value: 1
      }],
      issueValue: 0,
      topicsItem: [],
      // 回显内容
      content: '',
      collectDisabled: true,
      praiseDisabled: true,
      activeClass: false,
      // 输入的内容
      replyConent: '',
      editor: '',
      dialogVisible: false,
      loginDialogVisible: false,
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
    this.$store.commit('SET_IS_SHOW_SIDE', true)
    this.getPosts()
  },
  methods: {
    // 初始加载帖子详细信息
    getPosts() {
      const detail = JSON.parse(sessionStorage.getItem('detail'))
      if (!detail.type) {
        detail['type'] = this.navType
      }
      detail['pageSize'] = this.pageSize
      detail['pageNum'] = this.pageNum
      this.$store.dispatch('Post', { url: '/bbspost/topic/getPost', data: detail }).then(res => {
        if (res.restCode === '0000') {
          this.topicsItem = res.data
          if (res.data.replyDetail) {
            this.replyDetailList = res.data.replyDetail.list
            this.total = res.data.replyDetail.total
            this.replyConent = ''
          }
          this.dictLabels.map((item, index) => {
            if (item.id === this.topicsItem.labelId) {
              this.replyType = this.global.categoryItems[item.categoryId]
              return ''
            }
          })
          if (!this.replyType) {
            this.replyType = 2
          }
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
        this.dictLabels.map((item, index) => {
          if (item.id === val) {
            lable = item.labelName
          }
        })
      }
      return lable
    },
    // 回复的回复
    handleReplyToReply(item, index) {
      var anchor = this.$el.querySelector('#goto')
      document.documentElement.scrollTop = anchor.offsetTop
      this.replyConent = ''
      if (index >= 0) {
        let replyComment = ''
        if (item.replyComment.indexOf('---------') > 0) {
          replyComment = item.replyComment.substr(item.replyComment.lastIndexOf('-')+1)
        }else {
          replyComment = item.replyComment
        }
        this.replyConent = '\n 回复:' + item.replyFloor + '楼 \n@' + item.userNickname + this.filterHTMLTag(replyComment).substr(0, 20) + '\n --------------------------------------------------------------'
        this.item = item
      }
    },
    handleEditor(data) {
      this.editor = data
    },
    // 回复提交
    handleReply() {
      this.activeClass = true
      let that = this
      if (this.handleVerifUser()) {
        if (this.replyConent) {
          this.editor = this.replyConent + this.editor
        }
        let imgUrl = ''
        if (this.issueValue === 1) {
          imgUrl = './static/anonym/' + this.global.isRound + '.jpg'
        }
        const data = {
          topicId: this.topicsItem.id,
          replyType: this.replyType,
          replyComment: this.editor,
          isRealName: this.issueValue,
          imgUrl: imgUrl,
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
            setTimeout(function() {
              that.activeClass = false
            }, 5000)
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
        layer.msg('后台异常，请联系管理员!')
        console.log(err)
      })
      this.dialogVisible = false
    },
    handleBBS1() {
      if (this.handleVerifUser()) {
        if (this.praiseDisabled) {
          this.praiseDisabled = false
          const data = {
            topicId: this.topicsItem.id,
            authorId: this.topicsItem.userId,
            topicTitle: this.topicsItem.topicTitle,
            postContentType: this.replyType,
            token: ''
          }
          this.$store.dispatch('TokenPost', {url: '/bbsusercenter/praise/praiseOrCancel', data: data }).then(res => {
            if (res.restCode === '0000') {
              this.topicsItem.praiseCount = res.data.num
              this.praiseDisabled = true
            }
          }).catch((err) => {
            this.praiseDisabled = true
            layer.msg('后台异常，请联系管理员!')
            console.log(err)
          })
        } else {
          layer.msg('提交过于频繁!')
        }
      }
    },
    // 点赞 或 收藏
    handleBBS2() {
      if (this.handleVerifUser()) {
        if (this.collectDisabled) {
          this.collectDisabled = false
          const data = {
            topicId: this.topicsItem.id,
            authorId: this.topicsItem.userId,
            topicTitle: this.topicsItem.topicTitle,
            postContentType: this.replyType,
            token: ''
          }
          this.$store.dispatch('TokenPost', {url: '/bbsusercenter/collect/collectOrCancel', data: data}).then(res => {
            if (res.restCode === '0000') {
              this.topicsItem.praiseCount = res.data.num
              this.collectDisabled = true
            }
          }).catch((err) => {
            this.collectDisabled = true
            layer.msg('后台异常，请联系管理员!')
            console.log(err)
          })
        } else {
          layer.msg('提交过于频繁!')
        }
      }
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
        this.loginDialogVisible = true
        return false
      } else {
        return true
      }
    },
    handleLoginClose() {
      this.activeClass = false
      this.loginDialogVisible = false
    },
    filterHTMLTag(msg) {
      var msg = msg.replace(/<\/?[^>]*>/g, '') // 去除HTML Tag
      return msg
    }

  }
}
</script>

<style scoped>
</style>
