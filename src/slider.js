import './style.scss'
import SliderItemImage from './slider-item-image.jsx'
import SliderItem from './slider-item.js'
import SliderDots from './slider-dots.js'
import SliderProgress from './slider-progress.js'
import Resize from './resize/resize.vue'
import { isEmpty } from 'lodash'

export default {
  name: 'ui-slider',
  components: { SliderDots, SliderItem, SliderItemImage, SliderProgress, Resize },
  props: {
    items: Array,
    height: {
      type: [Number, String],
      default: 200
    },
    width: {
      type: [Number, String],
      default: '100%'
    },
    buttonsOutside: Boolean,
    wheel: Boolean,
    wheelReverse: Boolean,
    dots: {
      type: String,
      default: '',
      validator: val => !val || /^(top|bottom|top-right|top-left|bottom-right|bottom-left)$/.test(val)
    },
    dotsInside: {
      type: Boolean,
      default: false
    },
    progress: {
      type: String,
      default: '',
      validator: val => !val || /^(top|bottom)$/.test(val)
    },
    progressBgColor: {
      type: String,
      default: 'transparent'
    },
    progressColor: {
      type: String,
      default: 'lightgrey'
    },
    dotActiveColor: String,
    dotColor: String
  },
  data() {
    return {
      countItems: 0,
      itemsData: [],
      elements: [],
      tempElements: [],
      left: 0,
      isLoading: true,
      sliderWidth: 0,
      sliderHeight: 0,
      itemsWidth: 0,
      scopedElements: null,
      showNavigation: false,
      transition: 'all 2s',
      emptyElement: {
        clientWidth: -1, 
        offsetLeft: -1
      }
    }
  },
   provide() {
    return {
      sliderRoot: this
    }
  },
  beforeMount() {
    // const scopedFunc = this.$vnode.data.scopedSlots && this.$vnode.data.scopedSlots.default
    // if(scopedFunc) {
    //   this.scopedFunc = scopedFunc
    // }
    // if(this.$vnode.data.scopedSlots && this.$vnode.data.scopedSlots.default) console.dir(this.$vnode.data.scopedSlots.default({image: 'test'}))
    if(!this.items && this.$slots.default) {
      this.itemsData = this.$slots.default.filter(item => {
        return (item.componentOptions && item.componentOptions.tag === 'ui-slider-item')
      }).map(item => item.componentOptions.propsData.item)
      this.countItems = this.itemsData.length
      this.elements = Array(this.countItems).fill(this.emptyElement)
      this.tempElements = Array(this.countItems).fill(this.emptyElement)
    } else {
      this.itemsData = [...this.items.map(item => item)]
      this.countItems = this.itemsData.length
      this.elements = Array(this.countItems).fill(this.emptyElement)
      this.tempElements = Array(this.countItems).fill(this.emptyElement)
    }

    if(this.$vnode.data && this.$vnode.data.scopedSlots && this.$vnode.data.scopedSlots.default) {
      // console.log('TEST')
      this.scopedElements = this.itemsData.map((item, index) => {
        let compiled = this.$vnode.data.scopedSlots.default({item, index, arrayIndex: index + 1, length: this.itemsData.length})
        compiled.componentOptions.propsData.index = index
        compiled.key = index
        return compiled
      })
    }
  },
  methods: {
    resize() {
      const sliderWidth = this.$refs.slider.clientWidth
      const sliderHeight = this.$refs.slider.clientHeight
      if(this.sliderWidth != sliderWidth) {
        if(!this.isLoading && (this.itemsWidth + this.left) < sliderWidth) {
          this.left = -1 * (this.itemsWidth - sliderWidth)
        }
        this.sliderWidth = sliderWidth
      }
      if(this.sliderHeight != sliderHeight) {
      }
    },
    updateItem(el, index) {
      this.$set(this.tempElements, index, el)
      if((this.countItems === this.tempElements.length) && this.tempElements.every(el => {
        return el.clientWidth >=0 && el.offsetLeft >= 0
      })) {
        let iW = this.itemsWidth
        let l = this.left
        let pr = Math.round(Math.abs(l) * 100 / iW)
        this.itemsWidth = this.tempElements.reduce(function(previousValue, currentValue) {
          return previousValue + currentValue.clientWidth;
        }, 0);
        const sliderWidth = this.$refs.slider.clientWidth

        this.sliderWidth = sliderWidth
        this.sliderHeight = this.$refs.slider.clientHeight
        this.showNavigation = this.sliderWidth < this.itemsWidth
        this.elements =this.tempElements

        this.left = -1 * Math.round(pr * this.itemsWidth / 100)
        // if((this.itemsWidth + this.left) < sliderWidth) {
        //   this.left = -1 * (this.itemsWidth - sliderWidth)
        // }

        this.tempElements = Array(this.countItems).fill(this.emptyElement)
      }
    },
    addItem(el, index) {
      this.$set(this.elements, index, el)
      if(this.countItems) {
        if((this.countItems === this.elements.length) && this.elements.every(el => {
          return el.clientWidth >=0 && el.offsetLeft >= 0
        })) {
          this.sliderWidth = this.$refs.slider.clientWidth
          this.sliderHeight = this.$refs.slider.clientHeight
          this.itemsWidth = this.elements.reduce(function(previousValue, currentValue) {
            return previousValue + currentValue.clientWidth;
          }, 0);
          this.showNavigation = this.sliderWidth < this.itemsWidth
          // console.log(this.showNavigation)
          // this.$nextTick(() => {
            this.isLoading = false
          // })
        }
      } 
    },
    handleLeft() {
      let next = [...this.elements].reverse().find(ref => {
         return (ref.offsetLeft + ref.clientWidth/2) <= Math.abs(this.left) 
      })
      let x = next ? Math.abs(next.offsetLeft + this.left) : null
      if(x) this.left = this.left + x
    },
    handleRight() {
      let next = this.elements.find(ref => {
        return (ref.offsetLeft + ref.clientWidth/2) >= Math.abs(this.left - this.sliderWidth)
      })
      let x = next ? next.offsetLeft  + next.clientWidth - this.sliderWidth + this.left : null
      if(x) this.left = this.left - x
    },
    handleDot(index) {
      const item = this.elements[index]
      if(item.offsetLeft < Math.abs(this.left)) {
        this.left = -item.offsetLeft
      } else {
        this.left = this.sliderWidth - (item.offsetLeft + item.clientWidth)
      }
    },
    handleScroll(e) {
      if(!this.wheel && !this.wheelReverse) return
        e.preventDefault();
        if(this.wheel) {
          if(e.wheelDelta < 0) {
            this.handleRight()
          } else {
            this.handleLeft()
          }
        } else {
          if(e.wheelDelta < 0) {
            this.handleLeft()
          } else {
            this.handleRight() 
          }
        }
      }
  },
  computed: {
    widthSlider() {
      return typeof this.width === 'number' ? `${this.width}px` : this.width
    },
    heightSlider() {
      return typeof this.height === 'number' ? `${this.height}px` : this.height
    },
    progressPercent() {
      return Math.round(((this.sliderWidth + Math.abs(this.left)) * 100) / this.itemsWidth)
    },
    visibleLeftButton() {
      return this.left < 0
    },
    visibleRightButton() {
      return (Math.abs(this.left) + this.sliderWidth) < this.itemsWidth
    },
    styleContent() {
      return {
        height: this.heightSlider,
        width: this.widthSlider
      }
    },
    styleContentItems() {
      return {
        transition: this.transition,
        left: this.left + 'px'
      }
    },
    styleContentWrapper() {
      return {
        margin: this.buttonsOutside ? '0 50px' : null
      }
    },
    isDots() {
      return /^(top|top-left|top-right|bottom|bottom-left|bottom-right)$/.test(this.dots)
    },
    isTopDots() {
      return /^(top|top-left|top-right)$/.test(this.dots)
    },
    isBottomDots() {
      return /^(bottom|bottom-left|bottom-right)$/.test(this.dots)
    },
    isLeftDots() {
      return /^(top-left|bottom-left)$/.test(this.dots)
    },
    isRightDots() {
      return /^(top-right|bottom-right)$/.test(this.dots)
    }
  },
  render(h) {
    // console.log('RENDER')
    // const directives = [
    //   { name: 'my-dir', value: 123, modifiers: { abc: true } }
    // ]
    const items = this.scopedElements
      ? this.scopedElements
      : this.itemsData.map((item, index) => {
          return h(SliderItem, { 
            props: {
              item,
              height: this.heightSlider,
              index,
              scopedFunc: this.scopedFunc
            },
            key: index
          })
      })

    const dots = (!this.isDots || this.isLoading || !this.showNavigation) 
      ? null 
      : h(SliderDots, { props: {
          padding: this.buttonsOutside,
          inside: this.dotsInside,
          left: this.isLeftDots,
          right: this.isRightDots,
          top: this.isTopDots,
          bottom: this.isBottomDots,
          elements: this.elements,
          sliderWidth: this.sliderWidth,
          sliderLeft: this.left,
          dotColor: this.dotColor,
          dotActiveColor: this.dotActiveColor
        }, on: {
          handleDot: this.handleDot
        }})

    const progress = (!this.progress || this.isLoading || !this.showNavigation) 
      ? null
      : h(SliderProgress, { props: {
          bgColor: this.progressBgColor,
          color: this.progressColor,
          padding: this.buttonsOutside,
          progress: this.progressPercent
        }})

    const leftArrowIcon = h('svg', {
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
        stroke: !this.buttonsOutside 
                  ? '#FFFFFF'
                  : this.visibleLeftButton 
                    ? '#000000'
                    : 'lightgrey',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }
    })])

    const rightArrowIcon = h('svg', {
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
        stroke: !this.buttonsOutside 
                  ? '#FFFFFF'
                  : this.visibleRightButton 
                    ? '#000000'
                    : 'lightgrey',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }
    })])

    const leftButton = h('div', { class: [
      'vu-slider__button',
      'vu-slider__button_left',
      this.buttonsOutside && 'vu-slider__button_outside',
      !this.visibleLeftButton && 'vu-slider__button_disabled',
      !this.isLoading && this.visibleLeftButton && 'vu-slider__button_visible'
    ], on: { click: this.handleLeft }}, [ h('div', { class: "arrow left"}, [leftArrowIcon])])

    const rightButton = h('div', {class: [
      'vu-slider__button',
      'vu-slider__button_right',
      this.buttonsOutside && 'vu-slider__button_outside',
      !this.visibleRightButton && 'vu-slider__button_disabled',
      !this.isLoading && this.visibleRightButton && 'vu-slider__button_visible'
    ], on: { click: this.handleRight }}, [ h('div', { class: "arrow left"}, [rightArrowIcon])])

    const content = h('div', { class: "vu-slider__content", style: this.styleContent}, [
      leftButton, 
      rightButton, 
      this.isDots && this.dotsInside && dots,
      h('div', { class: 'vu-slider__content-wrapper', style: this.styleContentWrapper, ref: "slider" }, [ 
        h('div', {class: "vu-slider__content-items", style: this.styleContentItems}, [ items ]),
        h(Resize, { on: { notify: this.resize }})
      ])
    ])

    return h('div', { 
      class: "vu-slider", style: { width: this.widthSlider }, on: { wheel: this.handleScroll }
    }, [
      this.isTopDots && !this.dotsInside && dots,
      this.progress ==='top' &&  progress,
      content,
      this.progress ==='bottom' && progress,
      this.isBottomDots && !this.dotsInside && dots
    ])
  }
}
