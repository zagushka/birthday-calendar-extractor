import {
  makeStyles,
  Theme,
} from '@material-ui/core';

export const useDayRowStyles = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.info.contrastText,
    borderRadius: 4,
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: 6,
    backgroundColor: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightBold,
    '&.active': {
      // backgroundColor: theme.palette.success.dark,
      backgroundColor: theme.palette.secondary.main,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

export const useDayListStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: 0,
    width: 'calc(100% - 16px) !important',
  },
  dayTitle: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 10,
    color: theme.palette.grey['700'],
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: '16px',
    textTransform: 'capitalize',
  },
}));
