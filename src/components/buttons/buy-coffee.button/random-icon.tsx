import { SvgIconProps } from "@material-ui/core";
import { Cake, EmojiFoodBeverage, FreeBreakfast, LocalBar, LocalPizza } from "@material-ui/icons";
import { createElement, FunctionComponent, ReactElement, useEffect, useState } from "react";

const iconNames = ["Cake", "EmojiFoodBeverage", "FreeBreakfast", "LocalBar", "LocalPizza"];

interface RandomIconProps extends SvgIconProps {
  onIconSelected?: (iconName: string) => void; // Callback to emit the icon name
}

export const RandomIcon: FunctionComponent<RandomIconProps> = (props) => {
  const { onIconSelected, ...restProps } = props;
  const [icon, setIcon] = useState<ReactElement<SvgIconProps> | null>(null);
  const [randomIcon, setRandomIcon] = useState<FunctionComponent<SvgIconProps> | null>(null);

  useEffect(() => {
    const icons = [Cake, EmojiFoodBeverage, FreeBreakfast, LocalBar, LocalPizza];
    const index = Math.floor(Math.random() * icons.length);

    if (onIconSelected) {
      onIconSelected(iconNames.at(index));
    }
    setRandomIcon(() => icons.at(index));
  }, []);

  useEffect(() => {
    if (randomIcon) {
      const iconElement = createElement(randomIcon, restProps);
      setIcon(iconElement);
    }
  }, [randomIcon, props]);

  return icon;
};