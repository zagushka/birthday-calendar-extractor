import { DirectiveOptions } from 'vue';

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
    el.innerHTML = chrome.i18n.getMessage(...data);
  },
};

export default translate;
