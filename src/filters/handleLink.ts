import React from 'react';
import { translateString } from './translateString';

interface LinkSettings {
  close?: boolean;
  active?: boolean;
  substitutions?: any;
}

const handleLink = (rawUrl: string | undefined, settings: LinkSettings, ev?: React.MouseEvent): boolean => {
  const {
    close = false,
    active = false,
    substitutions,
  } = settings;

  if (ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  if ("string" !== typeof rawUrl || !rawUrl.length) {
    return false;
  }

  const url = translateString(rawUrl, substitutions) || rawUrl;
  chrome.tabs.create({ url, active });

  if (close) {
    window.close();
  }
  return false;
};

export default handleLink;
