<template>
  <NodeBase
    hideFooter
    nodeName="欢迎您使用策略设定"
    customClass="user-guide" >
    <span slot="sub" class="">
      欢迎您使用微信通知消息策略
      此策略可实现微信和短信消息的路由。当您发送用户的手机号已绑定微信时，将会通过微信发送消息，否则将会通过短信发送。      </span>
    <p class="steps-start">
      以下有几个步骤需要您完成
    </p>
    <div class="steps-on" >
      <el-steps :space="90" direction="vertical" >
        <el-step
          status="wait"
          title="确定发送内容和场景" >
            <span slot="description">
              请确定您需要发送的消息内容和场景。由于微信模板消息的限制，只能发送通知类内容。
            </span>
          </el-step>
        <el-step
          status="wait"
          title="添加微信模板"
          description="在国内短信/模版管理中创建一个与微信模版相匹配的短信模版"
          >
            <span slot="description">
              在微信公众平台开通模板消息功能，并将符合您发送内容的的微信模板添加至模板列表。
              <span class="fr">
                <el-button type="text" size="small" @click="$refs.wh.show()">更多帮助</el-button>
              </span>
            </span>
          </el-step>
        <el-step
          status="wait"
          title="添加短信模板"
          description="在国内短信/模版管理中创建一个与微信模版相匹配的短信模版">
            <span slot="description">
              在云片用户后台-国内短信-签名/模板报备中，将您要发送的消息内容添加为短信模板。
              <a href="/console/#/domestic/register/template" target="_blank" class="fr">
                <el-button type="text" size="small">去添加</el-button>
              </a>
            </span>
          </el-step>
        <el-step
          status="wait"
          title="添加发送变量"
          description="点击“接口请求触发”节点，添加您发送内容中所要用到的变量。"></el-step>
        <el-step
          status="wait"
          title="配置微信模板消息"
          description="点击“发送微信模板消息”节点，选择需要发送的微信模板。并将您要发送的内容和变量填写到微信模板中。">
        </el-step>
        <el-step
          status="wait"
          title="选择短信模板"
          description="点击“发送短信”节点，选择你要发送的短信模板。">
        </el-step>
        <el-step
          status="wait"
          title="执行策略并对接API"
          description="点击“执行”使策略生效。并将生成的API URL 和示例代码交给开发人员，完成API对接。
然后您就能通过最佳的渠道向用户发送通知消息啦！">
        </el-step>
      </el-steps>
    </div>
    <footer>
      <span class="fr" @click="hidden">>&nbsp;知道了</span>
    </footer>
    <WxHelp ref="wh" />
  </NodeBase>
</template>

<script>
import nodeBaseMixin from '../nodeBaseMixin'
import NodeBase from '../NodeBase.vue'
import WxHelp from '../../dialogs/WxHelp.vue'
import {NODE_COLLECTION} from '../../data'

export default {
  mixins: [],
  name: '',
  components: {
    NodeBase,
    WxHelp
  },
  data () {
    return {
      isWechatGuideShow: false
    }
  },
  mounted () {

  },
  computed: {

  },
  methods: {
    hidden () {
      this.$emit('hide')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less" >
.user-guide {
  > .el-dialog__wrapper .el-dialog {
    width: 543px;
  }

  .fr {
    float: right;
  }
  .el-step__description {
    line-height: 1.6em;
  }
  .node-name {
    font-size: 18px;
    color: #00ABFB;
  }
  .node-name-sub {
    border: 0;
  }
  .steps-start {
    font-size: 14px;
    color: #4A4A4A;
    margin-bottom: 14px;
  }
  .steps-on {
    // height: 300px;

    .el-step__head.is-text.is-wait {
      border-color: #20a0ff;
      color: #20a0ff;
    }
    .el-step__description {
      width: 200px;
    }
  }
  footer {
    margin-top: 16px;
    .fr {
      color:#20a0ff;
      float: right;
    }
  }
}
</style>
