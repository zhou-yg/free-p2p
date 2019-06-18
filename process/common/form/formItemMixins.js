
export default function getFormItemMixins () {
  return {
    props: {
      name: String,
      label: String,
      value: Number
    },
    methods: {
      onInput (v) {
        if (this.beforeOnInput) {
          this.beforeOnInput()
        }
        this.$emit('input', v)
        if (this.afterOnInput) {
          this.afterOnInput()
        }
      }
    }
  }
}
