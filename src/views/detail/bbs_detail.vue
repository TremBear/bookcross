<template>
  <div style="margin-top: 7px;">
    <div class="layui-container">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md8 content detail">
          <div class="fly-panel detail-box">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <div class="block">
                    <el-carousel height="250px" style="border:1px solid">
                      <el-carousel-item v-for="item in 4" :key="item">
                        <h3>{{ item }}</h3>
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                </div>
              </el-col>
              <el-col :span="16">
                <div class="grid-content bg-purple">
                  <div class="grid-demo" style="font-size: larger">
                    <p><b>书名：</b><span>双城记</span></p>
                    <p><b>作者：</b><span>狄更斯</span></p>
                    <p><b>主人：</b><span>刘晓明</span></p>
                    <p><b>类别：</b><span>国外小说</span></p>
                    <br/>
                    <el-rate
                      v-model="value5"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}">
                    </el-rate>
                    <br/>
                    <el-row>
                      <el-button size="mini" type="info">正在借阅中...</el-button>
                      <el-button size="mini" type="primary">收藏</el-button>
                    </el-row>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div style="
            	position: relative;
              line-height: 42px;
              padding: 15px 15px 15px 15px;
              font-size: 13px;
              background-color: #f8f8f8;
              color: #999;
              margin-top: 20px">
              <p>《双城记》是英国作家查尔斯·狄更斯所著的一部以法国大革命为背景所写成的长篇历史小说，首次出版于1859年。
                故事中将巴黎、伦敦两个大城市连结起来，围绕着曼马内特医生一家和以德发日夫妇为首的圣安东尼区展开故事。小说里描写了贵族如何败坏、如何残害百姓，人民心中积压对贵族的刻骨仇恨，导致了不可避免的法国大革命。书名中的“双城”指的是巴黎与伦敦。</p>
            </div>

            <div class="fly-panel">
              <div class="fly-panel-title">
                <h3>精彩书评</h3>
              </div>
            </div>
            <div class="fly-panel">
              <div class="fly-panel-title">
                <h3>漂流轨迹</h3>
              </div>
              <div style="padding: 5px">
                <template>
                  <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                      fixed
                      prop="date"
                      label="日期"
                      width="150">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="发送者"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="接收者"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="address"
                      label="接收地址"
                      width="300">
                    </el-table-column>
                  </el-table>
                </template>
              </div>
            </div>
            <h1>{{ topicsItem.topicTitle }}</h1>
            <div class="fly-detail-info">
              <span class="layui-badge layui-bg-blue" :style="topicsItem.labelId?'':{height: 0 +'px' }">{{ lableDic(topicsItem.labelId) }}</span>
              <span v-if="topicsItem.topicType===3 || topicsItem.topicType===4"
                    class="layui-badge layui-bg-red">置顶</span>
              <span v-if="topicsItem.topicType===2 || topicsItem.topicType===4"
                    class="layui-badge layui-bg-red">精华</span>
              <span class="fly-list-nums">
                <a @click="handleReportPost(topicsItem)"><i class="layui-icon" title="举报">&#x1007;</i> 举报</a>
                <a @click="handleBBS2" :disabled="collectDisabled"><i class="layui-icon" title="收藏">&#xe658;</i> {{ getNum(topicsItem.collectCount) }}</a>
                <a @click="handleBBS1" :disabled="praiseDisabled"><i class="layui-icon" title="点赞">&#xe6c6;</i> {{ getNum(topicsItem.praiseCount) }}</a>
                <a @click="handleReplyToReply"><i class="layui-icon" title="评论">&#xe611;</i> {{ getNum(topicsItem.replyCount) }}</a>
                <i class="iconfont" title="浏览">&#xe60b;</i> {{ getNum(topicsItem.browseCount) }}
              </span>
            </div>
            <div class="detail-about">
              <a class="fly-avatar" href="#">
                <img :src="!topicsItem.userImagePath?'./static/cweg.jpg':topicsItem.userImagePath">
              </a>
              <div class="fly-detail-user">
                <a href="#" class="fly-link">
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
                    <img :src="!item.userImagePath?'./static/cweg.jpg':item.userImagePath" alt=" ">
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
                  <a @click="handleReplyToReply(item,index)">
                    <span type="reply">
                      <i class="iconfont icon-svgmoban53"/>
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
                  <wang-editor ref="wangEditor" :menus="menus" :replyConent="replyConent" :content="content"/>
                </div>
              </div>
              <div class="layui-item">
                <button style="margin-top: -3px;" :class="activeClass ? 'layui-btn layui-btn-disabled':'layui-btn'"
                        :disabled="activeClass" @click="handleReply">提交回复
                </button>
                <div class="layui-form-item" style="display: inline-block;margin-left: 7px;">
                  <label class="layui-form-label">发布形式</label>
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
        <keep-alive>
          <right-bar/>
        </keep-alive>
      </div>
    </div>
    <div>
      <report-msg-div :reply-data="replyData" :reply-title="replyTitle" :dialog-visible="dialogVisible"
                      @handleClose="handleClose" @handleSubmit="handleSubmit"/>
    </div>
    <div>
      <login-dialog :login-dialog-visible="loginDialogVisible" @handleLoginClose="handleLoginClose"/>
    </div>
  </div>
