<template>
  <NodeBase
    nodeName="设置微信模版消息"
    customClass="wechat-msg"
    :hideFooter="disabledEdit"
    :disabledSubmit="disabledSubmit">
    <span slot="sub" class="">
    将请求参数当作变量插入到微信模板中。我们会根据您接口传递的内容，填充微信模版消息后发送给您的用户。
    </span>
    <div class="">
      <p class="node-title">
        选择微信模版
      </p>
      <div class="el-form-box">
        <el-form>
          <el-select
            :disabled="disabledEdit"
            v-model="wxTemplateId"
            style="width: 100%"
            @change="selectTemplate"
            @visible-change="selectVisible"
            class="template-select"
            popper-class="template-list-select"
          >
            <div v-loading="templateLoading">
              <el-option
                v-for="(item, index) in wxTempltes"
                :label="item.title"
                :value="item.templateId"
                :key="item.templateId"
              >
              </el-option>
            </div>
          </el-select>
        </el-form>
      </div>

      <p>
        <el-button type="text" @click="showWxTempHelp">没有合适的模版？</el-button>
      </p>
      <p v-if="isShowUnbindWx">
        <span>
          未绑定微信公众号，无法获取微信模板
          &nbsp;
          <a href="#/flow/setting/service" target="_blank">
            <el-button type="text" >去绑定</el-button>
          </a>
        </span>
      </p>


      <p class="wx-input-tip" v-if="!disabledEdit && wxTemplateId">
        <span class="tip">&#xe8e5;</span>
        直接输入#即可选择变量进行插入，总输入内容的长度不能超过200
      </p>
      <div class="wx-template-edit" v-if="!disabledEdit && wxTemplateId">
        <div class="rows-box" >
          <p class="row templates" v-for="(rArr, i) in wxTemplateRowsEdit">
            <template v-for="(v, j) in rArr">
              <span class="text" v-if="v.type === 'text'">{{v.value}}</span>
              <AutoCompleteTag
                 placeholder="请输入内容或插入变量"
                 :items="presetVariables"
                 v-if="v.type === 'var'" :defaultValue="v.variables" @input="(v) => autoOutput(v, i, j)" />
            </template>
          </p>
        </div>
        <p class="row-footer">
          <span class="fr">
            <el-button type="text" size="small" @click="isPreviewShow = true">预览模板</el-button>
          </span>
        </p>
      </div>
      <div class="content-box wx-template-edit" v-if="disabledEdit">
        <p class="row templates" v-for="(rArr, i) in wxTemplateRows">
          <template v-for="(v, j) in rArr">
            <span class="text" v-if="v.type === 'text'">{{v.value}}</span>
            <span class="text-v" v-if="v.type === 'var'">
              {{v.variables}}
            </span>
          </template>
        </p>
      </div>
      <!-- <AutoCompleteTag :items="['#cbd#', '#名字#', '#a测b试#']" defaultValue="哈哈哈" @input="autoOutput" /> -->
    </div>
    <WxHelp ref="wh" />

    <el-dialog
      title="预览模版"
      :visible.sync="isPreviewShow"
      :modal-append-to-body="false"
      size="tiny"
      custom-class="wechat-msg-preview-content">
      <div class="content-box">
        <p class="row templates" v-for="(rArr, i) in wxTemplateRows">
          <template v-for="(v, j) in rArr">
            <span class="text" v-if="v.type === 'text'">{{v.value}}</span>
            <span class="text-v" v-if="v.type === 'var'">
              {{v.variables}}
            </span>
          </template>
        </p>
      </div>
    </el-dialog>
  </NodeBase>
</template>

<script>
import nodeBaseMixin from '../nodeBaseMixin'
import NodeBase from '../NodeBase.vue'
import {NODE_COLLECTION} from '../../data'
import WxHelp from '../../dialogs/WxHelp.vue'
import AutoCompleteTag from '../../common/AutoCompleteTag.vue'

