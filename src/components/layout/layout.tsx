import {
  Box,
  Divider,
  IconButton,
} from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box/Box';
import {
  ArrowBack,
  Close,
} from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { closeWindowHandler } from '../../libs/tools';
import { useLayoutStyles } from './layout.styles';

export interface LayoutHeaderProps {
  navigation?: 'back' | 'close' | 'none';
}

const CloseButton = <IconButton
  size='small'
  onClick={closeWindowHandler}>
  <Close/>
</IconButton>;

const BackButton = () => {
  const history = useHistory();

  return (<IconButton
    size='small'
    onClick={() => history.goBack()}>
    <ArrowBack/>
  </IconButton>);
};

export const LayoutHeader: FunctionComponent<LayoutHeaderProps> = ({children, navigation = 'close'}) => {
  const classes = useLayoutStyles();

  let button: JSX.Element;

  switch (navigation) {
    case 'back':
      button = <BackButton/>;
      break;
    case 'close':
      button = CloseButton;
      break;
    default:
      button = null;
  }


  return (<>
    <Box className={classes.header} alignItems={'center'}>
      <Box>
        {children}
      </Box>
      <Box flexGrow={1}/>
      {button}
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