</template>

<script>
  import Rightbar from '@/components/Rightbar'
  import Sidebar from '@/components/Sidebar'
  import ReportMsgDiv from '@/components/ReportMsgDiv'
  import LoginDialog from '@/components/LoginDialog'
  import store from '@/store'
  import wangeditor from '@/components/wangeditor'
  import {mapGetters} from 'vuex'

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
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区****'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区****'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: ''
        }],
        value5: 3.7,
        options: [{
          label: '昵称',
          value: 0
        }, {
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
        this.$store.dispatch('Post', {url: '/bbspost/topic/getPost', data: detail}).then(res => {
          if (res.restCode === '0000') {
            this.topicsItem = res.data
            this.topicsItem.topicTitle = this.topicsItem.topicTitle.substr(0, 60)
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
            replyComment = item.replyComment.substr(item.replyComment.lastIndexOf('-') + 1)
          } else {
            replyComment = item.replyComment
          }
          this.replyConent = '\n 回复:' + item.replyFloor + '楼 \n@' + item.userNickname + '<\/br> ' + this.filterHTMLTag(replyComment).substr(0, 20) + '\n <\/br> --------------------------------------------------------------'
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
            this.editor = this.replyConent + this.$refs.wangEditor.handleEditorTxt()
          } else {
            this.editor = this.$refs.wangEditor.handleEditorTxt()
          }
          let imgUrl = ''
          if (this.issueValue === 1) {
            imgUrl = this.global.isRoundImg()
          }
          const data = {
            topicId: this.topicsItem.id,
            replyType: this.replyType,
            replyComment: this.editor,
            isRealName: this.issueValue,
            userImagePath: imgUrl,
            token: '',
            quoteId: ''
          }
          if (this.item) {
            data.quoteId = this.item.id
          }
          this.$store.dispatch('TokenPost', {url: '/bbspost/topicReply/add', data: data}).then(res => {
            if (res.restCode === '0000') {
              this.item = {}
              this.getPosts()
              this.$refs.wangEditor.handleClearEditor()
              layer.alert('该回复添加成功！', {
                icon: 1,
                title: '提示'
              })
            } else {
              layer.alert(res.restMsg, {
                icon: 5,
                title: '提示'
              })
            }
            setTimeout(function () {
              that.activeClass = false
            }, 5000)
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
            reportTypes: '',
            topicTitle: this.topicsItem.topicTitle,
            topicType: this.replyType
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
            topicTitle: this.topicsItem.topicTitle,
            reportTypes: '',
            topicType: this.replyType
          }
        }
      },
      // 提交举报内容
      handleSubmit(data) {
        this.$store.dispatch('Post', {url: '/bbsadmin/reprotManager/addReport', data: data}).then(res => {
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
            this.$store.dispatch('TokenPost', {url: '/bbsusercenter/praise/praiseOrCancel', data: data}).then(res => {
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
                this.topicsItem.collectCount = res.data.num
              } else {
                layer.msg(res.restMsg)
              }
              this.collectDisabled = true
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
