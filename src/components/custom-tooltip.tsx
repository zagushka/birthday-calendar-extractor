import {
  makeStyles,
  Theme,
  Tooltip,
} from '@material-ui/core';
import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
} from 'react';

const useTooltipStyles = makeStyles((theme: Theme) => ({
  tooltipPlacementBottom: {
    marginTop: 10,
  },
  tooltipPlacementTop: {
    marginBottom: 10,
  },
}));

interface CustomTooltipProps {
  defaultOpen?: boolean;
  title: string;
  children: ReactElement<any, any>;
}

export const CustomTooltip: FunctionComponent<CustomTooltipProps> = (props) => {
  const {title, defaultOpen = false} = props;
  const [open, setOpen] = useState<boolean>(defaultOpen);

  useEffect(() => {
    if (defaultOpen) {
      setOpen(defaultOpen);
    }
  }, [defaultOpen]);

  const tooltipStyles = useTooltipStyles();
  return (
    <Tooltip
      arrow
      classes={tooltipStyles}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      title={title}
      children={props.children}
    />
  );
};
