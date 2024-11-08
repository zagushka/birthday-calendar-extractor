import {
  createStyles,
  IconButton,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import handleLink from '../../filters/handleLink';
import { storeUserSettings } from '../../libs/storage/chrome.storage';

export const handleCloseModal = () => storeUserSettings({ modal: null });

export const handleLinkClickAndCloseModal = (href: string, e?: React.MouseEvent) => {
  handleLink(href, { close: true, active: true }, e);
  handleCloseModal();
};

const styles = (theme: Theme) => createStyles({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

export interface DialogTitleProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
}

export const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      <IconButton aria-label="close" size="medium" className={classes.closeButton} onClick={handleCloseModal}>
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
});
