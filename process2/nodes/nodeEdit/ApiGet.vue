<template>
  <NodeBase
    :nodeName="name"
    :disabledSubmit="disabledSubmit"
    :hideFooter="disabledEdit"
    customClass="api-get">
    <span slot="sub" class="">
      策略发布后系统会自动生成一个API url。请在下面添加参数。可作为后续流程中的变量使用。
    </span>
    <div class="api-url row" v-if="disabledEdit" >
      <header>
        触发的URL
      </header>
      <el-input :value="transFlowUrl"/>
      <div class="op">
        <span
          v-clipboard:copy="transFlowUrl"
          v-clipboard:success="onCopy"
          v-clipboard:error="onCopyError" >
          <el-tag type="primary">复制</el-tag>
        </span>
        <el-button type="text" size="small" @click="exampleCodeVisible = true">查看示例代码</el-button>
      </div>
    </div>
    <div class="variables-show" v-if="disabledEdit" >
      <header>
        变量
      </header>
      <el-tag type="primary" :key="v" v-for="v in variablesEditTransed">#{{v}}#</el-tag>
    </div>
    <div class="row" v-if="!disabledEdit">
      <header>
        添加变量 <br/>
        <span class="sub">
          请填写变量名(可包含英文数字)，如：name1
        </span>
      </header>
      <ul class="arg-list">
        <li v-for="(arg, i) in variablesEditTransed" class="new-arg">
          <p class="input-one">
            <InputTip
              :maxLen="30"
              placeholder="输入变量名"
              :key="arg" :value="arg" @blur="(e) => changeArg(e, i)"></InputTip>
            <span class="arg-op">
              <span class="del" @click="delArg(i)">-</span>
            </span>
          </p>
          <p class="error">{{checkVar(arg)}}</p>
        </li>
      </ul>
      <footer v-if="!disabledEdit">
        <span @click="newArg" v-if="variablesEdit.length < 10">
          <el-tag type="primary" >添加</el-tag>
        </span>
        <span class="sub">
          一共可输入10个
        </span>
      </footer>
    </div>
    <el-dialog
      title="查看示例代码"
      :visible.sync="exampleCodeVisible"
      :modal-append-to-body="false" >
      <div class="example-code">
        <p class="sub-title">请求下面的URL即可触发此流程</p>
        <p class="example-flow-url">
          <el-input :value="transFlowUrl"/>
          <span
            v-clipboard:copy="transFlowUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onCopyError" >
            <el-tag type="primary">复制</el-tag>
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
    </el-dialog>
  </NodeBase>
</template>

<script>
import nodeBaseMixin from '../nodeBaseMixin'
import NodeBase from '../NodeBase.vue'
import {NODE_COLLECTION} from '../../data'
import InputTip from '../../common/InputTip.vue'

const DEFAULT_KEY1 = 'apikey'
const DEFAULT_KEY2 = 'mobile'

export default {
  mixins: [nodeBaseMixin(() => ({
    name: NODE_COLLECTION.InitialState.name,
    type: NODE_COLLECTION.InitialState.type,
    ...NODE_COLLECTION.InitialState.data()
  }), (obj) => {
    obj.variablesEdit = obj.variables.filter(v => v !== DEFAULT_KEY1 && v !== DEFAULT_KEY2)
    return obj
  })],
  name: '',
  props: {
  },
  components: {
    NodeBase,
    InputTip
  },
  data () {
    return {
      exampleCodeVisible: false
    }
  },
  mounted () {
  },
  computed: {
    variablesEditTransed () {
      return this.variablesEdit
    },
    transFlowUrl () {
      return this.flowUrl.replace(/{flowId}/, this.$store.state.processOn.originFsm.sid)
    },
    disabledSubmit () {
      return this.variablesEditTransed.some(v => !!this.checkVar(v))
    }
  },
  methods: {
    checkVar (v) {
      let reg = [
        /^[a-zA-Z1-9]+$/,
        /^([a-z]|[A-Z])/
      ]
      if (!v || reg.every(r => r.test(v))) {
        return ''
      } else {
        return '变量名仅支持纯英文，数字，不能以数字为开头'
      }
    },
    beforeSubmit () {
      this.variables = [DEFAULT_KEY1, DEFAULT_KEY2].concat(this.variablesEdit).filter(_ => _)
    },
    onCopy (e) {
      this.$message.success('复制成功')
    },
    onCopyError (e) {
      this.$message.error('复制失败')
    },
    changeArg (e, index) {
      this.variablesEdit[index] = String(e.target.value).substr(0, 30)
      this.variablesEdit = this.variablesEdit.slice()
    },
    newArg () {
      this.variablesEdit = this.variablesEdit.concat('')
      this.$nextTick(() => {
        let base = this.$el
        if (base) {
          base.scrollTo(0, 3000)
        }
      })
    },
    delArg (i) {
      this.variablesEdit = this.variablesEdit.filter((_, ii) => ii !== i)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less"  >
.api-get {
  height: 100%;
  > .el-dialog__wrapper .el-dialog {
    width: 563px;
  }
  .example-code {
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
  .variables-show {
    margin-top: 16px;
    > header{
      margin: 12px 0;
    }
    .el-tag {
      margin: 0 6px 6px 0 ;
    }
  }
  .row {
    > header {
      color: #9B9B9B;
      font-size: 14px;
      margin-bottom: 8px;

      .sub {
        margin-top: 8px;
        display: inline-block;
      }
    }
    .el-tag {
      cursor: default;
    }
    .op {
      margin: 8px 0;
    }
    .sub {
      color: #9B9B9B;
      font-size: 12px;
    }
    .arg-list {
      color: #4A4A4A;
      font-size: 12px;
      > li {
        margin-top: 6px;

        &.new-arg {
          margin: 16px 0;
          .error {
            color: red;
            font-size: 12px;
          }
        }
        .input-one {
          display: flex;
        }

        .pre {
          width: 4em;
          display: inline-block;
        }
        .arg-op {
          min-width: 36px;
          line-height: 30px;
          height: 30px;
          text-align: center;
          .del {
            box-sizing: border-box;
            border: 1px solid #00ABFB;
            border-radius: 50%;
            color: #00ABFB;
            width: 17px;
            height: 17px;
            line-height: 13px;
            display: inline-block;
            cursor: default;
            user-select: none;
          }
        }
      }
    }
    .footer {
      margin-bottom: 10px;
    }
  }
}
</style>
