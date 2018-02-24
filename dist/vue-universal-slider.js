(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueUniversalSlider = factory());
}(this, (function () { 'use strict';

var nestRE = /^(attrs|props|on|nativeOn|class|style|hook)$/

var babelHelperVueJsxMergeProps = function mergeJSXProps (objs) {
  return objs.reduce(function (a, b) {
    var aa, bb, key, nestedKey, temp
    for (key in b) {
      aa = a[key]
      bb = b[key]
      if (aa && nestRE.test(key)) {
        // normalize class
        if (key === 'class') {
          if (typeof aa === 'string') {
            temp = aa
            a[key] = aa = {}
            aa[temp] = true
          }
          if (typeof bb === 'string') {
            temp = bb
            b[key] = bb = {}
            bb[temp] = true
          }
        }
        if (key === 'on' || key === 'nativeOn' || key === 'hook') {
          // merge functions
          for (nestedKey in bb) {
            aa[nestedKey] = mergeFn(aa[nestedKey], bb[nestedKey])
          }
        } else if (Array.isArray(aa)) {
          a[key] = aa.concat(bb)
        } else if (Array.isArray(bb)) {
          a[key] = [aa].concat(bb)
        } else {
          for (nestedKey in bb) {
            aa[nestedKey] = bb[nestedKey]
          }
        }
      } else {
        a[key] = b[key]
      }
    }
    return a
  }, {})
}

function mergeFn (a, b) {
  return function () {
    a && a.apply(this, arguments)
    b && b.apply(this, arguments)
  }
}

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
      [h('img', babelHelperVueJsxMergeProps([{
        attrs: { src: this.item }
      }, this.styleItemImage, this.classesImage, { ref: 'image' }]))]
    );
  }
};

