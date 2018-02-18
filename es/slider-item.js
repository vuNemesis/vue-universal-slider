import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
var Component = {
  name: 'ui-slider-item',
  props: {
    item: String,
    height: Number,
    index: Number,
    scopedFunc: Function
  },
  data: function data() {
    return {
      loaded: true
    };
  },

  computed: {
    styleItemImage: function styleItemImage() {
      return {
        style: {
          height: this.height + 'px'
        }
      };
    }
  },
  mounted: function mounted() {
    var _this = this;

    if (this.scopedFunc) {
      // this.$refs.image.elm.onload = () => {
      this.sliderRoot.addItem(this.$el, this.index);
      // }
    } else {
      this.$refs.image.onload = function () {
        _this.sliderRoot.addItem(_this.$el, _this.index);
      };
    }
  },

  inject: {
    sliderRoot: { default: null }
  },
  render: function render(h) {
    var img = this.scopedFunc && this.scopedFunc({ item: this.item });
    return h(
      'div',
      { 'class': 'slider-item', ref: 'item' },
      [img && img, !img && h('img', _mergeJSXProps([{
        attrs: { src: this.item }
      }, this.styleItemImage, this.classesImage, { ref: 'image' }]))]
    );
  }
};

export default Component;