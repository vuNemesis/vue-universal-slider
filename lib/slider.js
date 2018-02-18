import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import './style.scss';
import SliderItemImage from './slider-item-image.jsx';
import SliderItem from './slider-item.jsx';
import SliderDots from './slider-dots.jsx';
// import { sumBy } from 'lodash'
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
        // return item.elm.nodeType === 1 && /\bslider-item\b/.test(item.elm.className);
        return item.componentOptions && item.componentOptions.tag === 'ui-slider-item';
      }).map(function (item) {
        return item.componentOptions.propsData.item;
      });
      this.countItems = this.itemsData.length;
    } else {
      this.itemsData = [].concat(babelHelpers.toConsumableArray(this.items.map(function (item) {
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
          this.itemsWidth = this.elements.reduce(function (previousValue, currentValue, index, array) {
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

      var next = [].concat(babelHelpers.toConsumableArray(this.elements)).reverse().find(function (ref) {
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
        this.left = -1 * item.offsetLeft;
      } else {
        this.left = this.sliderWidth - (item.offsetLeft + item.clientWidth);
        // let newLeft = this.sliderWidth - (item.offsetLeft + item.clientWidth)
        // this.left = newLeft <=0 ? newLeft : 0
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
    // if(this.slotItems) {
    //   console.log('RENDER slots: ', this.items)
    //   items = this.slotItems.map((item, index) => {
    //     return (
    //        <SliderItem item={item} key={index}  height={this.height}  index={index} on-created={this.addItem} draw/>
    //      )
    //   })
    // } else {
    //   console.log('RENDER items')
    //   items = this.currentItems.map((item, index) => {
    //     return (
    //       <SliderItem item={item.avatar} height={this.height} key={index}  index={index} on-created={this.addItem} draw/>
    //     )
    //   })
    // }

    // items = this.itemsData.map((item, index) => {
    //   return (
    //     <SliderItemImage item={item} height={this.height} key={index}  index={index} on-created={this.addItem}/>
    //   )
    // })
    var scopedFunc = this.$vnode.data.scopedSlots && this.$vnode.data.scopedSlots.default && this.$vnode.data.scopedSlots.default;
    items = this.itemsData.map(function (item, index) {
      return h(SliderItem, {
        attrs: { item: item, height: _this4.height, index: index, 'scoped-func': scopedFunc },
        key: index });
    });

    var dots = !this.dots ? null : this.isLoading ? null : h(SliderDots, null);

    var progress = !this.progressVisible ? null : this.isLoading ? null : h(
      'div',
      babelHelpers.defineProperty({ 'class': 'slider-progress' }, 'class', ['slider-progress', this.progressTop && 'top', this.progressBottom && 'bottom']),
      [h('div', _mergeJSXProps([{ 'class': 'slider-progress-bar' }, this.styleProgress]))]
    );

    var leftButton = h(
      'div',
      _mergeJSXProps([babelHelpers.defineProperty({ 'class': 'slider-button'
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
      [h('i', { 'class': 'ui big icon left circle arrow' })]
    );

    var rightButton = h(
      'div',
      _mergeJSXProps([babelHelpers.defineProperty({ 'class': 'slider-button'
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
      [h('i', { 'class': 'ui big icon right circle arrow' })]
    );
    // const test = (str) => { return 'HI!!!' + str}
    // const test = JSON.stringify(h)
    // const test = h.toString()
    // console.dir(h.toString())
    return h(
      'div',
      null,
      [h(
        'div',
        _mergeJSXProps([{ 'class': 'ui slider' }, this.styleSlider, {
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
            _mergeJSXProps([{ 'class': 'slider-items' }, this.styleContent]),
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

export default Component;
// {!this.loaded && <div class="slider-progress"><div class="slider-progress-bar" {...this.styleProgress}></div></div>}