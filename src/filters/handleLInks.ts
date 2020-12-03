import translateFilter from './translate';

interface LinkSettings {
  close: boolean;
  active: boolean;
  substitutions: any;
}

const handleLInks = (ev: MouseEvent, rawUrl: string, settings?: LinkSettings) => {
  ev.preventDefault();
  ev.stopPropagation();
  if (!rawUrl.length) {
    return false;
  }

  const {
    close = false,
    active = false,
    substitutions,
  } = settings;

  const url = translateFilter(rawUrl, substitutions) || rawUrl;
  chrome.tabs.create({url, active});

  if (close) {
    window.close();
  }
  return false;
};

export default handleLInks;
