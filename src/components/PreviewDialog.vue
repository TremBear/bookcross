<template>
  <el-dialog
    title="预览"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="handleClose">
    <div style="margin-top: 7px;">
      <div class="layui-row layui-col-space15" style="margin-left: 7%;">
        <!--<div class="fly-none">没有权限</div>-->
        <div class="layui-col-md8 content detail" style="width: 93%;">
          <div class="fly-panel detail-box">
            <h1>{{previewData.topicTitle}}</h1>
            <div class="fly-detail-info">
              <span class="layui-badge layui-bg-blue">{{lableDic(previewData.labelId)}}</span>
              <span v-if="previewData.topicType===3 || previewData.topicType===4" class="layui-badge layui-bg-red" >置顶</span>
              <span v-if="previewData.topicType===2 || previewData.topicType===4" class="layui-badge layui-bg-red" >精华</span>
            </div>
            <div class="detail-about">
              <a class="fly-avatar" href="user_info.html">
                <img :src="!previewData.userImagePath?'/static/cweg.jpg':previewData.userImagePath"  >
              </a>
              <div class="fly-detail-user">
                <a href="user_info.html" class="fly-link">
                  <cite>{{previewData.userNickname}}</cite>
                </a>
                <span>{{formatTime(previewData.modifyTime)}}</span>
              </div>
            </div>
            <div class="detail-body photos" v-html="previewData.topicContent"> </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>

</template>

<script>
import { mapGetters } from 'vuex'
import  store from '@/store'
export  default {
  name: 'PreviewDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    previewData:{
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters([
      'labelList'
    ]),
    labelList(){
      return store.getters.labelList
    }
  },
  data () {
    return {
      topicsItem:{}
    }
  },
  created() {
  },
  methods:{
    // 关闭举报窗口
    handleClose(){
       this.$emit('handleClose')
    },
    // 翻译数据标签字典
    lableDic(val){
      let lable = ''
      if(val) {
        this.labelList.map((item, index) => {
          if(item.id === val){
            lable= item.labelName
          }
        })
      }
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

<style>
  .el-select .el-input.is-focus .el-input__inner{
    border-color:#dcdfe6;
  }
  .el-select .el-input__inner:focus{
    border-color:#dcdfe6;
  }
</style>
