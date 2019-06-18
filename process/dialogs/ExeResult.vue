<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    size="tiny"
    :modal-append-to-body="false"
    :custom-class="customClass" >
    <div class="exe-result-body">
      <span v-html="message" v-if="!isShowCode"></span>
      <div class="code-result" v-if="isShowCode">
        <header class="sub-title">
          请将API URL和示例代码交给您的开发人员。请求此URL即可触发策略。
          之后您可以在「接口请求触发」节点详情中找到。
        </header>
        <p class="example-flow-url">
          <el-input :value="transFlowUrl"/>
          <span
            v-clipboard:copy="transFlowUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onCopyError" >
            <el-button type="primary">复制</el-button>
          </span>
        </p>
        <p class="code">
          <pre>
            <code>$ curl -X POST -H 'Content-Type:application/json' -d '{
  "apikey": "",
  "mobile": "",
<template v-for="(v, ii) in variablesEdit">  "{{v}}": "" <template v-if="ii !== variablesEdit.length - 1">, <br/></template></template>
}' {{transFlowUrl}}</code>
          </pre>
        </p>
      </div>
    </div>
  </el-dialog>

</template>

<script>

const DEFAULT_KEY1 = 'apikey'
const DEFAULT_KEY2 = 'mobile'

export default {
  name: '',
  components: {

  },
  data () {
    return {
      dialogVisible: false,
      isOpenRobot: true,
      title: '',
      message: '',
      isSuccess: false,
      isShowCode: false
    }
  },
  mounted () {

  },
  computed: {
    customClass () {
      return 'exe-result ' + (this.isSuccess ? 'success' : 'fail')
    },
    transFlowUrl () {
      let nodes = this.$store.state.processOn.allNodes
      if (!nodes.length) {
        return ''
      }
      let v = nodes[0].formData.flowUrl.replace(/{flowId}/, this.$store.state.processOn.originFsm.sid)
      return v
    },
    variablesEdit () {
      let nodes = this.$store.state.processOn.allNodes
      if (!nodes.length) {
        return []
      }
      let v = nodes[0].formData.variables
      return v.filter(v => v !== DEFAULT_KEY1 && v !== DEFAULT_KEY2)
    }
  },
  methods: {
    show (t, m, isSuccess) {
      this.title = t
      this.message = m
      this.isSuccess = !!isSuccess
      this.dialogVisible = true
    },
    showCode () {
      this.title = '策略已经成功执行'
      this.isSuccess = true
      this.isShowCode = true
      this.dialogVisible = true
    },
    onCopy (e) {
      this.$message.success('复制成功')
    },
    onCopyError (e) {
      this.$message.error('复制失败')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less" >
.exe-result {
  &.el-dialog {
    width: 563px;
  }
  > .el-dialog__body {
    width: 523px;
  }
  .el-dialog__title {
    &:before {
      font-family: "iconfont" !important;
      margin-right: 16px;
      font-size: 24px;
      display: inline-block;
      color: #FAAD14;
      vertical-align: -5px;
    }
  }
  .exe-result-body{
    margin-left: 42px;
  }
}
.exe-result.success {
  .el-dialog__title {
    &:before {
      content: '\e78c';
      color: #42B138;
    }
  }
}
.exe-result.fail {
  .el-dialog__title {
    &:before {
      content: '\e6a2';
      color: #F94D4D;
    }
  }
}
.code-result {
  .sub-title {
    font-size: 14px;
    color: #4A4A4A;
    margin-bottom: 10px;
  }
  .example-flow-url {
    margin-bottom: 22px;
    display: flex;

    > .el-input {
      margin-right: 10px;
      vertical-align: middle;
    }
  }
  .code {
    background-color: #113174;
    border-radius: 4px;
    color: #fff;

    pre {
      box-sizing: border-box;
      width: 100%;
      margin: 0;
      padding: 0 16px;
      white-space: pre-wrap;
    }
    code {
      width: 100%;
      display: inline-block;
      word-break: break-all;
    }
  }
}
</style>
