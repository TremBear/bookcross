<template>
  <div style="border: 1px solid #dcdfe6;">
    <div id="editor" style="text-align:left;"/>
    <div v-if="replyConent" v-html="replyConent"/>
    <div id="editor1" style="text-align:left;height: 200px; ">
      <span v-html="content"/>
    </div>
  </div>

</template>

<script>
import E from 'wangeditor'
export default {
  name: 'Wangeditor',
  props: {
    menus: {
      type: Array,
      default: function() {
        return []
      }
    },
    content: {
      type: String,
      default: ''
    },
    replyConent: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: '',
      wangEditor: Object
    }
  },
  mounted() {
    this.wangEditor = new E('#editor', '#editor1')
    this.wangEditor.customConfig.onchange = (html) => {
      this.editor = html
      this.$emit('handleEditor', this.editor)
    }
    this.wangEditor.customConfig.emotions = this.global.emotions
    this.wangEditor.customConfig.menus = this.menus
    this.wangEditor.customConfig.showLinkImg = false
    this.wangEditor.customConfig.uploadFileName = 'file'
    this.wangEditor.customConfig.uploadImgServer = process.env.BASE_API + '/bbscommon/udfs/upload'
    this.wangEditor.customConfig.uploadImgHooks = {
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function(insertImg, result, editor) {
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果：
        if (result.restCode === '0000') {
          insertImg(result.data)
        }
      }
    }
    this.wangEditor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024
    this.wangEditor.create()
  },
  methods: {
    handleClearEditor() {
      this.wangEditor.txt.clear()
    }
  }
}
</script>

<style >
  .toolbar {
    /* background-color: #f1f1f1; */
    border: 1px solid #ccc;
  }
  .w-e-menu{
    z-index: 2 !important;
  }
  .w-e-text-container{
    z-index: 1 !important;
  }
</style>
