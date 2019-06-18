<template>
  <NodeBase
    nodeName="设置短信模版消息"
    :hideFooter="disabledEdit"
    :disabledSubmit="disabledSubmit"
  >
    <span slot="sub" class="">
      将请求参数当作变量插入到短信模板中。我们会根据您接口传递的内容，填充短信内容后发送给您的用户。
    </span>
    <div class="template-box">
      <p class="select-sms-template">选择短信模版</p>
      <div class="el-form-box">
        <el-select
          :disabled="disabledEdit"
          v-model="templateForm.templateId"
          style="width: 100%"
          @change="selectTemplate"
          @visible-change="getTemplateList"
          class="template-select"
          popper-class="template-list-select"
        >
          <div v-loading="templateLoading">
            <el-option
              v-for="(item, index) in templateList"
              :label="item.content"
              :value="item.id"
              :key="index"
            >
            </el-option>
          </div>
        </el-select>
      </div>

      <p>
        没有合适的模版？
        <a class="to-add-template" href="/console/#/domestic/register/template" target="_blank">立马添加</a>
      </p>
    </div>

    <div class="template-content-box" v-if="curTemplate.content && curTemplate.content.length">
      {{curTemplate.content}}
    </div>

    <div class="template-error-alert" v-if="matchError">
      <p>{{errorMsg}}</p>
    </div>
  </NodeBase>
</template>

<script>
  import nodeBaseMixin from '../nodeBaseMixin'
  import NodeBase from '../NodeBase.vue'
  import {NODE_COLLECTION} from '../../data'

  export default {
    mixins: [nodeBaseMixin(() => ({
      name: NODE_COLLECTION.SendSmsMessage.name,
      type: NODE_COLLECTION.SendSmsMessage.type,
      ...NODE_COLLECTION.SendSmsMessage.data()
    }))],
    name: '',
    components: {
      NodeBase
    },
    data () {
      return {
        errorMsg: '',
        templateList: [],
        templateForm: {
          templateId: ''
        },
        curTemplate: {},
        replaceVar: {},
        errorVar: [],
        matchError: false, // 是否匹配失败
        templateLoading: false // 加载模版列表
      }
    },
    computed: {
      nodes () {
        return this.$store.state.processOn.allNodes || []
      },
      disabledSubmit () {
        return !!this.matchError || !this.templateForm.templateId
      }
    },
    mounted () {
      this.getData()
    },
    methods: {
      // 获取其他节点数据
      async getData () {
        let InitialState = {}
        let SmsState = {}
        this.nodes.forEach(item => {
          if (item.type === 'InitialState') {
            InitialState = {...item}
          }
          if (item.type === 'SendSmsMessage') {
            SmsState = {...item}
          }
        })
        const {variables} = InitialState.formData || []
        this.variables = [...variables]
        this.templateForm.templateId = this.yunpianTemplateId
        await this.getTemplateList(true)
        if (this.templateForm.templateId) {
          await this.selectTemplate(this.templateForm.templateId)
        }
      },
      async getTemplateList (val) {
        if (val) {
          let d = document.querySelector('.el-select-dropdown')
          if (d) {
            this.$el.appendChild(d)
          }
        }
        if (!val) {
          return
        }
        this.templateLoading = true
        const hash = {
          subAccountId: this.$store.state.processOn.originFsm.accountSid,
          checkStatus: 0
        }
        try {
          const ret = await this.backCaller(this.back.domestic.template.search, hash)
          this.templateList = [...ret.data.records]
        } catch (e) {
          console.error(e)
        } finally {
          this.templateLoading = false
        }
      },
      selectTemplate (templateId) {
        let curTemplate = this.templateList.filter((item) => item.id === templateId)[0]

        if (!curTemplate) {
          // this.templateForm.templateId = null
          // this.yunpianTemplateId = null
          return
        }
        this.curTemplate = this.templateList.filter((item) => item.id === templateId)[0] || {}
        const { content } = this.curTemplate || ''
        const paramRegex = /#[a-zA-Z0-9_]+#/mg
        this.curTemplate.variables = content.match(paramRegex) || []
        this.errorVar = []

        this.curTemplate.variables.forEach((item) => {
          const d = item.replace(/#/g, '')
          if (!this.variables.includes(d)) {
            this.errorVar.push(item)
          }
        })
        if (this.errorVar.length) {
          this.matchError = true
          this.errorMsg = this.errorVar.join(',')
          this.errorMsg += '变量名与接口触发节点的变量名不同，请选择匹配的模版或更改接口请求触发节点的变量名'
          return
        }
        this.matchError = false
      },
      beforeSubmit () {
        this.apikey = `#trigger.request.body.apikey#`
        this.body = String(this.curTemplate.content).replace(/#([a-zA-Z1-9]+?)#/g, (i, j) => `#trigger.request.body.${j}#`)
        this.yunpianTemplateId = this.curTemplate.id
        this.yunpianTemplateVariables = []
        this.curTemplate.variables.forEach(item => {
          const d = item.replace(/#/g, '')
          this.yunpianTemplateVariables.push({
            variableName: d,
            value: `#trigger.request.body.${d}#`
          })
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less">
  .select-sms-template {
    margin-top: 16px;
    color: rgba(155, 155, 155, 1);
    font-size: 14px;
    font-family: PingFangSC-Regular;
  }
  .el-form-box {
    margin: 10px 0;
  }

  .to-add-template {
    color: rgba(0, 171, 251, 1);
    font-size: 12px;
    font-family: PingFangSC-Regular;
  }

  .template-error-alert {
    margin-top: 17px;
    padding: 9px;
    border-radius: 4px;
    line-height: 22px;
    font-size: 14px;
    text-align: left;
    background-color: rgba(255, 241, 240, 1);
    border: 1px solid rgba(255, 163, 158, 1);
    display: flex;
  }

  .template-content-box {
    margin-top: 16px;
    padding: 10px;
    border-radius: 2px;
    background-color: rgba(245, 248, 250, 1);
  }

  .template-content-box::-webkit-scrollbar {
    display: none;
  }

  .template-select {
    width: 252px;
  }

  .template-list-select {
    width: 252px;

    .el-select-dropdown__item {
      white-space: normal;
      text-overflow: initial;
      height: inherit;
    }
  }
</style>
