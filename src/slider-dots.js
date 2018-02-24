export default {
  name: 'ui-slider-dots',
  props: {
    padding: {
      type: Boolean,
      default: false
    },
    inside: {
      type: Boolean,
      default: false
    },
    top: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: Boolean,
      default: false
    },
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    elements: {
      type: Array,
      default() {
        return []
      }
    },
    sliderWidth: {
      type: Number,
      default: 0
    },
    sliderLeft: {
      type: Number,
      default: 0
    },
    dotColor: {
      type: String,
      default: 'lightgrey'
    },
    dotActiveColor: {
      type: String,
      default: 'grey'
    }
  },
  render(h) {
    const { left, right, top, bottom, padding, inside, elements, sliderWidth, sliderLeft, dotColor, dotActiveColor } = this
    const styleWrapper = {
      paddingRight: padding ? '55px' : '5px',
      paddingLeft: padding ? '55px' : '5px',
      textAlign: left ? 'left' : right ? 'right' : 'center'
    }
    const style = {
      position: inside ? 'absolute' : 'relative',
      width: inside ? '100%' : 'auto',
      top: top ? 0 : null,
      bottom: bottom ? 0 : null
    }
    const dots =  elements.map((item, index) => {
      return (item.offsetLeft + sliderLeft + item.clientWidth/3) >= 0 
          && (item.offsetLeft + item.clientWidth - item.clientWidth/3) <= ( sliderWidth + Math.abs(sliderLeft))
        ? h('span', { class: 'vu-slider__dot vu-slider__dot_active', style: { backgroundColor: dotActiveColor}})
        : h('span', { class: 'vu-slider__dot', style: { backgroundColor: dotColor }, on: { click: () => this.$emit('handleDot', index)}})
    })
    return h('div', { class: ['vu-slider__dots'], style }, [
      h('div', { class: 'vu-slider__dots-wrapper', style: styleWrapper }, [
        dots
      ])
    ])
  }
}
