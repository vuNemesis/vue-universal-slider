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
    progressTop: Boolean,
    progressBottom: Boolean
  },
  data() {
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
    }
  },
   provide() {
    return {
      sliderRoot: this
    }
  },
  created() {
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
    progressVisible() {
      return this.progressTop || this.progressBottom
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

    const progress = !this.progressVisible 
      ? null 
      : this.isLoading 
        ? null
        : <div class="slider-progress" class={[
            'slider-progress',
            this.progressTop && 'top',
            this.progressBottom && 'bottom',
          ]}><div class="slider-progress-bar" {...this.styleProgress}></div></div>

    const leftButton = <div class="slider-button" 
      class={[
        'slider-button',
        this.buttonsPosition === 'bottom' 
          ? 'slider-button-bottom-left' 
          : this.buttonsPosition === 'top' 
            ? 'slider-button-top-left'
            : 'slider-button-left',
        !this.isLoading && this.visibleLeftButton && 'visible'
      ]} on-click={this.handleLeft}>&lsaquo;</div>

    const rightButton = <div class="slider-button" 
      class={[
        'slider-button',
        this.buttonsPosition === 'bottom' 
          ? 'slider-button-bottom-right' 
          : this.buttonsPosition === 'top' 
            ? 'slider-button-top-right'
            : 'slider-button-right',
        !this.isLoading && this.visibleRightButton && 'visible'
      ]} on-click={this.handleRight}>&rsaquo;</div>

    return (
      <div> 
        <div class="ui slider" {...this.styleSlider} onWheel={this.handleScroll}>
          <transition name="fade">
            {progress}
            </transition>
            {leftButton}
            {rightButton}
          <div class="slider-content" ref="slider" >
              <div class="slider-items" {...this.styleContent}>
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
