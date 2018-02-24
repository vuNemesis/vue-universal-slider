import Slider from "./slider.js";
import SliderItem from "./slider-item.js";

var VueUniversalSlider = {};

VueUniversalSlider.install = function (Vue) {
  Vue.component("vu-slider", Slider);
  Vue.component("vu-slider-item", SliderItem);
};

VueUniversalSlider.Slider = Slider;
VueUniversalSlider.SliderItem = SliderItem;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueUniversalSlider);
}

export default VueUniversalSlider;