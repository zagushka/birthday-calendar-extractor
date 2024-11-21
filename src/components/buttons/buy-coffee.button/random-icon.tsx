import { SvgIconProps } from "@material-ui/core";
import { Cake, EmojiFoodBeverage, FreeBreakfast, LocalBar, LocalPizza } from "@material-ui/icons";
import { createElement, FunctionComponent, useEffect, useState } from "react";

export const RandomIcon: FunctionComponent<SvgIconProps> = (props) => {
  const [icon, setIcon] = useState<React.ReactElement<SvgIconProps> | null>(null);
  const [randomIcon, setRandomIcon] = useState<FunctionComponent<SvgIconProps> | null>(null);

  useEffect(() => {
    const icons = [Cake, EmojiFoodBeverage, FreeBreakfast, LocalBar, LocalPizza];
    const selectedIcon = icons[Math.floor(Math.random() * icons.length)];
    setRandomIcon(() => selectedIcon);
  }, []);

  useEffect(() => {
    if (randomIcon) {
      const iconElement = createElement(randomIcon, props);
      setIcon(iconElement);
    }
  }, [randomIcon, props]);

  return icon;
};