export default {
  name: 'ui-slider-template',
  props: {
    type: {
      type: String,
      default: '1in1'
    },
    index: Number,
    styleWrapper: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      styleTemplate: null
    }
  },

  mounted() {
      // console.log('index: ', this.index)
      this.styleTemplate = {
        height: this.sliderRoot.height + 'px',
        width: this.sliderRoot.$refs.slider.clientWidth + 'px'
      }
      this.sliderRoot.addItem({ 
        clientWidth: this.sliderRoot.$refs.slider.clientWidth,
        offsetLeft: this.index * this.sliderRoot.$refs.slider.clientWidth
      }, this.index)
   
    // if(this.scopedFunc) {
    //   // this.$refs.image.elm.onload = () => {
    //       this.sliderRoot.addItem(this.$el, this.index)
    //     // }
    // } else {
    //   this.$refs.image.onload = () => {
    //       this.sliderRoot.addItem(this.$el, this.index)
    //     }
    // }
  },
  inject: {
    sliderRoot: {default: null}
  },
  render(h) {
    // return h('div', 'test')
    if(this.styleTemplate) {
      return h('div', { class: 'vu-slider__content-template', style: this.styleTemplate }, [
        h('div', { style: this.styleWrapper }, [this.$slots.default])
      ])
    } else {
      return h('div', '')      
    }
  }
}

