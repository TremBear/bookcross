<template>
  <div class="fly-panel fly-panel-user" pad20>
    <div class="layui-tab layui-tab-brief" lay-filter="user">
      <ul id="LAY_mine" class="layui-tab-title">
        <li data-type="mine-jie" lay-id="index" class="layui-this" @click="getMyTopics()">我的发帖</li>
        <li data-type="collection" data-url="/collection/find/" lay-id="collection" @click="getMyDraftTopis()">我的草稿</li>
        <li data-type="collection" data-url="/collection/find/" lay-id="collection" @click="getMyCollectTopics()">我收藏的帖</li>
        <li data-type="collection" data-url="/collection/find/" lay-id="collection" @click="getMyPraiseTopics()">我点赞的帖</li>
        <li data-type="collection" data-url="/collection/find/" lay-id="collection" @click="getMyReplyTopics()">我评论的帖</li>
      </ul>
      <div class="layui-tab-content" style="padding: 20px 0;">
        <!--
                        作者：349036010@qq.com
                        时间：2018-07-20
                        描述：我发布的帖子列表
                    -->
        <div id="my-topics" class="layui-tab-item layui-show">
          <ul class="mine-view jie-row">

            <li v-for="(item, index) in myTopics" :key="index">
              <a class="publish">
                <div v-if="item.postContentType === 1">帖子</div>
                <div v-else-if="item.postContentType === 2">公告</div>
                <div v-else-if="item.postContentType === 3">意见帖</div>
              </a>
              <a class="layui-badge">{{ lableDic(item) }}</a>
              <a class="jie-title" target="_blank" @click="handleDetail(item, 0)">{{ item.topicTitle }}</a>
              <i>{{ formatTime(item.modifyTime) }}</i>
              <i style="padding-left: 10px;">{{ item.browseCount }}阅 / {{ item.praiseCount }}赞 / {{ item.collectCount }}收藏</i>
              <em>
                <button class="layui-btn layui-btn-xs" @click="appendTopicContent(item)">追加</button>
                <div v-if="item.isOpenComment === 0">
                  <button id="bbsOpen" class="layui-btn layui-btn-xs" @click="discussPost(item.postContentType, item.id, '1');">开启评论</button>
                </div>
                <div v-if="item.isOpenComment === 1">
                  <button id="bbsClose" class="layui-btn layui-btn-xs" @click="discussPost(item.postContentType, item.id, '0');">关闭评论</button>
                </div>
              </em>
            </li>
          </ul>

          <div style="text-align: center"/>
          <el-pagination
            :page-size="pageSize"
            :current-page="pageNum"
            style="text-align: center"
            :total="total"
            prev-text="上一页"
            next-text="下一页"
            layout="prev, pager, next"
            @current-change="handleMyTopicsCurrentChange"/>
        </div>

        <!--
                        作者：349036010@qq.com
                        时间：2018-07-20
                        描述：我的草稿箱
                    -->
        <div class="layui-tab-item">
          <ul class="mine-view jie-row">
            <li v-for="(item, index) in myDraftTopis" :key="index">
              <a class="publish">
                <div v-if="item.postContentType === 1">帖子</div>
                <div v-else-if="item.postContentType === 2">公告</div>
                <div v-else-if="item.postContentType === 3">意见帖</div>
              </a>
              <a class="layui-badge">{{ lableDic(item) }}</a>
              <a class="jie-title" target="_blank" @click="handleDraftDetail(item)">{{ item.topicTitle }}</a>
              <i>{{ formatTime(item.modifyTime) }}</i>
              <em>
                <button class="layui-btn layui-btn-xs" @click="handleDraftDetail(item)">编辑</button>
                <button class="layui-btn layui-btn-xs" @click="deleteDraft(item.id)">删除</button>
              </em>
            </li>
          </ul>

          <div style="text-align: center"/>
          <el-pagination
            :page-size="pageSize"
            :current-page="pageNum"
            style="text-align: center"
            :total="total"
            prev-text="上一页"
            next-text="下一页"
            layout="prev, pager, next"
            @current-change="handleMyDraftTopisCurrentChange"/>
        </div>

        <!--
                        作者：349036010@qq.com
                        时间：2018-07-20
                        描述：我收藏的帖子
                    -->
        <div class="layui-tab-item">
          <ul class="mine-view jie-row">
            <li v-for="(item, index) in myCollectTopics" :key="index">
              <a class="publish">
                <div v-if="item.postContentType === 1">帖子</div>
                <div v-else-if="item.postContentType === 2">公告</div>
                <div v-else-if="item.postContentType === 3">意见帖</div>
              </a>
              <a class="layui-badge">{{ lableDic(item) }}</a>
              <a class="jie-title" target="_blank" @click="handleDetail(item, 1)">{{ item.topicTitle }}</a>
              <i>{{ formatTime(item.modifyTime) }}</i>
              <i style="padding-left: 10px;">{{ item.browseCount }}阅 / {{ item.praiseCount }}赞 / {{ item.collectCount }}收藏</i>
              <em>
                <button class="layui-btn layui-btn-xs" @click="cancel(item, 'collect')">取消收藏</button>
              </em>
            </li>
          </ul>

          <div style="text-align: center"/>
          <el-pagination
            :page-size="pageSize"
            :current-page="pageNum"
            style="text-align: center"
            :total="total"
            prev-text="上一页"
            next-text="下一页"
            layout="prev, pager, next"
            @current-change="handleMyCollectTopicsCurrentChange"/>
        </div>

        <!--
                        作者：349036010@qq.com
                        时间：2018-07-20
                        描述：我点赞的帖子
                    -->
        <div class="layui-tab-item">
          <ul class="mine-view jie-row">
            <li v-for="(item, index) in myPraiseTopics" :key="index">
              <a class="publish">
                <div v-if="item.postContentType === 1">帖子</div>
                <div v-else-if="item.postContentType === 2">公告</div>
                <div v-else-if="item.postContentType === 3">意见帖</div>
              </a>
              <a class="layui-badge">{{ lableDic(item) }}</a>
              <a class="jie-title" target="_blank" @click="handleDetail(item, 1)">{{ item.topicTitle }}</a>
              <i>{{ formatTime(item.modifyTime) }}</i>
              <i style="padding-left: 10px;">{{ item.browseCount }}阅 / {{ item.praiseCount }}赞 / {{ item.collectCount }}收藏</i>
              <em>
                <button class="layui-btn layui-btn-xs" @click="cancel(item, 'praise')">取消点赞</button>
              </em>
            </li>
          </ul>

          <div style="text-align: center"/>
          <el-pagination
            :page-size="pageSize"
            :current-page="pageNum"
            style="text-align: center"
            :total="total"
            prev-text="上一页"
            next-text="下一页"
            layout="prev, pager, next"
            @current-change="handleMyPraiseTopicsCurrentChange"/>
        </div>

        <!--
                        作者：349036010@qq.com
                        时间：2018-07-20
                        描述：我评论的帖子
                    -->
        <div class="layui-tab-item">
          <ul class="mine-view jie-row">
            <li v-for="(item, index) in myReplyTopics" :key="index">
              <a class="publish">
                <div v-if="item.postContentType === 1">帖子</div>
                <div v-else-if="item.postContentType === 2">公告</div>
                <div v-else-if="item.postContentType === 3">意见帖</div>
              </a>
              <a class="layui-badge">{{ lableDic(item) }}</a>
              <a class="jie-title" target="_blank" @click="handleDetail(item, 1)">{{ item.topicTitle }}</a>
              <i>{{ formatTime(item.modifyTime) }}</i>
              <i style="padding-left: 10px;">{{ item.browseCount }}阅 / {{ item.praiseCount }}赞 / {{ item.collectCount }}收藏</i>
            </li>
          </ul>

          <div style="text-align: center"/>
          <el-pagination
            :page-size="pageSize"
            :current-page="pageNum"
            style="text-align: center"
            :total="total"
            prev-text="上一页"
            next-text="下一页"
            layout="prev, pager, next"
            @current-change="handleMyReplyTopicsCurrentChange"/>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import store from '@/store'
