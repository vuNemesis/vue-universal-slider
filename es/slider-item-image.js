import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
var Component = {
  name: 'ui-slider-item-image',
  props: {
    item: String,
    height: Number,
    index: Number
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
    },
    classesImage: function classesImage() {
      return {
        class: [
          // this.loaded && 'hide'
        ]
      };
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$refs.image.onload = function () {
      // this.loaded = false
      // this.$nextTick(() => {
      _this.sliderRoot.addItem(_this.$el, _this.index);
      // })
    };
    // console.log('mounted:', this.index)
    // let img = new Image();
    // img.onload = () => {
    //     this.loaded = true
    //     this.$nextTick(() => {
    //       this.sliderRoot.addItem(this.$el, this.index)
    //     })
    // };
    // img.src = this.item
  },

  inject: {
    sliderRoot: { default: null }
  },
  render: function render(h) {
    return h(
      'div',
      { 'class': 'slider-item' },
      [h('img', _mergeJSXProps([{
        attrs: { src: this.item }
      }, this.styleItemImage, this.classesImage, { ref: 'image' }]))]
    );
  }
};

export default Component;