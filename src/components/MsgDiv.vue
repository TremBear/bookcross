<template>
  <el-dialog
    title="通知"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
    <div class="layui-form-item">

      <div>
        <h1>{{msgData.title}}</h1>
        <div>
          <a data-v-8e112b9e="" href="user_info.html" class="fly-link"><cite data-v-8e112b9e="">{{msgData.sendUserNickName}}</cite></a>
          <span data-v-8e112b9e>{{formatTime(msgData.sendTime)}}</span>
        </div>
        <div data-v-8e112b9e="" class="detail-body photos">{{msgData.content}}</div>
      </div>

    </div>

  </el-dialog>
</template>

<script>
  import { parseTime } from '@/utils/index'

  export  default {
    name: 'msgDiv',
    props: {
      dialogVisible:{
        type:Boolean,
        default: false
      },
      msgData:{
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    created() {

    },
    methods:{
      // 关闭举报窗口
      handleClose(){
        this.$emit('handleClose')
      },
      // 翻译日期
      formatTime(time) {
        if (time) {
          return this.parseTime(time)
        }
        return time
      }
    }
  }
</script>

<style >

  .el-select .el-input.is-focus .el-input__inner{
    border-color:#dcdfe6;
  }
  .el-select .el-input__inner:focus{
    border-color:#dcdfe6;
  }

  .detail-body {
    min-height: 100px;
  }
</style>
