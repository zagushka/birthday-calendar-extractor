import { Box, Divider, Typography } from "@material-ui/core";
import { BoxProps } from "@material-ui/core/Box/Box";
import React, { FunctionComponent } from "react";
import { useLayoutStyles } from "@/components/layout/layout.styles";

export const LayoutHeader: FunctionComponent = ({ children }) => {
  const classes = useLayoutStyles();

  return (
    <>
      <Box className={classes.header}>
        <Typography color="textPrimary" variant="h6">
          {children}
        </Typography>
      </Box>
      <Divider />
    </>
  );
};

export interface LayoutContentProps {
  direction?: "vertical" | "horizontal";
}

export const LayoutContent: FunctionComponent<LayoutContentProps & BoxProps> = (props) => {
  const classes = useLayoutStyles();
  return <Box pb={1} pl={1} className={classes.content} {...props} />;
};

export const LayoutFooter: FunctionComponent<LayoutContentProps & BoxProps> = (props) => {
  const classes = useLayoutStyles();
  return (
    <>
      <Divider />
      <Box className={classes.footer} {...props} />
    </>
  );
};

export const LayoutWrapper: FunctionComponent = ({ children }) => {
  const classes = useLayoutStyles();

  return <Box className={classes.root}>{children}</Box>;
};

const Layout = {
  Header: LayoutHeader,
  Footer: LayoutFooter,
  Content: LayoutContent,
  Wrapper: LayoutWrapper,
};

export default Layout;
