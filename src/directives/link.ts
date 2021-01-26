import { DirectiveOptions } from 'vue';

const clickHandler = (url: string, close: boolean, notActivate: boolean) => (ev: MouseEvent) => {
  ev.preventDefault();
  ev.stopPropagation();
  chrome.tabs.create({url, active: !notActivate});
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

    const {close = false, notActive = false} = binding.modifiers;

    const url = chrome.i18n.getMessage(binding.value) || binding.value;
    el.setAttribute('href', url);
    el.addEventListener('click', clickHandler(url, close, notActive));
  },
};

export default link;
