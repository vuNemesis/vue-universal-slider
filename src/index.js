import Slider from "./slider.js";
import SliderItem from "./slider-item.js";
import SliderTemplate from "./slider-template.js";

const VueUniversalSlider = {};

VueUniversalSlider.install = (Vue) => {
  Vue.component("vu-slider", Slider);
  Vue.component("vu-slider-item", SliderItem);
  Vue.component("vu-slider-template", SliderTemplate);
}

VueUniversalSlider.Slider = Slider;
VueUniversalSlider.SliderItem = SliderItem;
VueUniversalSlider.SliderTemplate = SliderTemplate;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueUniversalSlider);
}

export default VueUniversalSlider
