<template>
  <el-dialog
    title="微信消息模板添加引导"
    :visible.sync="isWechatGuideShow"
    :modal-append-to-body="false" >
    <div class="wechat-template-steps">
      <ul>
        <li>
          1、进入
          <a href="https://mp.weixin.qq.com" target="_blank">
            <el-button type="text">微信公众平台</el-button>
          </a>后台
        </li>
        <li>
          2、在“功能“->”添加功能插件“处申请模板消息功能
        </li>
        <li>
          3、在微信后台添加模板
          <ul>
            <li>
              a、从左侧栏进入"模板消息"-"模板库"，选择相关性较高的模板(推荐)，点详情，点击“添加模板”
            </li>
            <li>
              b、如果没有相关性较高的模板，则新建模板(微信审核时间7~15天)
            </li>
          </ul>
        </li>
      </ul>
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
      isWechatGuideShow: false
    }
  },
  mounted () {

  },
  computed: {

  },
  methods: {
    show () {
      this.isWechatGuideShow = true
    },
    hide () {
      this.isWechatGuideShow = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less" >
.wechat-template-steps {
  ul {
    li {
      color: #4A4A4A;
      font-size: 14px;
      line-height: 2em;

      ul {
        padding-left: 1em;
      }
    }
  }
}
</style>
