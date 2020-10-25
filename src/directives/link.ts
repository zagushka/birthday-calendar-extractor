import { DirectiveOptions } from 'vue';

const clickHandler = (url: string, close: boolean, active: boolean) => (ev: MouseEvent) => {
  ev.preventDefault();
  ev.stopPropagation();
  chrome.tabs.create({url, active: active});
  if (close) {
    window.close();
  }
  return false;
};

const link: DirectiveOptions = {
  bind: (el, binding, vnode) => {
    if (!binding.value) {
      return;
    }

    const {close = false, active = false} = binding.modifiers;

    const url = chrome.i18n.getMessage(binding.value) || binding.value;
    el.setAttribute('href', url);
    el.addEventListener('click', clickHandler(url, close, active));
  },
};

export default link;
