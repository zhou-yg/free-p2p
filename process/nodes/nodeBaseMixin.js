import NodeBase from './NodeBase.vue';
import cloneDeep from 'lodash/cloneDeep';

export default function nodeBaseMixin (name, type, initData, beforeSet) {
  const d = initData();
  const keys = Object.keys(d).filter(key => key !== 'name');

  d.name = name;

  return {
    components: {
      NodeBase,
    },
    props: {
      formData: {
        type: Object,
        default: () => ({}),
      },
      nextLinks: Object, // 节点前后关系的链路
      id: [String, Number],
      disabledEdit: Boolean, // 是否是可编辑的状态
    },
    mounted () {
      this.$children[0].$off('submit', this.submit);
      this.$children[0].$on('submit', this.submit);

      this.$children[0].$off('delSubmit', this.delSubmit);
      this.$children[0].$on('delSubmit', this.delSubmit);

      if (this.disabledEdit) {
        this.$nextTick(() => {
          this.$el.style.paddingBottom = '18px';
          this.$el.querySelector('.base-footer').style.display = 'none';
          this.$el.querySelector('.node-container').style.maxHeight = '508px';
        });
      }
    },
    beforeDestroy () {
      this.$children[0].$off('submit', this.delSubmit);
      this.$children[0].$off('delSubmit', this.delSubmit);
    },
    data () {
      let _d = Object.assign({}, d, this.formData);

      _d = beforeSet ? beforeSet(cloneDeep(_d)) : _d;

      return {
        isShow: false,
        isVisible: true,
        ..._d,
      };
    },
    computed: {
    },
    methods: {
      moveDialogWrapper () {
        this.$nextTick(() => {
          let elClass = this.$el.className;
          let wrapper = this.$el.querySelector('.el-dialog__wrapper');
          let modal = this.$el.querySelector('.v-modal');

          if (wrapper) {
            document.body.appendChild(wrapper);
          }
          if (modal) {
            document.body.appendChild(modal);
          }
        });
      },
      delSubmit () {
        this.$emit('delSubmit');
      },
      submit (myNodeName) {
        if (this.beforeSubmit) {
          this.beforeSubmit();
        }
        if (this.transformSubmitData) {
          const d = this.transformSubmitData();
          d.name = myNodeName;
          this.$emit('submit', d);
          return;
        }

        const arg = keys.filter(k => this[k] !== undefined).map(k => {
          return {
            [k]: this[k],
          };
        }).reduce((pre, next) => {
          return Object.assign(pre, next);
        }, {});
        arg.name = myNodeName;

        this.$emit('submit', arg);
      },
    },
  };
}
