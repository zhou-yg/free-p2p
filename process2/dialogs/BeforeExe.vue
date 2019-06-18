<template>
  <el-dialog
    title="您确定执行此策略吗？"
    :visible.sync="dialogVisible"
    size="tiny"
    :modal-append-to-body="false"
    custom-class="before-exe" >
    <div class="before-exe-body">
      <span>请确保微信消息模版和短信消息模版已有，所有的策略信息已经配置完成</span>
      <p class="robot-row" v-if="isShowRobotSwitch">
        <el-checkbox v-model="isOpenRobot">我们将为您开启机器人
        </el-checkbox>
      </p>
      <p>
        <br/>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </p>
    </div>
  </el-dialog>

</template>

<script>
export default {
  name: '',
  components: {

  },
  data () {
    return {
      dialogVisible: false,
      isOpenRobot: true,
      isShowRobotSwitch: false,
      isOpened: false
    }
  },
  mounted () {

  },
  computed: {

  },
  methods: {
    async show () {
      this.isShowRobotSwitch = false

      let { data: wxRet } = await this.back.flow.weChat.account.search()
      if (wxRet.code) {
        if (wxRet.code === 1) {
          this.$alert('需要先绑定微信服务号', '无法执行', {
            type: 'error'
          })
        }
        return
      }
      if (wxRet.data.records && wxRet.data.records.length === 0) {
        return this.$alert('未绑定微信服务号', '无法执行', {
          type: 'error'
        })
      }

      let robotRet = await this.backCaller(this.back.flow.robot.setting.get, {
        wxRobotStatus: 1
      })
      if (robotRet.code) {
        this.dialogVisible = true
        return
      }

      this.wxRobotId = robotRet.data ? robotRet.data.id : null
      this.isShowRobotSwitch = robotRet.data ? robotRet.data.wxRobotStatus === 0 : false
      this.isOpened = robotRet.data.wxRobotStatus === 1
      this.dialogVisible = true
    },
    _openDialog () {
      this.$nextTick(() => {
        let m = document.querySelector('.v-modal')
        if (m) {
          this.$el.appendChild(m)
        }
      })
    },
    submit () {
      this.dialogVisible = false
      this.$emit('submit', {
        wxRobotId: this.wxRobotId,
        isOpenRobot: this.isOpened // && this.isShowRobotSwitch
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less" >
.before-exe {
  .el-dialog__title {
    &:before {
      font-family: "iconfont" !important;
      margin-right: 16px;
      content: '\e602';
      font-size: 24px;
      display: inline-block;
      color: #FAAD14;
      vertical-align: -5px;
    }
  }
  .before-exe-body {
    margin-left: 42px;
  }
  .robot-row {
    margin: 16px 0;
  }
  .dialog-footer {
    float: right;
    margin-bottom: 16px;
  }
}
</style>
