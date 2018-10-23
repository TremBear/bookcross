<template>
  <el-dialog
    :title="replyTitle"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
    <div class="layui-form-item">
      <label class="layui-form-label">类型</label>
      <div class="layui-input-block">
        <el-select v-model="seleValue" placeholder="请选择">
          <el-option
            v-for="item in selectOptions"
            :key="item.id"
            :label="item.dicItemName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="layui-form-item layui-form-text">
      <label class="layui-form-label">理由</label>
      <div class="layui-input-block">
        <textarea v-model="reportMsg" required lay-verify="required" placeholder="请输入举报理由" class="layui-textarea" oninput="if(value.length > 110)value = value.slice(0, 110)" />
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-input-block">
        <button class="layui-btn" @click="handleSubmit">立即提交</button>
        <button type="reset" class="layui-btn layui-btn-primary" @click="handleClose" >取消</button>
      </div>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'ReportMsgDiv',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    replyTitle: {
      type: String,
      default: ''
    },
    replyData: {
      type: Object,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      selectOptions: [],
      seleValue: 1,
      reportMsg: ''
    }
  },
  mounted() {
    const that= this
    this.$nextTick(function(){
      that.handleReport()
    })
  },
  methods:{
    // 关闭举报窗口
    handleClose(){
      this.reportMsg = ''
      this.$emit('handleClose')
    },
    // 下拉框的值
    handleInput(data){
      this.seleValue = data
    },
    // 提交举报内容
    handleSubmit(){
      this.replyData.reportTypes = this.seleValue
      this.replyData.reportReson =this.reportMsg
      this.$emit('handleSubmit',this.replyData)
      this.seleValue = ''
      this.reportMsg = ''
    },
    // 加载举报类型
    handleReport(){
      this.$store.dispatch('Get', { url: '/bbsadmin/reprotManager/allReportTypes'}).then(res => {
        if (res.restCode === '0000') {
          if(res.data.length > 0){
            this.selectOptions = res.data
            this.seleValue = res.data[0].id
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style >
  .el-dialog__header {
    padding: 9px 20px 2px;
    background: #eee;
  }
  .el-dialog__headerbtn{
    top: 11px;
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
</style>
