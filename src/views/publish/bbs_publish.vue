<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel" pad20 style="padding-top: 5px;">
      <!--<div class="fly-none">没有权限</div>-->
      <div class="layui-form layui-form-pane">
        <div class="layui-tab layui-tab-brief" lay-filter="user">
          <ul class="layui-tab-title">
            <li class="layui-this">发表新帖
              <!-- 编辑帖子 -->
            </li>
          </ul>
          <div class="layui-form layui-tab-content" id="LAY_ucm" style="padding: 20px 0;">
            <div class="layui-tab-item layui-show">
                <div class="layui-row layui-col-space15 layui-form-item">
                  <div class="layui-col-md3">
                    <label class="layui-form-label">所在标签</label>
                    <div class="layui-input-block">
                      <el-select v-model="labelValue" placeholder="请选择">
                        <el-option
                          v-for="item in lables"
                          :key="item.id"
                          :label="item.labelName"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="layui-col-md9">
                    <label for="L_title" class="layui-form-label">标题</label>
                    <div class="layui-input-block">
                      <input v-model="title_input"  type="text" id="L_title" name="title" required lay-verify="required" autocomplete="off" class="el-input__inner" v-bind:class="{'text-danger': hasError}" clearable placeholder="请输入标题"
                             v-on:blur.lazy="checkInput(title_input.trim())">
                        <!-- <input type="hidden" name="id" value="{{d.edit.id}}"> -->
                    </div>
                  </div>
                </div>
                <div class="layui-form-item layui-form-text">
                  <div class="layui-input-block" v-bind:class="{'div-danger':danger}">
                    <wang-editor v-bind:menus="menus":content="content" @handleEditor="handleEditor"/>
                  </div>
                </div>
              <div class="layui-row layui-col-space15 layui-form-item">
                <div class="layui-col-md3">
                  <label  class="layui-form-label">发布形式</label>
                  <div class="layui-input-block">
                    <el-select v-model="value" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                  <div class="layui-col-md9">
                    <label  class="layui-form-label">评论状态</label>
                    <div class="layui-input-block">
                        <el-select v-model="commentValue" placeholder="请选择">
                          <el-option
                            v-for="item in commentOptions"
                            :key="item.commentValue"
                            :label="item.label"
                            :value="item.commentValue">
                          </el-option>
                        </el-select>
                    </div>
                  </div>
                </div>
                <div class="layui-form-item">
                  <button class="layui-btn" style="margin-top: 13px;" v-on:click="sendBBS">立即发布</button>
                  <button class="layui-btn" style="margin-top: 13px;" v-on:click="addDraft">存草稿箱</button>
                  <button class="layui-btn" style="margin-top: 13px;width: 96px;" v-on:click="previewBbs" >预览</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <preview-dialog v-bind:previewData="previewData" v-bind:dialogVisible="dialogVisible" v-on:handleClose="closeDialog"></preview-dialog>
    </div>
  </div>

</template>

