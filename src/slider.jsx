import './style.scss'
import SliderItemImage from './slider-item-image.jsx'
import SliderItem from './slider-item.jsx'
import SliderDots from './slider-dots.jsx'
const Component = {
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
    progress: String,
  },
  data() {
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
    }
  },
   provide() {
    return {
      sliderRoot: this
    }
  },
  created() {
    console.log('created: ', this.$props)
  },
  mounted() {
    console.log('mounted')
    // if(this.$vnode.data.scopedSlots && this.$vnode.data.scopedSlots.default) console.dir(this.$vnode.data.scopedSlots.default({image: 'test'}))
    if(!this.items && this.$slots.default) {
      this.itemsData = this.$slots.default.filter(item => {
        return (item.componentOptions && item.componentOptions.tag === 'ui-slider-item')
      }).map(item => item.componentOptions.propsData.item)
      this.countItems = this.itemsData.length
    } else {
      this.itemsData = [...this.items.map(item => item)]
      this.countItems = this.itemsData.length
    }
  },
  methods: {
    addItem(el, index) {
      this.$set(this.elements, index, el)
      if(this.countItems) {
        if(this.countItems === this.elements.length && this.elements.every(el => !!el)) {
          this.sliderWidth = this.$refs.slider.clientWidth
          this.itemsWidth = this.elements.reduce(function(previousValue, currentValue) {
            return previousValue + currentValue.clientWidth;
          }, 0);
          this.$nextTick(() => {
            this.isLoading = false
          })
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
      if(!this.wheel) return
          e.preventDefault();
          if(e.wheelDelta < 0) {
            this.handleRight()
          } else {
            this.handleLeft()
          }
        }
  },
  computed: {
    // itemsData() {
    //     console.dir(this.items)
      
    //   let data = []
    //   if(!this.items && this.$slots.default) {
    //     data = this.$slots.default.filter(item => {
    //       return (item.componentOptions && item.componentOptions.tag === 'ui-slider-item')
    //     }).map(item => item.componentOptions.propsData.item)
    //   } else {
    //     data = [...this.items.map(item => item)]
    //   }
    //   this.countItems = data.length
    //   return data
    // },
    progressPercent() {
      return Math.round(((this.sliderWidth + Math.abs(this.left)) * 100) / this.itemsWidth)
    },
    visibleLeftButton() {
      return this.left < 0
    },
    visibleRightButton() {
      return (Math.abs(this.left) + this.sliderWidth) < this.itemsWidth
    },
    styleSlider() {
      const height = (this.buttonsPosition === 'bottom' || this.buttonsPosition === 'top') && this.buttonsOutside && (this.nextLeft || this.nextRight)
        ? this.height + 50
        : this.height
      return {
        style: {
          height: height + 'px',
          width: typeof this.width === 'number' ? `${this.width}px` : this.width,
          paddingBottom: this.buttonsPosition === 'bottom' && this.buttonsOutside && (this.nextLeft || this.nextRight)? '50px' : 0,
          paddingTop: this.buttonsPosition === 'top' && this.buttonsOutside && (this.nextLeft || this.nextRight)? '50px' : 0,
          paddingLeft: !this.buttonsPosition && this.buttonsOutside ? '50px' : 0,
          paddingRight: !this.buttonsPosition && this.buttonsOutside ? '50px' : 0
        }
      }
    },
    styleContent() {
      return {
        style: {
          left: this.left + 'px'
        }
      }
    },
    styleProgress() {
      return {
        style: {
          width: this.progressPercent + '%'
        }
      }
    }
  },
  render(h) {
    // const directives = [
    //   { name: 'my-dir', value: 123, modifiers: { abc: true } }
    // ]
    console.log('OK')
    let items
    const scopedFunc = this.$vnode.data.scopedSlots && this.$vnode.data.scopedSlots.default
    items = this.itemsData.map((item, index) => {
      return (
        <SliderItem item={item} height={this.height} key={index}  index={index} scoped-func={scopedFunc}/>
      )
    })

    const dots = !this.dots
      ? null
      : this.isLoading
        ? null
        :  <SliderDots/>

    const progress = !this.progress
      ? null 
      : this.isLoading 
        ? null
        : <div class={[
            'vu-slider__progress',
            `vu-slider__progress_${this.progress}`
          ]}><div class="vu-slider__progress-bar" {...this.styleProgress}></div></div>

    const leftButton = <div class={[
        'vu-slider__button',
        this.buttonsPosition === 'bottom' 
          ? 'vu-slider__button_bottom-left' 
          : this.buttonsPosition === 'top' 
            ? 'vu-slider__button_top-left'
            : 'vu-slider__button_left',
        !this.isLoading && this.visibleLeftButton && 'vu-slider__button_visible'
      ]} on-click={this.handleLeft}>
        <div class="arrow left">
         {/* <svg width="60px" height="80px" viewBox="0 0 50 80" xmlSpace="preserve">
            <polyline fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375"/>
          </svg> */} 
          <svg width="16px" height="30px" viewBox="0 0 16 30" xmlSpace="preserve">
            <polyline fill="none" stroke="#FFFFFF" stroke-width="1" 
            stroke-linecap="round" stroke-linejoin="round" points="16,30 0,15 16,0"/>
          </svg>  
        </div>
      </div>

    const rightButton = <div class={[
        'vu-slider__button',
        this.buttonsPosition === 'bottom' 
          ? 'vu-slider__button_bottom-right' 
          : this.buttonsPosition === 'top' 
            ? 'vu-slider__button_top-right'
            : 'vu-slider__button_right',
        !this.isLoading && this.visibleRightButton && 'vu-slider__button_visible'
      ]} on-click={this.handleRight}>
        <div class="arrow right">
         {/* <svg width="60px" height="80px" viewBox="0 0 50 80" xmlSpace="preserve">
            <polyline fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375"/>
          </svg> */} 
          <svg width="16px" height="30px" viewBox="0 0 16 30" xmlSpace="preserve">
            <polyline fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" points="0,30 16,15 0,0"/>
          </svg>  
        </div>
      </div>

    return (
      <div> 
        <div class="vu-slider" {...this.styleSlider} onWheel={this.handleScroll}>
          <transition name="fade">
            {progress}
            </transition>
            {leftButton}
            {rightButton}
          <div class="vu-slider__content" ref="slider" >
              <div class="vu-slider__content-items" {...this.styleContent}>
                {items}
              </div>
          </div>
          <transition name="fade">
          {dots}
          </transition>
        </div>
      </div>
    )
  }
}

export default Component;
