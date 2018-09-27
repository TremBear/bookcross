<template>
  <div class="fly-panel fly-panel-user" pad20>
    <div class="layui-tab layui-tab-brief" lay-filter="user" id="LAY_msg" style="margin-top: 15px;">
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title" id="LAY_mine">
          <li data-type="collection" data-url="/collection/find/" class="layui-this" lay-id="collection"  v-on:click="getUnreadList()">未读消息</li>
          <li data-type="collection" data-url="/collection/find/" lay-id="collection"  v-on:click="getReadedList()">已读消息</li>
        </ul>
        <div class="layui-tab-content" style="padding: 20px 0;">
          <!--
                          作者：349036010@qq.com
                          时间：2018-07-20
                          描述：未读息列表
                      -->
          <div class="layui-tab-item layui-show">
			<input type='checkbox' style="margin-top: 4px" class='input-checkbox' :checked="unreadIdList.length === unreadList.length" @click='checkedAll()'>全选
			<a class="layui-btn but_style" @click="readAllMsg()">已读</a>
            <ul class="mine-view jie-row">

              <li v-for="(item, index) in unreadList" :key="index">
				<input style="margin-top: 4px" type='checkbox' :checked="unreadIdList.indexOf(item.id)>=0" name='checkboxinput' class='input-checkbox' @click='checkedOne(item.id)'> 
                <a class="jie-title" target="_blank" v-on:click="msgViewData(item.id, item.status)" >{{item.title}}</a>
                <i>{{formatTime(item.sendTime)}}</i>
              </li>

            </ul>

            <div style="text-align: center"/>
            <el-pagination style="text-align: center"
                           @current-change="handleUnreadListCurrentChange"
                           :page-size="pageSize"
                           :current-page="pageNum"
                           prev-text="上一页"
                           next-text="下一页"
                           layout="prev, pager, next"
                           :total="total">
            </el-pagination>

            <div id="notReadMessagePage"></div>
          </div>
          <!--
                          作者：349036010@qq.com
                          时间：2018-07-20
                          描述：已读消息列表
                      -->
          <div class="layui-tab-item">
            <ul class="mine-view jie-row">
              <li v-for="(item, index) in readedList" :key="index">
                <a class="jie-title" target="_blank" v-on:click="msgViewData(item.id, item.status)" >{{item.title}}</a>
                <i>{{formatTime(item.sendTime)}}</i>
              </li>
            </ul>

            <div style="text-align: center"/>
            <el-pagination style="text-align: center"
                           @current-change="handleReadedListCurrentChange"
                           :page-size="pageSize"
                           :current-page="pageNum"
                           prev-text="上一页"
                           next-text="下一页"
                           layout="prev, pager, next"
                           :total="total">
            </el-pagination>

            <div id="readMessagePage"></div>
          </div>
        </div>
      </div>
    </div>

    <!--预览-->
    <div><msg-div-dialog v-bind:msgData="msgData" v-bind:dialogVisible="dialogVisible" @handleClose="handleClose" /></div>

  </div>
</template>

<script>
  import store from '@/store'
  import msgDiv from '@/components/MsgDiv'

  export default {
    name: "user_messager",
    components: {
      'msg-div-dialog':msgDiv
    },
    inject:['reload'],
      data() {
      return {
        userInfo:JSON.parse(sessionStorage.getItem("userInfo")),
        total: 0,
        pageSize:13,
        pageNum: 1,
        labelId: 1,
        lableName: '',
        unreadList : {},
		unreadIdList : [],
        readedList : {},
        dialogVisible:false,
        msgData: {},
        msgId:'',
        magStatus:'',
		// 初始化全选按钮, 默认不选
		isCheckedAll: false
      }
    },
    created: function() {
      this.getUnreadList()
    },
    methods:{
      // 未读息列表
      getUnreadList() {
        let params = {userId:this.userInfo.userId, pageNum:this.pageNum, pageSize:this.pageSize} // 组装参数
        this.$store.dispatch('Post', { url: '/bbsusercenter/msg/unReadList', data:params })  // 请求
          .then(res => {
            //接口返回数据
            if (res.restCode === '0000') {
              this.unreadList = res.data.list
              this.total = res.data.total
            }
          }).catch((err) => {
          console.log(err)
        })
      },

      // 已读消息列表
      getReadedList() {
        let params = {userId:this.userInfo.userId, pageNum:this.pageNum, pageSize:this.pageSize} // 组装参数
        this.$store.dispatch('Post', { url: '/bbsusercenter/msg/readList', data:params })  // 请求
          .then(res => {
            //接口返回数据
            if (res.restCode === '0000') {
              this.readedList = res.data.list
              this.total = res.data.total
            }
          }).catch((err) => {
          console.log(err)
        })
      },

      // 查询请求
      getDetail(id) {
        this.$store.dispatch('Get', { url: '/bbsusercenter/msg/content/'+id }).then(res => {
          if (res.restCode === '0000') {
            this.msgData=res.data
            return res.data
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      // 修改状态
      modifyStatus(msgId) {
        this.$store.dispatch('Get', { url: '/bbsusercenter/msg/read/'+msgId }).then(res => {
          if (res.restCode === '0000') {
            this.reload()  //  刷新页面
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      // 详情框
      msgViewData(id, status) {
        this.getDetail(id)
        this.msgId = id
        this.dialogVisible = true
        this.magStatus = status
      },
	  
	  //checkedOne
	  checkedOne (id) {
        let idIndex = this.unreadIdList.indexOf(id)
        if (idIndex >= 0) {
          // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
          this.unreadIdList.splice(idIndex, 1)
        } else {
          // 选中该checkbox
          this.unreadIdList.push(id)
        }
		
		console.info(this.unreadIdList)
      },
	  
	  //checkedAll
      checkedAll () {
        this.isCheckedAll = !this.isCheckedAll
        if (this.isCheckedAll) {
          // 全选时
          this.unreadIdList = []
          this.unreadList.forEach(function (item) {
            this.unreadIdList.push(item.id)
          }, this)
        } else {
          this.unreadIdList = []
        }
		
		console.info(this.unreadIdList)
	  },
	  
	  // 批量已读
	  readAllMsg() {
		 let params = {userId:this.userInfo.userId, ids:this.unreadIdList.join(",")} // 组装参数
		 this.$store.dispatch('Post', { url: '/bbsusercenter/msg/readSelected',  data:params }).then(res => {
          if (res.restCode === '0000') {
            this.reload()  //  刷新页面
          }
        }).catch((err) => {
          console.log(err)
        })
	  },
	  
      // 关闭弹框
      handleClose(){
        this.dialogVisible = false
        if (this.magStatus == 0) {  // 修改状态（未读->已读）
          this.modifyStatus(this.msgId)
        }
      },
      // 页面分页
      handleCurrentChange(val){
        this.pageNum = val
        this.type =  this.getCategory()
      },
      // 未读分页
      handleUnreadListCurrentChange(val) {
        this.handleCurrentChange(val)
        this.getUnreadList()
      },
      // 已读分页
      handleReadedListCurrentChange(val) {
        this.handleCurrentChange(val)
        this.getReadedList()
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
	.but_style{
		height: 27px;
		line-height: 27px;
		font-size: 15px;
	}
</style>
