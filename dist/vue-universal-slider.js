(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueUniversalSlider = factory());
}(this, (function () { 'use strict';

var nestRE = /^(attrs|props|on|nativeOn|class|style|hook)$/

var babelHelperVueJsxMergeProps$1 = function mergeJSXProps (objs) {
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

var Component$3 = {
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
      [img && img, !img && h('img', babelHelperVueJsxMergeProps$1([{
        attrs: { src: this.item }
      }, this.styleItemImage, this.classesImage, { ref: 'image' }]))]
    );
  }
};

var Component$4 = {
  name: 'ui-slider-dots',
  inject: ['sliderRoot'],
  data: function data() {
    return {
      slider: this.sliderRoot
    };
  },
  render: function render(h) {
    var _this = this;

    return h(
      'div',
      { 'class': 'slider-dots' },
      [this.slider.elements.map(function (item, index) {
        return item.offsetLeft + _this.slider.left + item.clientWidth / 3 >= 0 && item.offsetLeft + item.clientWidth - item.clientWidth / 3 <= _this.slider.sliderWidth + Math.abs(_this.slider.left) ? h('span', { 'class': 'dot red' }) : h('span', babelHelperVueJsxMergeProps$1([{ 'class': 'dot' }, {
          on: {
            'click': function click($event) {
              for (var _len = arguments.length, attrs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                attrs[_key - 1] = arguments[_key];
              }

              _this.slider.handleDot.bind(_this, index).apply(undefined, [$event].concat(attrs));
            }
          }
        }]));
      })]
    );
  }
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();













var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Component = {
  name: 'ui-slider',
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
    buttonsPosition: {
      type: String,
      default: ''
    },
    buttonsOutside: Boolean,
    wheel: Boolean,
    dots: Boolean,
    progressTop: Boolean,
    progressBottom: Boolean
  },
  data: function data() {
    return {
      countElements: 0,
      elements: [],
      itemsData: null,
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
  created: function created() {
    // if(this.$vnode.data.scopedSlots && this.$vnode.data.scopedSlots.default) console.dir(this.$vnode.data.scopedSlots.default({image: 'test'}))
    if (!this.items && this.$slots.default) {
      this.itemsData = this.$slots.default.filter(function (item) {
        return item.componentOptions && item.componentOptions.tag === 'ui-slider-item';
      }).map(function (item) {
        return item.componentOptions.propsData.item;
      });
      this.countItems = this.itemsData.length;
    } else {
      this.itemsData = [].concat(toConsumableArray(this.items.map(function (item) {
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

      var next = [].concat(toConsumableArray(this.elements)).reverse().find(function (ref) {
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
    progressVisible: function progressVisible() {
      return this.progressTop || this.progressBottom;
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
    styleSlider: function styleSlider() {
      var height = (this.buttonsPosition === 'bottom' || this.buttonsPosition === 'top') && this.buttonsOutside && (this.nextLeft || this.nextRight) ? this.height + 50 : this.height;
      return {
        style: {
          height: height + 'px',
          width: typeof this.width === 'number' ? this.width + 'px' : this.width,
          paddingBottom: this.buttonsPosition === 'bottom' && this.buttonsOutside && (this.nextLeft || this.nextRight) ? '50px' : 0,
          paddingTop: this.buttonsPosition === 'top' && this.buttonsOutside && (this.nextLeft || this.nextRight) ? '50px' : 0,
          paddingLeft: !this.buttonsPosition && this.buttonsOutside ? '50px' : 0,
          paddingRight: !this.buttonsPosition && this.buttonsOutside ? '50px' : 0
        }
      };
    },
    styleContent: function styleContent() {
      return {
        style: {
          left: this.left + 'px'
        }
      };
    },
    styleProgress: function styleProgress() {
      return {
        style: {
          width: this.progressPercent + '%'
        }
      };
    }
  },
  render: function render(h) {
    var _this4 = this;

    // const directives = [
    //   { name: 'my-dir', value: 123, modifiers: { abc: true } }
    // ]
    var items = void 0;
    var scopedFunc = this.$vnode.data.scopedSlots && this.$vnode.data.scopedSlots.default;
    items = this.itemsData.map(function (item, index) {
      return h(Component$3, {
        attrs: { item: item, height: _this4.height, index: index, 'scoped-func': scopedFunc },
        key: index });
    });

    var dots = !this.dots ? null : this.isLoading ? null : h(Component$4, null);

    var progress = !this.progressVisible ? null : this.isLoading ? null : h(
      'div',
      defineProperty({ 'class': 'slider-progress' }, 'class', ['slider-progress', this.progressTop && 'top', this.progressBottom && 'bottom']),
      [h('div', babelHelperVueJsxMergeProps$1([{ 'class': 'slider-progress-bar' }, this.styleProgress]))]
    );

    var leftButton = h(
      'div',
      babelHelperVueJsxMergeProps$1([defineProperty({ 'class': 'slider-button'
      }, 'class', ['slider-button', this.buttonsPosition === 'bottom' ? 'slider-button-bottom-left' : this.buttonsPosition === 'top' ? 'slider-button-top-left' : 'slider-button-left', !this.isLoading && this.visibleLeftButton && 'visible']), {
        on: {
          'click': function click($event) {
            for (var _len = arguments.length, attrs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              attrs[_key - 1] = arguments[_key];
            }

            _this4.handleLeft.apply(_this4, [$event].concat(attrs));
          }
        }
      }]),
      ['\u2039']
    );

    var rightButton = h(
      'div',
      babelHelperVueJsxMergeProps$1([defineProperty({ 'class': 'slider-button'
      }, 'class', ['slider-button', this.buttonsPosition === 'bottom' ? 'slider-button-bottom-right' : this.buttonsPosition === 'top' ? 'slider-button-top-right' : 'slider-button-right', !this.isLoading && this.visibleRightButton && 'visible']), {
        on: {
          'click': function click($event) {
            for (var _len2 = arguments.length, attrs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              attrs[_key2 - 1] = arguments[_key2];
            }

            _this4.handleRight.apply(_this4, [$event].concat(attrs));
          }
        }
      }]),
      ['\u203A']
    );

    return h(
      'div',
      null,
      [h(
        'div',
        babelHelperVueJsxMergeProps$1([{ 'class': 'ui slider' }, this.styleSlider, {
          on: {
            'wheel': function wheel($event) {
              for (var _len3 = arguments.length, attrs = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                attrs[_key3 - 1] = arguments[_key3];
              }

              _this4.handleScroll.apply(_this4, [$event].concat(attrs));
            }
          }
        }]),
        [h(
          'transition',
          {
            attrs: { name: 'fade' }
          },
          [progress]
        ), leftButton, rightButton, h(
          'div',
          { 'class': 'slider-content', ref: 'slider' },
          [h(
            'div',
            babelHelperVueJsxMergeProps$1([{ 'class': 'slider-items' }, this.styleContent]),
            [items]
          )]
        ), h(
          'transition',
          {
            attrs: { name: 'fade' }
          },
          [dots]
        )]
      )]
    );
  }
};

var VueUniversalSlider = {};

VueUniversalSlider.install = function (Vue) {
  Vue.component("ui-slider", Component);
  Vue.component("ui-slider-item", Component$3);
};

VueUniversalSlider.Slider = Component;
VueUniversalSlider.SliderItem = Component$3;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueUniversalSlider);
}

return VueUniversalSlider;

})));
//# sourceMappingURL=vue-universal-slider.js.map
