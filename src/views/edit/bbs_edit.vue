<template>
  <div style="margin-top: 7px;">
    <div class="layui-row layui-col-space15" style="margin-left: 17%;">
      <!--<div class="fly-none">没有权限</div>-->
      <div class="layui-col-md8 content detail">

        <div class="fly-panel detail-box">
          <h1>{{ topicsItem.topicTitle }}</h1>
          <div class="fly-detail-info">
            <span class="layui-badge layui-bg-blue">{{ lableDic(topicsItem) }}</span>
            <span v-if="topicsItem.topicType===3 || topicsItem.topicType===4" class="layui-badge layui-bg-red" >置顶</span>
            <span v-if="topicsItem.topicType===2 || topicsItem.topicType===4" class="layui-badge layui-bg-red" >精华</span>
            <span class="fly-list-nums">
              <a @click="handleBBS(2)"><i class="layui-icon" title="收藏">&#xe658;</i> {{ getNum(topicsItem.collectCount) }}</a>
              <a @click="handleBBS(1)"><i class="layui-icon" title="点赞">&#xe6c6;</i> {{ getNum(topicsItem.praiseCount) }}</a>
              <a href="#comment"><i class="layui-icon" title="评论">&#xe611;</i> {{ getNum(topicsItem.replyCount) }}</a>
              <i class="iconfont" title="浏览">&#xe60b;</i> {{ getNum(topicsItem.browseCount) }}
            </span>
          </div>
          <div class="detail-about">
            <a class="fly-avatar" href="user_info.html">
              <img :src="!topicsItem.userImagePath?'/static/cweg.jpg':topicsItem.userImagePath">
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

        <div class="layui-tab layui-tab-brief" lay-filter="user">
          <ul class="layui-tab-title">
            <li class="layui-this">追加帖子</li>
          </ul>

          <div id="LAY_ucm" class="layui-form layui-tab-content" style="padding: 20px 0;">
            <div class="layui-tab-item layui-show">

              <div class="layui-form-item layui-form-text">
                <div class="layui-input-block">
                  <!--富文本框-->
                  <wang-editor :menus="menus" v-model="editorContent" @handleEditor="handleEditor"/>
                </div>
              </div>
              <div class="layui-form-item">
                <button class="layui-btn" style="margin-top: 13px;" @click="appendTopicContent()">立即发布</button>
                <button class="layui-btn" style="margin-top: 13px;width: 96px;" @click="previewBbs()">预览</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!--预览-->
    <div><preview-dialog :preview-data="previewData" :dialog-visible="dialogVisible" @handleClose="handleClose" /></div>

  </div>
</template>

<script>
import store from '@/store'
import wangeditor from '@/components/wangeditor'
import { getToken } from '@/utils/auth'
import { parseTime } from '@/utils/index'
import previewDialog from '@/components/PreviewDialog'
import { mapGetters } from 'vuex'
export default {
  name: 'BbsEdit',
  components: {
    'wang-editor': wangeditor,
    'preview-dialog': previewDialog
  },
  inject: ['userInfo'],
  computed: {
    ...mapGetters([
      'sideItem'
    ]),
    sideItem() {
      return store.getters.sideItem
    }
  },
  data() {
    return {
      topicsItem: {},
      dialogVisible: false,
      item: {},
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      previewData: {},
      replyType: '',
      value: 0,
      editorContent: '',
      menus: [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'justify', // 对齐方式
        'emoticon', // 表情
        'image' // 插入图片
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
      const detail = sessionStorage.getItem('edit')

      this.$store.dispatch('Post', { url: '/bbspost/topic/getPost', data: JSON.parse(detail) }).then(res => {
        if (res.restCode === '0000') {
          this.topicsItem = res.data
          const index = this.sideItem.id
          this.replyType = this.global.categoryItems[index]
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    // 追加分割线
    segmentingLine() {
      return '<fieldset data-v-8e112b9e="" class="layui-elem-field layui-field-title" style="text-align: center;">' +
        '<legend data-v-8e112b9e="">追加' +
        parseTime(new Date()) +
        '</legend>' +
        '</fieldset>'
    },

    // 获取追加的内容
    getAppendContent() {
      if (Object.keys(this.editorContent.trim()).length == 0 ||
      this.editorContent.trim() === '<p><br></p>') { // 富文本框为空
        return ''
      } else {
        return this.segmentingLine() + this.editorContent
      }
    },

    // 追加内容
    appendTopicContent() {
      const appendContent = this.getAppendContent()
      if (appendContent == '') {
        layer.alert('请输入内容', {
          icon: 5,
          title: '提示'
        })
        return
      }

      // 组装后台数据
      const data = { token: getToken(), content: appendContent, id: this.topicsItem.id }

      if (this.handleVerifUser()) {
        // 请求后台
        this.$store.dispatch('TokenPost', { url: '/bbsusercenter/topic/appendTopicContent', data: data }).then(res => {
          if (res.restCode === '0000') {
            // 成功后跳转到帖子详情页面
            const datas = { id: this.topicsItem.id, entry: 1 }
            sessionStorage.setItem('detail', JSON.stringify(datas))
            this.$router.push({ path: 'detail#goto' })
          } else {
            layer.msg(res.restMsg)
          }
        }).catch((err) => {
          console.log(err)
          layer.alert('追加失败', {
            icon: 5,
            title: '提示'
          })
        })
      }
    },

    // 预览
    previewBbs() {
      console.info('editorContent' + this.editorContent)
      this.dialogVisible = true
      this.previewData = {
        topicTitle: this.topicsItem.topicTitle,
        topicContent: this.topicsItem.topicContent + this.getAppendContent(),
        topicType: this.topicsItem.topicType,
        labelId: this.topicsItem.labelId,
        userNickname: this.topicsItem.userNickname,
        modifyTime: this.topicsItem.modifyTime
      }
      console.log(this.previewData)
    },

    // 获取富文本框内容
    handleEditor(data) {
      this.editorContent = data
      console.log(data)
    },

    // 点赞或收藏
    handleBBS(item) {
      console.log(this.topicsItem)
      const data = {
        id: this.topicsItem.id,
        topicTitle: this.topicsItem.topicTitle,
        type1: item,
        type2: this.replyType,
        token: ''
      }
      this.$store.dispatch('TokenPost', { url: '/bbspost/topic/praiseOrCancel', data: data }).then(res => {
        if (res.restCode === '0000') {
          console.log(res)
        }
      }).catch((err) => {
        console.log(err)
      })
      //
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

     // 翻译数据字典
    lableDic(data) {
      let lable = ''
      const code = this.global.categoryItems[data.postContentType]
      const side = this.sideItem.find((element) => (element.id === code))
      side.labelDtoList.map((item, index) => {
        if (item.id === data.labelId) {
          lable = item.labelName
        }
      })
      return lable
    },

    // 验证用户是否登录
    handleVerifUser() {
      if (!this.userInfo) {
        const data = 'bbs_edit#goto'
        this.$router.push({ name: 'login', params: { data }})
        return false
      } else {
        return true
      }
    },
    // 关闭弹框
    handleClose() {
      this.dialogVisible = false
    },
    // 富文本框编辑
    handleEditor(data) {
      this.editorContent = data
    }
  }
}
</script>

<style >
  .el-select .el-input.is-focus .el-input__inner{
    border-color:#dcdfe6;
  }
  .layui-input-block {
    margin-left: 0px;
  }
</style>
