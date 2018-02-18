const Component = {
  name: 'ui-slider-item-image',
  props: {
    item: String,
    height: Number,
    index: Number
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
    },
    classesImage() {
      return {
        class: [
          // this.loaded && 'hide'
        ]
      }
    }
  },
  mounted() {
    this.$refs.image.onload = () => {
      // this.loaded = false
      // this.$nextTick(() => {
        this.sliderRoot.addItem(this.$el, this.index)
      // })
    }
    // console.log('mounted:', this.index)
    // let img = new Image();
    // img.onload = () => {
    //     this.loaded = true
    //     this.$nextTick(() => {
    //       this.sliderRoot.addItem(this.$el, this.index)
    //     })
    // };
    // img.src = this.item
  },
  inject: {
    sliderRoot: {default: null}
  },
  render(h) {
    return (
      <div class="slider-item">
        <img src={this.item} {...this.styleItemImage}  {...this.classesImage} ref="image"/>
      </div>
    )
  }
}

export default Component;