var SliderItem = {
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

var SliderDots = {
  name: 'ui-slider-dots',
  functional: true,
  inject: {
    sliderRoot: { default: null }
  },
  render: function render(h, _ref) {
    var _this = this;

    var injections = _ref.injections;
    var sliderRoot = injections.sliderRoot;

    return h('div', { class: 'vu-slider__dots', style: sliderRoot.styleDots }, [sliderRoot.elements.map(function (item, index) {
      return item.offsetLeft + sliderRoot.left + item.clientWidth / 3 >= 0 && item.offsetLeft + item.clientWidth - item.clientWidth / 3 <= sliderRoot.sliderWidth + Math.abs(sliderRoot.left) ? h('span', { class: 'vu-slider__dot vu-slider__dot_active' }) : h('span', { class: 'vu-slider__dot', on: { click: sliderRoot.handleDot.bind(_this, index) } });
    })]);
  }
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Slider = {
  name: 'ui-slider',
  components: { SliderDots: SliderDots, SliderItem: SliderItem, SliderItemImage: Component },
  props: {
    items: Array,
    height: {
      type: Number,
      default: 100
    },
    width: {
      type: [Number, String],
      default: '100%'
    },
    buttonsOutside: Boolean,
    wheel: Boolean,
    dots: {
      type: String,
      default: '',
      validator: function validator(val) {
        return !val || val.match(/^(top|bottom)$/);
      }
    },
    dotsInside: {
      type: Boolean,
      default: false
    },
    progress: {
      type: String,
      default: '',
      validator: function validator(val) {
        return !val || val.match(/^(top|bottom)$/);
      }
    }
  },
  data: function data() {
    return {
      countItems: 0,
      itemsData: [],
      elements: [],
      cols: 7,
      step: 1,
      left: 0,
      loopTimer: null,
      isLoading: true,
      sliderWidth: 0,
      itemsWidth: 0
    };
  },
  provide: function provide() {
    return {
      sliderRoot: this
    };
  },
  mounted: function mounted() {
    // if(this.$vnode.data.scopedSlots && this.$vnode.data.scopedSlots.default) console.dir(this.$vnode.data.scopedSlots.default({image: 'test'}))
    if (!this.items && this.$slots.default) {
      this.itemsData = this.$slots.default.filter(function (item) {
        return item.componentOptions && item.componentOptions.tag === 'ui-slider-item';
      }).map(function (item) {
        return item.componentOptions.propsData.item;
      });
      this.countItems = this.itemsData.length;
    } else {
      this.itemsData = [].concat(_toConsumableArray(this.items.map(function (item) {
        return item;
      })));
      this.countItems = this.itemsData.length;
    }
  },

  methods: {
    addItem: function addItem(el, index) {
      var _this = this;

      this.$set(this.elements, index, el);
      if (this.countItems) {
        if (this.countItems === this.elements.length && this.elements.every(function (el) {
          return !!el;
        })) {
          this.sliderWidth = this.$refs.slider.clientWidth;
          this.itemsWidth = this.elements.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.clientWidth;
          }, 0);
          this.$nextTick(function () {
            _this.isLoading = false;
          });
        }
      }
    },
    handleLeft: function handleLeft() {
      var _this2 = this;

      var next = [].concat(_toConsumableArray(this.elements)).reverse().find(function (ref) {
        return ref.offsetLeft + ref.clientWidth / 2 <= Math.abs(_this2.left);
      });
      var x = next ? Math.abs(next.offsetLeft + this.left) : null;
      if (x) this.left = this.left + x;
    },
    handleRight: function handleRight() {
      var _this3 = this;

      var next = this.elements.find(function (ref) {
        return ref.offsetLeft + ref.clientWidth / 2 >= Math.abs(_this3.left - _this3.sliderWidth);
      });
      var x = next ? next.offsetLeft + next.clientWidth - this.sliderWidth + this.left : null;
      if (x) this.left = this.left - x;
    },
    handleDot: function handleDot(index) {
      var item = this.elements[index];
      if (item.offsetLeft < Math.abs(this.left)) {
        this.left = -item.offsetLeft;
      } else {
        this.left = this.sliderWidth - (item.offsetLeft + item.clientWidth);
      }
    },
    handleScroll: function handleScroll(e) {
      if (!this.wheel) return;
      e.preventDefault();
      if (e.wheelDelta < 0) {
        this.handleRight();
      } else {
        this.handleLeft();
      }
    }
  },
  computed: {
    widthSlider: function widthSlider() {
      return typeof this.width === 'number' ? this.width + 'px' : this.width;
    },
    progressPercent: function progressPercent() {
      return Math.round((this.sliderWidth + Math.abs(this.left)) * 100 / this.itemsWidth);
    },
    visibleLeftButton: function visibleLeftButton() {
      return this.left < 0;
    },
    visibleRightButton: function visibleRightButton() {
      return Math.abs(this.left) + this.sliderWidth < this.itemsWidth;
    },
    styleContent: function styleContent() {
      return {
        height: this.height + 'px',
        width: this.widthSlider
      };
    },
    styleContentItems: function styleContentItems() {
      return {
        left: this.left + 'px'
      };
    },
    styleContentWrapper: function styleContentWrapper() {
      return {
        margin: this.buttonsOutside ? '0 50px' : null
      };
    },
    styleProgress: function styleProgress() {
      return {
        width: this.progressPercent + '%'
      };
    },
    styleDots: function styleDots() {
      return {
        position: this.dotsInside ? 'absolute' : 'relative',
        top: this.dots === 'top' ? 0 : null,
        bottom: this.dots === 'bottom' ? 0 : null
      };
    }
  },
  render: function render(h) {
    var _this4 = this;

    // const directives = [
    //   { name: 'my-dir', value: 123, modifiers: { abc: true } }
    // ]
    var scopedFunc = this.$vnode.data.scopedSlots && this.$vnode.data.scopedSlots.default;
    var items = this.itemsData.map(function (item, index) {
      return h(SliderItem, {
        props: {
          item: item,
          height: _this4.height,
          index: index,
          scopedFunc: scopedFunc
        },
        key: index
      });
    });

    var dots = !this.dots || this.isLoading ? null : h(SliderDots);

    var progress = !this.progress || this.isLoading ? null : this.progress === 'top' || this.progress === 'bottom' ? h('div', { class: ['vu-slider__progress'] }, [h('div', { class: "vu-slider__progress-bar", style: this.styleProgress })]) : null;

    var leftArrowIcon = h('svg', {
      attrs: {
        width: '16px',
        height: '30px',
        viewBox: '0 0 16 30',
        xmlSpace: 'preserve'
      }
    }, [h('polyline', {
      attrs: {
        points: '16,30 0,15 16,0'
      },
      style: {
        fill: 'none',
        stroke: !this.buttonsOutside ? '#FFFFFF' : this.visibleLeftButton ? '#000000' : 'lightgrey',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }
    })]);

    var rightArrowIcon = h('svg', {
      attrs: {
        width: '16px',
        height: '30px',
        viewBox: '0 0 16 30',
        xmlSpace: 'preserve'
      }
    }, [h('polyline', {
      attrs: {
        points: '0,30 16,15 0,0'
      },
      style: {
        fill: 'none',
        stroke: !this.buttonsOutside ? '#FFFFFF' : this.visibleRightButton ? '#000000' : 'lightgrey',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }
    })]);

    var leftButton = h('div', { class: ['vu-slider__button', 'vu-slider__button_left', this.buttonsOutside && 'vu-slider__button_outside', !this.visibleLeftButton && 'vu-slider__button_disabled', !this.isLoading && this.visibleLeftButton && 'vu-slider__button_visible'], on: { click: this.handleLeft } }, [h('div', { class: "arrow left" }, [leftArrowIcon])]);

    var rightButton = h('div', { class: ['vu-slider__button', 'vu-slider__button_right', this.buttonsOutside && 'vu-slider__button_outside', !this.visibleRightButton && 'vu-slider__button_disabled', !this.isLoading && this.visibleRightButton && 'vu-slider__button_visible'], on: { click: this.handleRight } }, [h('div', { class: "arrow left" }, [rightArrowIcon])]);

    var content = h('div', { class: "vu-slider__content", style: this.styleContent }, [leftButton, rightButton, (this.dots === 'top' || this.dots === 'bottom') && this.dotsInside && dots, h('div', { class: 'vu-slider__content-wrapper', style: this.styleContentWrapper, ref: "slider" }, [h('div', { class: "vu-slider__content-items", style: this.styleContentItems }, [items])])]);

    return h('div', {
      class: "vu-slider", style: { width: this.widthSlider }, on: { wheel: this.handleScroll }
    }, [this.dots === 'top' && !this.dotsInside && dots, this.progress === 'top' && progress, content, this.progress === 'bottom' && progress, this.dots === 'bottom' && !this.dotsInside && dots]);
  }
};

var VueUniversalSlider = {};

VueUniversalSlider.install = function (Vue) {
  Vue.component("vu-slider", Slider);
  Vue.component("vu-slider-item", SliderItem);
};

VueUniversalSlider.Slider = Slider;
VueUniversalSlider.SliderItem = SliderItem;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueUniversalSlider);
}

return VueUniversalSlider;

})));
//# sourceMappingURL=vue-universal-slider.js.map