import Rightbar from '@/components/Rightbar'
import Sidebar from '@/components/Sidebar'
import { mapGetters } from 'vuex'
export default {
  name: 'UserBbs',
  inject: ['reload'],
  components: {
    'right-bar': Rightbar,
    'side-bar': Sidebar
  },
  computed: {
    ...mapGetters([
      'sideItem'
    ]),
    sideItem() {
      return JSON.parse(sessionStorage.getItem('sideItem'))
    }
  },
  data() {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      myTopics: [],
      myDraftTopis: [],
      myCollectTopics: [],
      myPraiseTopics: [],
      myReplyTopics: [],
      dialogVisible: false,
      total: 0,
      pageSize: 13,
      labelId: 1,
      lableName: '',
      keyword: '',
      pageNum: 1,
      type: 1
    }
  },
  mounted() {
    this.getMyTopics() // 定义方法
  },
  methods: {

    // 跳转到追加页面
    appendTopicContent(data) {
      const params = { id: data.id, entry: 1, type: this.type }
      sessionStorage.setItem('edit', JSON.stringify(params))
      this.$router.push({ name: 'bbs_edit', params: params })
    },

    // 关闭弹框
    handleClose() {
      this.dialogVisible = false
    },

    // 调用tokenPost方法提交,成功则刷新页面
    tokenPost(url, params) {
      this.$store.dispatch('TokenPost', { url: url, data: params })
        .then(res => {
			console.info(res)
          if (res.restCode === '0000') {
            layer.msg('操作成功') // 操作成功，弹框
            this.reload() //  刷新页面
          } else {
            layer.msg(res.restMsg)
          }
        })
    },

    // 开启/关闭评论弹框
    discussPost(type, id, isOpenComment) {
      const that = this
      let msg = ''
      if (isOpenComment == 1) {
        msg = '是否确认开启评论'
      } else {
        msg = '是否确认关闭评论'
      }
      layer.confirm(msg, {
        btn: ['确定', '取消'] // 按钮
      }, function() { // 确定按钮
        const url = '/bbspost/topicReply/userdiscussPost'
        const params = { type: type, id: id, isOpenComment: isOpenComment, userId: that.userInfo.userId }
        console.log(params)
        that.tokenPost(url, params)
      })
    },

    // 取消收藏或者点赞
    cancel(data, type) {
      const params = { userId: this.userInfo.userId, topicId: data.id, topicTitle: data.topicTitle, userNickname: this.userInfo.userNickname, postContentType: data.postContentType};
	  var url = '';
      if (type == 'collect') {
		url  = '/bbsusercenter/collect/collectOrCancel';
      } else if (type == 'praise') {
		url  = '/bbsusercenter/praise/praiseOrCancel';
      } else {

      }
      console.info(params)

      this.tokenPost(url, params)
    },

    // 删除草稿箱
    deleteDraft(id) {
      const that = this
      const msg = '是否删除草稿'

      layer.confirm(msg, {
        btn: ['确定', '取消'] // 按钮
      }, function() { // 确定按钮
        const url = '/bbsusercenter/draft/deleteDraft'
        const params = { id: id }
        console.log(params)
        that.tokenPost(url, params)
      })
    },

    // 我的草稿箱列表
    getMyDraftTopis() {
      const params = { userId: this.userInfo.userId, pageNum: this.pageNum, pageSize: this.pageSize, token: '' } // 组装参数
      this.$store.dispatch('TokenPost', { url: '/bbsusercenter/userCenter/myDraftTopis', data: params }) // 请求
        .then(res => {
          // 接口返回数据
          console.log(res)
          if (res.restCode === '0000') {
            this.myDraftTopis = res.data.list
            this.total = res.data.total
          }
        }).catch((err) => {
          console.log(err)
        })
    },

    // 跳转到草稿箱编辑页
    handleDraftDetail(data) {
      console.info(data)
      sessionStorage.setItem('draftId', JSON.stringify(data.id))
      this.$router.push({ name: 'publish', params: data })
    },

    // 我的帖子列表
    getMyTopics() { // 具体的方法实现
      const params = { userId: this.userInfo.userId, pageNum: this.pageNum, pageSize: this.pageSize, token: '' } // 组装参数
      this.$store.dispatch('TokenPost', { url: '/bbsusercenter/userCenter/myTopics', data: params }) // 请求
        .then(res => {
          // 接口返回数据
          if (res.restCode === '0000') {
            this.myTopics = res.data.list
            this.total = res.data.total
          }
        }).catch((err) => {
          console.log(err)
        })
    },

    // 查询我的收藏列表
    getMyCollectTopics() {
      const params = { userId: this.userInfo.userId, pageNum: this.pageNum, pageSize: this.pageSize, token: '' } // 组装参数
      this.$store.dispatch('TokenPost', { url: '/bbsusercenter/collect/getCollects', data: params }) // 请求
        .then(res => {
          // 接口返回数据
          if (res.restCode === '0000') {
            this.myCollectTopics = res.data.list
            this.total = res.data.total
          }
        }).catch((err) => {
          console.log(err)
        })
    },

    // 查看我的点赞列表
    getMyPraiseTopics() {
      const params = { userId: this.userInfo.userId, pageNum: this.pageNum, pageSize: this.pageSize, token: '' } // 组装参数
      this.$store.dispatch('TokenPost', { url: '/bbsusercenter/praise/getPraises', data: params }) // 请求
        .then(res => {
          // 接口返回数据
          if (res.restCode === '0000') {
            this.myPraiseTopics = res.data.list
            this.total = res.data.total
          }
        }).catch((err) => {
          console.log(err)
        })
    },

    // 查询我的评论列表
    getMyReplyTopics() {
      const params = { userId: this.userInfo.userId, pageNum: this.pageNum, pageSize: this.pageSize, token: '' } // 组装参数
      this.$store.dispatch('TokenPost', { url: '/bbsusercenter/userCenter/myReplyTopics', data: params }) // 请求
        .then(res => {
          // 接口返回数据
          if (res.restCode === '0000') {
            this.myReplyTopics = res.data.list
            this.total = res.data.total
          }
        }).catch((err) => {
          console.log(err)
        })
    },

    // 页面分页
    handleCurrentChange(val) {
      this.pageNum = val
      this.type = this.getCategory()
    },

    // 页面分页-我的帖子列表
    handleMyTopicsCurrentChange(val) {
      this.handleCurrentChange(val)
      this.getMyTopics()
    },

    // 页面分页-我的草稿箱
    handleMyDraftTopisCurrentChange(val) {
      this.handleCurrentChange(val)
      this.getMyDraftTopis()
    },

    // 页面分页-查询我的收藏列表
    handleMyCollectTopicsCurrentChange(val) {
      this.handleCurrentChange(val)
      this.getMyCollectTopics()
    },

    // 页面分页-查看我的点赞列表
    handleMyPraiseTopicsCurrentChange(val) {
      this.handleCurrentChange(val)
      this.getMyPraiseTopics()
    },

    // 页面分页-查询我的评论列表
    handleMyReplyTopicsCurrentChange(val) {
      this.handleCurrentChange(val)
      this.getMyReplyTopics()
    },

    // 跳转到详情页
    handleDetail(data, entry) {
      const datas = { id: data.id, entry: entry, type: this.type }
      sessionStorage.setItem('detail', JSON.stringify(datas))
      this.$router.push({ name: 'detail', params: datas })
    },

    // 翻译数据字典
    lableDic(data) {
      let lable = ''
      const code = this.global.categoryItems[data.postContentType]
      const side = this.sideItem.find((element) => (element.id === code))
      side.labelDtoList.map((item, index) => {
        if (item.id === data.labelId) {
          lable = item.labelName
		  return 
        }
      })
      return lable
    },

    // 获取页面类目下标
    getCategory() {
      const index = store.getters.sideItem.id
      return this.global.categoryItems[index]
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

<style scoped>

</style>
