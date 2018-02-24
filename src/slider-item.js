export default {
  name: 'ui-slider-item',
  props: {
    item: String,
    height: { type: [Number, String] },
    index: Number,
    scopedFunc: Function
  },
  data() {
    return {
      loaded: true
    }
  },
  computed: {
    styleItemImage() {
      return {
          height: this.height,
          // width: this.sliderRoot.width + 'px'
      }
    }
  },
  mounted() {
    // if(this.scopedFunc) {
    //   const { clientWidth, offsetLeft } = this.$el
    //   this.sliderRoot.addItem({ clientWidth, offsetLeft }, this.index)
    // } else {
    //   this.$refs.image.onload = () => {
    //     const { clientWidth, offsetLeft } = this.$el
    //     this.sliderRoot.addItem({ clientWidth, offsetLeft }, this.index)
    //   }
    // }
    const { clientWidth, offsetLeft } = this.$el
    this.sliderRoot.addItem({ clientWidth, offsetLeft }, this.index)

  },
  updated() {
    const { clientWidth, offsetLeft } = this.$el
    this.sliderRoot.updateItem({ clientWidth, offsetLeft }, this.index)
    // console.log('item:', this.index, ' clientWidth:', this.$el.clientWidth)
  },
  inject: {
    sliderRoot: {default: null}
  },
  render(h) {
    const img = this.scopedFunc && this.scopedFunc({item: this.item})
    return h('div', { class: 'vu-slider__content-item',  ref: 'item' }, [
        img && img,
        !img && h('img', { attrs: { src: this.item }, style: this.styleItemImage, ref: 'image'})
      ])
  }
}

