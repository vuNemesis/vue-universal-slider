export default {
  name: 'ui-slider-dots',
  functional: true,
  inject: {
    sliderRoot: { default: null }
  },
  render: function render(h, _ref) {
    var _this = this;

    var injections = _ref.injections;
    var sliderRoot = injections.sliderRoot;

    return h('div', { class: 'vu-slider__dots', style: sliderRoot.styleDots }, [sliderRoot.elements.map(function (item, index) {
      return item.offsetLeft + sliderRoot.left + item.clientWidth / 3 >= 0 && item.offsetLeft + item.clientWidth - item.clientWidth / 3 <= sliderRoot.sliderWidth + Math.abs(sliderRoot.left) ? h('span', { class: 'vu-slider__dot vu-slider__dot_active' }) : h('span', { class: 'vu-slider__dot', on: { click: sliderRoot.handleDot.bind(_this, index) } });
    })]);
  }
};