export default {
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
        height: this.height + 'px'
        // width: this.sliderRoot.width + 'px'
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
    return h('div', { class: 'vu-slider__content-item', ref: 'item' }, [img && h(img), !img && h('img', { attrs: { src: this.item }, style: this.styleItemImage, ref: 'image' })]);
  }
};