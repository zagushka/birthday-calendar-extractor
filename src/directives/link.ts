import { DirectiveOptions } from 'vue';

const link: DirectiveOptions = {
  bind: (el, binding, vnode) => {
    if (!binding.value) {
      return;
    }
    const url = chrome.i18n.getMessage(binding.value);
    el.addEventListener('click', () => {
      chrome.tabs.create({url});
      window.close();
      return false;
    });
  },
};

export default link;
