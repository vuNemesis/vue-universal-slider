import Slider from "./slider.jsx";
import SliderItem from "./slider-item.jsx";

var VueUniversalSlider = {};

VueUniversalSlider.install = function (Vue) {
  Vue.component("ui-slider", Slider);
  Vue.component("ui-slider-item", SliderItem);
};

VueUniversalSlider.Slider = Slider;
VueUniversalSlider.SliderItem = SliderItem;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueUniversalSlider);
}

export default VueUniversalSlider;