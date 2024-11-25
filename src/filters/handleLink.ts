import React from 'react';
import { translateString } from '@/filters/translateString';

interface LinkSettings {
  close?: boolean;
  active?: boolean;
  substitutions?: any;
}

const handleLink = async (rawUrl: string | undefined, settings: LinkSettings, ev?: React.MouseEvent): Promise<boolean> => {
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
  await chrome.tabs.create({ url, active });

  if (close) {
    window.close();
  }
  return false;
};

export default handleLink;
