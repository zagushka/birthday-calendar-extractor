import { DirectiveOptions } from 'vue';
import translateFilter from '../filters/translate';

const translate: DirectiveOptions = {
  bind: (el, binding, vnode) => {
    if (!binding.value) {
      return;
    }

    let data = binding.value;
    if (!Array.isArray(data)) {
      data = [binding.value];
    }

    // @ts-ignore
    el.innerHTML = translateFilter(...data);
  },
};

export default translate;
