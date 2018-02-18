import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
var Component = {
  name: 'ui-slider-dots',
  inject: ['sliderRoot'],
  data: function data() {
    return {
      slider: this.sliderRoot
    };
  },
  render: function render(h) {
    var _this = this;

    return h(
      'div',
      { 'class': 'slider-dots' },
      [this.slider.elements.map(function (item, index) {
        return item.offsetLeft + _this.slider.left + item.clientWidth / 3 >= 0 && item.offsetLeft < _this.slider.sliderWidth - _this.slider.left ? h('span', { 'class': 'dot red' }) : h('span', _mergeJSXProps([{ 'class': 'dot' }, {
          on: {
            'click': function click($event) {
              for (var _len = arguments.length, attrs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                attrs[_key - 1] = arguments[_key];
              }

              _this.slider.handleDot.bind(_this, index).apply(undefined, [$event].concat(attrs));
            }
          }
        }]));
        // : <a class="ui grey empty circular label" onClick={this.sliderRoot.handleCircular.bind(this, index)}/>
      })]
    );
  }
};

export default Component;