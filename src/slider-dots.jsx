const Component = {
  name: 'ui-slider-dots',
  inject: ['sliderRoot'],
  data() {
    return {
      slider: this.sliderRoot
    }
  },
  render(h) {
    return (
      <div class="slider-dots">{this.slider.elements.map((item, index) => {
        return (item.offsetLeft + this.slider.left + item.clientWidth/3) >= 0 && (item.offsetLeft + item.clientWidth - item.clientWidth/3) <= (this.slider.sliderWidth + Math.abs(this.slider.left))
          ? <span class="dot red"/>
          : <span class="dot" onClick={this.slider.handleDot.bind(this, index)}/>
      })}</div>
    )
  }
}

export default Component;