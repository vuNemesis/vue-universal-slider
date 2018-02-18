const Component = {
  name: 'ui-slider-item',
  props: {
    item: String,
    height: Number,
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
        style: {
          height: this.height + 'px'
        }
      }
    }
  },
  mounted() {
    if(this.scopedFunc) {
      // this.$refs.image.elm.onload = () => {
          this.sliderRoot.addItem(this.$el, this.index)
        // }
    } else {
      this.$refs.image.onload = () => {
          this.sliderRoot.addItem(this.$el, this.index)
        }
    }
  },
  inject: {
    sliderRoot: {default: null}
  },
  render(h) {
    const img = this.scopedFunc && this.scopedFunc({item: this.item})
    return (
      <div class="slider-item" ref="item">
        {img && img}
        {!img && <img src={this.item} {...this.styleItemImage}  {...this.classesImage} ref="image"/>}
      </div>
    )
  }
}

export default Component;