<script>
import wangeditor from '@/components/wangeditor'
import previewDialog from '@/components/PreviewDialog'
import  store from '@/store'
import { getToken } from '@/utils/auth'
import eventVue from '@/utils/event'
import { mapGetters } from 'vuex'
export default {
  name: 'bbs_publish',
  components: {
    'wang-editor': wangeditor,
    'preview-dialog':previewDialog
  },
  computed: {
    ...mapGetters([
      'labelList'
    ]),
    labelList(){
      return store.getters.labelList
    }
  },
    data() {
    return {
      title_input:'',
      options: [{
        label: '昵称',
        value: 0
       },{
        label: '匿名',
        value: 1
       }],
      commentOptions:[
        {
          label: '开启',
          commentValue: 1
        },
        {
          label: '关闭',
          commentValue: 0
        }
      ],
      commentValue:1,
      lables: [],
      labelValue:'',
      value: 0,
      editorContent: '',
      hasError:false,
      danger:false,
      dialogVisible:false,
      previewData:{},
      postType:'',
      content:'',
      topicStatus:0,
      topicId:'',
      menus:[
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'justify',  // 对齐方式
        'emoticon',  // 表情
        'image',  // 插入图片
      ]
    }
  },
  created() {
    const  data =this.labelList
    if(data){
      this.lables = data.labelDtoList
      this.labelValue = this.lables[0].id
      this.postType =this.global.categoryItems[data.id]
    }
    this.eventVue.$emit('getIsShow',false)
    //获取编辑页面信息
    const draftId = sessionStorage.getItem('draftId')
    const draft = {
      token:getToken(),
      id:draftId
    }
    if (draftId){
      console.log(draftId)
      this.$store.dispatch('Post', { url: '/userCenter/myDraftDetail', data: draft }).then(res => {
        console.log(res);
        if (res.restCode === '0000'&& res.data) {
            this.labelValue= res.data.labelId
            this.title_input = res.data.topicTitle
            this.content = res.data.topicContent
            this.commentValue = res.data.isOpenComment;
            this.value = res.data.isRealName
            this.topicStatus = 1
            this.topicId = res.data.id
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  methods: {

    sendBBS(){
      //组装后台数据
      var token = getToken();
      var topic = {}
      //标签id
      topic.labelId=this.labelValue
      if(!this.checkInput(this.title_input.trim())){
        return
      }
      topic.topicTitle=this.title_input
      if(this.editorContent.trim()==''&& this.content.trim()==''){
        this.danger=true
        return
      }
      topic.topicContent=this.editorContent.trim()?this.editorContent.trim():this.content.trim()
      //1代表优车社区，2代表公告，3代表意见
      topic.postType=this.postType
      topic.isOpenComment=this.commentValue;
      topic.isRealName = this.value;
      //0代表普通，1代表草稿
      topic.topicStatus = this.topicStatus;
      topic.id = this.topicId

      const data = {
        topic:JSON.stringify(topic),
        token:token
      }
      console.log(data);
      //请求后台
      this.$store.dispatch('Post', { url: '/front/topic/addTopic', data: data }).then(res => {
        console.log(res);
        if (res.restCode === '0000') {
          //成功后跳转到发布帖子详情页面
          layer.alert("帖子发布成功！",{
            icon:1,
            title:"提示"
          })
          let datas={id:res.data.id, entry:res.data.entry}
          sessionStorage.setItem("detail",JSON.stringify(datas))
          this.$router.push({path:'detail#goto'})
        }
        else{
          console.log(res.restMsg);
          layer.alert("帖子发布失败！",{
            icon:5,
            title:"提示"
          })
        }
      }).catch((err) => {
        console.log(err)
        alert("发表话题失败")
      })
    },
    checkInput(txt){
      if (txt==''){
        this.hasError=true
        return false
      }
      else {
        this.hasError=false
        return true
      }
    },
    addDraft(){
      //组装后台数据
      var token = getToken();
      var topic = {}
      //标签id
      topic.labelId=this.labelValue
      if(!this.checkInput(this.title_input.trim())){
        return
      }
      topic.topicTitle=this.title_input.trim()

      if(this.editorContent==''){
        this.danger=true
        return
      }
      topic.topicContent=this.editorContent.trim()
      //1代表优车社区，2代表公告，3代表意见
      topic.postType=1
      topic.isOpenComment=this.commentValue;
      topic.isRealName = this.value;
      //0代表普通，1代表草稿
      topic.topicStatus = this.topicStatus;

      const data = {
        draft:JSON.stringify(topic),
        token:token
      }
      console.log(data);
      //请求后台
      this.$store.dispatch('Post', { url: '/front/topic/addDraft', data: data }).then(res => {
        console.log(res);
        if (res.restCode === '0000') {
          //成功后跳转到发布帖子详情页面
          layer.alert("保存草稿成功！",{
            icon:1,
            title:"提示"
          })
          this.$router.push({path:'/manager/user_bbs',query: { pageId: 'myDraft' }})
        }
        else{
          console.log(res.restMsg);
          layer.alert("保存草稿失败！",{
            icon:5,
            title:"提示"
          })
        }
      }).catch((err) => {
        console.log(err)
        alert("保存草稿失败")
      })
    },
    previewBbs(){
      if(!this.checkInput(this.title_input)){
        return
      }
      if(this.editorContent==''){
        this.danger=true
        return
      }
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      let name = ''
      if ( this.value == 0 ){
          name = userInfo.userNickname
      }else {
        name = '匿名用户'
      }
      this.dialogVisible = true
      this.previewData = {
        topicTitle:this.title_input,
        topicContent:this.editorContent,
        topicType:this.postType,
        labelId:this.labelValue,
        userNickname:name,
        modifyTime:new Date()/*parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}')*/,
      }
      console.log(this.previewData)
    },
    closeDialog(){
      this.dialogVisible = false
      this.previewData = {}
    },
    handleEditor(data){
      this.editorContent = data
       console.log(data)
    }
  }
}
</script>

<style >
  .el-input__inner:focus {
    outline: none;
    border-color: #409eff;
  }
  .text-danger{
    outline: none;
    border-color: red;
  }
  .div-danger{
    border: 1px solid;
    border-color: red;
  }
  .el-input__inner{
    height: 38px;
    padding: 0px 15px;
    border-radius: 0px;
  }
  .el-select .el-input.is-focus .el-input__inner{
    border-color:#dcdfe6;
  }
  .el-select .el-input__inner:focus{
    border-color:#dcdfe6;
  }
  .el-select-dropdown__item.selected{
    color:#009688
  }
  .el-popper{
    z-index: 99999 !important;
  }
</style>
