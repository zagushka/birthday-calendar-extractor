import { makeStyles, Theme } from "@material-ui/core";

export const useDayRowStyles = makeStyles((theme: Theme) => ({
  listItemSecondaryAction: {
    visibility: "hidden",
    "&.hidden": {
      visibility: "inherit",
    },
  },
  listItem: {
    borderRadius: 4,
    marginBottom: theme.spacing(0.25),
    // paddingTop: 6,
    backgroundColor: theme.palette.primary.main,
    "&.active": {
      backgroundColor: theme.palette.secondary.main,
    },
    "&:hover $listItemSecondaryAction": {
      visibility: "inherit",
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  listItemText: {
    color: theme.palette.info.contrastText,
  },
  icon: {
    color: theme.palette.info.contrastText,
  },
  dense: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

export const useDayListStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: 0,
    width: "calc(100% - 16px) !important",
  },
  dayTitle: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 10,
    color: theme.palette.grey["700"],
    fontFamily: theme.typography.fontFamily,
    // fontWeight: theme.typography.fontWeightMedium,
    lineHeight: "16px",
    textTransform: "capitalize",
  },
}));
