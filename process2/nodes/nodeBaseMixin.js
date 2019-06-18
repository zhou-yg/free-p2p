export default function nodeBaseMixin (initData, beforeSet) {
  const d = initData()
  const keys = Object.keys(d)

  return {
    props: {
      formData: {
        type: Object,
        default: () => ({})
      },
      disabledEdit: Boolean
    },
    mounted () {
      this.$children[0].$off('submit', this.submit)
      this.$children[0].$on('submit', this.submit)
    },
    beforeDestroy () {
      this.$children[0].$off('submit', this.submit)
    },
    data () {
      let _d = Object.assign({}, d, this.formData)

      _d = beforeSet ? beforeSet(_d) : _d

      return {
        isShow: false,
        isVisible: true,
        ..._d
      }
    },
    computed: {
    },
    methods: {
      submit () {
        if (this.beforeSubmit) {
          this.beforeSubmit()
        }
        const arg = keys.filter(k => this[k] !== undefined).map(k => {
          return {
            [k]: this[k]
          }
        }).reduce((pre, next) => {
          return Object.assign(pre, next)
        }, {})
        this.$emit('submit', arg)
      }
    }
  }
}
