import {
  Box,
  Divider,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box/Box';
import {
  EventNote,
  GetApp,
  Repeat,
} from '@material-ui/icons';
import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { NavLink } from 'react-router-dom';
import {
  useLayoutStyles,
  useTooltipStyles,
} from './layout.styles';

interface ButtonWithTooltipProps {
  name?: buttonTypes;
  defaultOpen?: boolean;
  disabled?: boolean;
  button: JSX.Element;
  to: string;
  tooltip: string;
}

const ButtonWithTooltip: FunctionComponent<ButtonWithTooltipProps> =
  ({
     button,
     to,
     tooltip,
     defaultOpen = false,
     disabled = false,
   }) => {
    const classes = useLayoutStyles();
    const tooltipStyles = useTooltipStyles();
    const [open, setOpen] = useState<boolean>(defaultOpen);

    useEffect(() => {
      setOpen(defaultOpen);
    }, [defaultOpen]);

    return (
      <Tooltip title={tooltip} arrow classes={tooltipStyles}
               open={open}
               onClose={() => setOpen(false)}
               onOpen={() => setOpen(true)}
      >
        <IconButton
          size='small'
          activeClassName={classes.buttonActive}
          exact
          disabled={disabled}
          component={NavLink}
          to={to}
        >
          {button}
        </IconButton>
      </Tooltip>
    );
  };

type buttonTypes = 'export' | 'birthdays' | 'activate';

type ButtonsListType<T> = {
  [key in buttonTypes]?: T
};

const ButtonList: Array<ButtonWithTooltipProps> = [
  {
    name: 'export',
    button: <GetApp/>,
    to: '/export',
    tooltip: 'Export Your Birthdays Here',
  },
  {
    name: 'birthdays',
    button: <EventNote/>,
    to: '/',
    tooltip: 'Calendar with birthdays',
  },
  {
    name: 'activate',
    button: <Repeat/>,
    to: '/activate',
    tooltip: 'Scan birthdays',
  },
];

interface LayoutHeaderProps {
  disabledButtons?: ButtonsListType<boolean>;
  tooltipButtons?: ButtonsListType<boolean>;
}

export const LayoutHeader: FunctionComponent<LayoutHeaderProps> =
  ({
     children,
     disabledButtons = {},
     tooltipButtons = {},
   }) => {
    const classes = useLayoutStyles();

    return (<>
      <Box className={classes.header} alignItems={'center'}>
        <Box>
          {children}
        </Box>
        <Box flexGrow={1}/>

        {ButtonList
          // .filter(button => !!disabledButtons[button.name])
          .map(button => <ButtonWithTooltip
            key={button.name}
            disabled={!!disabledButtons[button.name]}
            defaultOpen={!!tooltipButtons[button.name]}
            {...button}
          />)
        }

      </Box>
      <Divider/>
    </>);
  };

export interface LayoutContentProps {
  direction?: 'vertical' | 'horizontal'
}

export const LayoutContent: FunctionComponent<LayoutContentProps & BoxProps> = (props) => {
  const classes = useLayoutStyles();
  return (
    <Box pb={1} pl={1} className={classes.content} {...props}/>
  );
};

export const LayoutFooter: FunctionComponent<LayoutContentProps & BoxProps> = (props) => {
  const classes = useLayoutStyles();
  return (<>
    <Divider/>
    <Box p={1} className={classes.footer} {...props}/>
  </>);
};

export const LayoutWrapper: FunctionComponent = ({children}) => {
  const classes = useLayoutStyles();

  return (
    <Box className={classes.root}>
      {children}
    </Box>
  );
};

const Layout = {
  Header: LayoutHeader,
  Footer: LayoutFooter,
  Content: LayoutContent,
  Wrapper: LayoutWrapper,
};

export default Layout;
