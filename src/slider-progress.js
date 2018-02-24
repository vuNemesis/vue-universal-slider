export default {
  name: 'ui-slider-progress',
  props: {
    progress: {
      type: Number,
      default: 0
    },
    bgColor: {
      type: String,
      default: 'transparent'
    },
    color: {
      type: String,
      default: 'lightgrey'
    },
    padding: {
      type: Boolean,
      default: false
    }
  },
  render(h) {
    const { progress, padding, color, bgColor  } = this
    return h('div', { class: [
      'vu-slider__progress',
      padding && 'vu-slider__progress_padding'
    ], style: { backgroundColor: bgColor}}, [ h('div', { class: "vu-slider__progress-bar", style: { width: progress + '%', backgroundColor: color}}) ])
  }
}
