import {
  makeStyles,
  Theme,
} from '@material-ui/core';

export const useBirthdaysListStyles = makeStyles((theme: Theme) => ({
  item: {
    color: '#fff',
    borderRadius: 4,
    marginBottom: 8,
    paddingLeft: 8,
    paddingTop: 6,
    backgroundColor: theme.palette.action.active,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightBold,
    '&:hover': {
      backgroundColor: theme.palette.action.active,
    },
  },
  day: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 10,
    color: '#5f6368',
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: '16px',
  },
  list: {
    padding: 0,
    width: 'calc(100% - 16px) !important',
  },
}));
