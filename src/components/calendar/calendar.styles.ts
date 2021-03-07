import {
  makeStyles,
  Theme,
} from '@material-ui/core';

export const useBirthdaysListStyles = makeStyles((theme: Theme) => ({
  item: {
    color: theme.palette.info.contrastText,
    borderRadius: 4,
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: 6,
    backgroundColor: theme.palette.info.dark,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightBold,
    '&:hover': {
      backgroundColor: theme.palette.info.dark,
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
