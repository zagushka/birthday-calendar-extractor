import {
  makeStyles,
  Theme,
} from '@material-ui/core';

export const useLayoutStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: 300,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: theme.spacing(2, 1, 1.5, 2),
  },
  buttonActive: {
    color: theme.palette.primary.main,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
    minHeight: 425
  },
  footer: {
    display: 'flex',
  },
}));
