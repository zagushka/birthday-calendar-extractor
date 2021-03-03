import {
  makeStyles,
  Theme,
} from '@material-ui/core';

export const useLayoutStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: 599,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    padding: '16px 8px 12px 8px',
    fontSize: 16,
    color: '#5f6368',
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: '16px',
  },
  buttonActive: {
    color: theme.palette.primary.main,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  footer: {
    flexShrink: 1,
  },
}));