export default {
  mixins: [nodeBaseMixin(() => ({
    name: NODE_COLLECTION.SendWechatMessage.name,
    type: NODE_COLLECTION.SendWechatMessage.type,
    ...NODE_COLLECTION.SendWechatMessage.data()
  }))],
  name: '',
  components: {
    AutoCompleteTag,
    NodeBase,
    WxHelp
  },
  data () {
    return {
      wxTempltes: [],
      templateLoading: false,
      wxTemplate: '',
      wxTemplateRows: [],
      wxTemplateRowsEdit: [],
      isPreviewShow: false,
      isShowUnbindWx: false
    }
  },
  mounted () {
    this.getWeCahtTemp()
  },
  computed: {
    presetVariables () {
      let r = this.$store.state.processOn.allNodes
      .filter(obj => obj.type === NODE_COLLECTION.InitialState.type)[0]
      return r.formData.variables.filter(v => v !== 'apikey').map(v => `#${v}#`)
    },
    transWxTemplateVariables () {
      let r = this.wxTemplateVariables.map(obj => {
        return {
          [`{{${obj.variableName}.DATA}}`]: {
            ...obj,
            value: (obj.value || '').replace('trigger.request.body.', '').replace(/({{)|(}})/g, '#')
          }
        }
      }).reduce((pre, next) => ({...pre, ...next}), {})
      return r
    },
    disabledSubmit () {
      let i = 0
      this.wxTemplateRows.map(arr => {
        return arr.map(obj => {
          if (obj.type === 'var') {
            let transV = obj.variables.replace(/#([a-zA-Z1-9]+?)#/g, (i, j) => new Array(10).fill('#').join(''))
            console.log(transV)
            i += transV.length
          }
        })
      })

      return !this.wxTemplateId || i >= 200
    }
  },
  methods: {
    beforeSubmit () {
      let o = this.wxTemplateRows.map(arr => {
        return arr.map(obj => {
          if (obj.type === 'var') {
            let origin = obj.origin.replace(/({{)|(}})/g, '').replace(/\.DATA/, '')
            return {
              variableName: origin,
              value: String(obj.variables).replace(/#([a-zA-Z1-9]+?)#/g, (i, j) => `#trigger.request.body.${j}#`),
              color: obj.color
            }
          }
        }).filter(_ => _).reduce((p, n) => p.concat(n), [])
      }).reduce((p, n) => ([...p, ...n]), [])
      this.wxTemplateVariables = o
    },
    autoOutput (v, i, j) {
      this.wxTemplateRowsEdit[i][j].variables = v
    },
    selectTemplate (id) {
      let targetWxTemplate = this.wxTempltes.filter(o => o.templateId === id)[0]
      if (!targetWxTemplate) {
        this.wxTemplateId = null
        return
      }
      this.wxTemplate = targetWxTemplate.content
      let rows = this.wxTemplate.split('\n')
      rows = rows.map(row => {
        if (!row) {
          return [{
            type: 'br'
          }]
        }
        let vars = row.match(/\{\{[\w.]+\}\}/g)
        if (vars) {
          let result = []

          vars.forEach(v => {
            let i = row.indexOf(v)
            let piece = row.substring(0, i)
            row = row.substr(i + v.length)
            result.push({
              type: 'text',
              value: piece
            })
            result.push({
              type: 'var',
              origin: v,
              variables: this.transWxTemplateVariables[v] ? this.transWxTemplateVariables[v].value : '',
              color: this.transWxTemplateVariables[v] ? this.transWxTemplateVariables[v].color : ''
            })
          })
          result.push(row)
          return result.filter(_ => _ && (_.value || (_.variables || _.variables === '')))
        } else {
          return [row]
        }
      })

      this.wxTemplateRows = rows
      this.wxTemplateRowsEdit = rows.filter(arr => !(arr[0] && arr[0].type === 'br'))
    },
    selectVisible (val) {
      if (val) {
        let d = document.querySelector('.el-select-dropdown')
        if (d) {
          this.$el.appendChild(d)
        }
      }
      this.getWeCahtTemp()
    },
    showWxTempHelp () {
      this.$refs.wh.show()
    },
    async getWeCahtTemp () {
      this.templateLoading = true
      const ret = await this.backCaller(this.back.flow.weChat.account.search, {})
      if (ret.code) {
        if (ret.code === 1) {
          this.isShowUnbindWx = true
        }
        if (this.wxTemplateId) {
          this.selectTemplate(this.wxTemplateId)
        }
        return
      }
      if (ret.data.records.length > 0) {
        this.wxAccountId = ret.data.records[0].id
        const ret2 = await this.backCaller(this.back.flow.weChat.template.search, {
          wxAccountId: this.wxAccountId
        })
        this.wxTempltes = ret2.data.records
        this.templateLoading = false

        if (this.wxTemplateId) {
          this.selectTemplate(this.wxTemplateId)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less"  scoped>
.wechat-msg {

}
.node-title {
    color: rgba(155, 155, 155, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
}
.el-form-box {
  margin: 10px 0;
}
.wechat-msg-preview-content {
  > .el-dialog__wrapper > .el-dialog__body {
    width: 448px;
  }
  .content-box {
    width: 323px;
  }
}
.content-box {
  padding: 19px 18px;
  border: 1px solid #D1D1D1;
  margin: 10px auto;
  font-size: 14px;
  color: #4A4A4A;
  .row {
    margin-bottom: 0;
    line-height: 22px;
    .text {
      line-height: 22px;
    }
    .text-v {
      flex: 1;
      line-height: 22px;
      display: inline-block;
    }
  }
}
.wx-input-tip {
  font-size: 12px;
  color: #4A4A4A;
  margin: 16px 0 8px;

  > .tip {
    font-family: 'iconfont';
    font-size: 16px;
    vertical-align: -1px;
  }
}
.wx-template-edit {
  background-color: #F5F8FA;
  padding: 10px;
  font-size: 12px;
  color: #4A4A4A;
  .row-footer {
    overflow: hidden;
    .fr {
      float: right;
    }
  }
}
.rows-box {
}
.row {
  display: flex;
  margin-bottom: 19px;
  line-height: 30px;

  &:last-child {
    margin-bottom: 0;
  }
  &.templates {
    display: flex;
  }
  .text {
    line-height: 30px;
  }
  .auto-complete-tag {
    flex: 1;
  }
}
</style>
