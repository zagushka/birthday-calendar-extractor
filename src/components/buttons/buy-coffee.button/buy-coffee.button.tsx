import { Button, ButtonProps, IconButton, IconButtonProps, makeStyles } from "@material-ui/core";
import { FreeBreakfast } from "@material-ui/icons";
import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RandomIcon } from "@/components/buttons/buy-coffee.button/random-icon";
import { CurrentStatusContext } from "@/context/current-status.context";
import handleLink from "@/filters/handleLink";
import { translateString } from "@/filters/translateString";
import Analytics from "@/libs/analytics";
import { updateStatisticsAdd } from "@/libs/storage/statistics";

interface BuyCoffeeButtonProps extends ButtonProps {
  buttonLocation: string;
  withIcon?: boolean;
  onClick?: () => void;
}

const effectsArray = ["shake", "pulse", "bounce", "rotate", "wobble", "flash", "teapotBoil"];
type cssEffectKey = keyof typeof useStyles;

const useStyles = makeStyles({
  shake: {
    animation: "$shake 1s cubic-bezier(0.4, 0, 0.6, 1)",
  },
  "@keyframes shake": {
    "0%": { transform: "translateX(0)" },
    "10%": { transform: "translateX(-8px)" },
    "20%": { transform: "translateX(8px)" },
    "30%": { transform: "translateX(-6px)" },
    "40%": { transform: "translateX(6px)" },
    "50%": { transform: "translateX(-4px)" },
    "60%": { transform: "translateX(4px)" },
    "70%": { transform: "translateX(-2px)" },
    "80%": { transform: "translateX(2px)" },
    "100%": { transform: "translateX(0)" },
  },
  pulse: {
    animation: "$pulse 1s cubic-bezier(0.4, 0, 0.6, 1)",
  },
  "@keyframes pulse": {
    "0%": { transform: "scale(1)", opacity: 1 },
    "25%": { transform: "scale(1.15)", opacity: 0.8 },
    "50%": { transform: "scale(0.95)", opacity: 1 },
    "75%": { transform: "scale(1.1)", opacity: 0.9 },
    "100%": { transform: "scale(1)", opacity: 1 },
  },
  bounce: {
    animation: "$bounce 1s cubic-bezier(0.25, 1, 0.5, 1)",
  },
  "@keyframes bounce": {
    "0%": { transform: "translateY(0)" },
    "20%": { transform: "translateY(-8px)" },
    "40%": { transform: "translateY(6px)" },
    "60%": { transform: "translateY(-4px)" },
    "80%": { transform: "translateY(2px)" },
    "100%": { transform: "translateY(0)" },
  },
  rotate: {
    animation: "$rotate 1s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  "@keyframes rotate": {
    "0%": { transform: "rotate(0deg)" },
    "30%": { transform: "rotate(180deg)" },
    "60%": { transform: "rotate(270deg) scale(1.1)" },
    "100%": { transform: "rotate(360deg) scale(1)" },
  },
  wobble: {
    animation: "$wobble 1s ease-in-out",
  },
  "@keyframes wobble": {
    "0%": { transform: "translateX(0) rotate(0deg)" },
    "15%": { transform: "translateX(-8px) rotate(-5deg)" },
    "30%": { transform: "translateX(8px) rotate(3deg)" },
    "45%": { transform: "translateX(-6px) rotate(-3deg)" },
    "60%": { transform: "translateX(6px) rotate(2deg)" },
    "75%": { transform: "translateX(-4px) rotate(-1deg)" },
    "90%": { transform: "translateX(4px) rotate(1deg)" },
    "100%": { transform: "translateX(0) rotate(0deg)" },
  },
  flash: {
    animation: "$flash 1s ease-in-out",
  },
  "@keyframes flash": {
    "0%": { opacity: 1 },
    "25%": { opacity: 0.5 },
    "50%": { opacity: 0.2 },
    "75%": { opacity: 0.5 },
    "100%": { opacity: 1 },
  },
  teapotBoil: {
    animation: "$teapotBoil 1s infinite cubic-bezier(0.4, 0, 0.6, 1)",
  },
  "@keyframes teapotBoil": {
    "0%": { transform: "translate(0, 0) rotate(0deg)" },
    "10%": { transform: "translate(-2px, -2px) rotate(-1deg)" },
    "20%": { transform: "translate(2px, 2px) rotate(1deg)" },
    "30%": { transform: "translate(-3px, 2px) rotate(-2deg)" },
    "40%": { transform: "translate(3px, -2px) rotate(2deg)" },
    "50%": { transform: "translate(0, 2px) rotate(0deg)" },
    "60%": { transform: "translate(-2px, -2px) rotate(-1deg)" },
    "70%": { transform: "translate(2px, 1px) rotate(1deg)" },
    "80%": { transform: "translate(-1px, 2px) rotate(-1deg)" },
    "90%": { transform: "translate(1px, -1px) rotate(1deg)" },
    "100%": { transform: "translate(0, 0) rotate(0deg)" },
  },
});

const BuyCoffeeButton: FunctionComponent<BuyCoffeeButtonProps> = (props) => {
  const { onClick, buttonLocation, withIcon = false, ...parentProps } = props;
  const { isDonated } = useContext(CurrentStatusContext);
  const [title, setTitle] = useState<string>();
  const [isShaking, setIsShaking] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<cssEffectKey | undefined>();
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const location = useLocation();

  const classes = useStyles();

  useEffect(() => {
    setTitle(translateString(withIcon ? "BUY_ME_COFFEE_TITLE_SHORT" : "BUY_ME_COFFEE_TITLE"));
  }, [withIcon]);

  useEffect(() => {
    const initialShakeTimeout = setTimeout(() => {
      triggerShake();
    }, 2_000); // First shake after 3 seconds

    const shakeInterval = setInterval(() => {
      triggerShake();
    }, 20_000); // Subsequent shakes every 10 seconds

    return () => {
      clearTimeout(initialShakeTimeout);
      clearInterval(shakeInterval); // Cleanup intervals on unmount
    };
  }, []);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1_000); // Match shake animation duration
  };

  // Function that will randomly select a class from the classes when isShaking is changed
  useEffect(() => {
    if (!isShaking) {
      return setSelectedEffect(undefined);
    }
    const cssEffectName = effectsArray[Math.floor(Math.random() * effectsArray.length)];
    setSelectedEffect(cssEffectName as cssEffectKey);
  }, [isShaking]);

  const handleButtonClick = async () => {
    await Analytics.fireButtonClickEvent("buy_me_coffee", location.pathname, {
      button_effect: selectedEffect,
      button_icon: selectedIcon,
      button_location: buttonLocation,
    });
    await updateStatisticsAdd("followedDonateLinks");
    if (onClick) {
      onClick();
    }
    await handleLink("BUY_ME_COFFEE_LINK", { close: true, active: true });
  };

  const handleButtonSelectedIcon = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  return (
    !isDonated && (
      <Button
        onClick={handleButtonClick}
        endIcon={
          withIcon ? (
            <RandomIcon
              onIconSelected={handleButtonSelectedIcon}
              className={isShaking && selectedEffect ? classes[selectedEffect] : ""}
            />
          ) : null
        }
        {...parentProps}
      >
        {title}
      </Button>
    )
  );
};

export const BuyCoffeeIconButton: FunctionComponent<IconButtonProps> = (props) => (
  <IconButton {...props} onClick={() => handleLink("BUY_ME_COFFEE_LINK", { close: true, active: true })}>
    <FreeBreakfast />
  </IconButton>
);

export default BuyCoffeeButton;
