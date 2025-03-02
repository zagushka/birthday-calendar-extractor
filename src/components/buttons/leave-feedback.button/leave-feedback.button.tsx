import { Button, makeStyles } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import React, { FunctionComponent } from "react";
import { useLocation } from "react-router-dom";
import handleLink from "@/filters/handleLink";
import { translateString } from "@/filters/translateString";
import Analytics from "@/libs/analytics";

const useStyles = makeStyles(() => ({
  success: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
}));

interface LeaveFeedbackButtonProps {
  onClick?: () => void;
}

const LeaveFeedbackButton: FunctionComponent<LeaveFeedbackButtonProps> = (props) => {
  const classes = useStyles();
  const location = useLocation();

  const handleClick = async (e: React.MouseEvent) => {
    await Analytics.fireButtonClickEvent("leave_feedback", location.pathname);

    if (props.onClick) {
      props.onClick();
    }

    await handleLink("LEAVE_FEEDBACK_LINK", { close: true, active: true }, e);
  };

  return (
    <Button size="small" color="primary" variant="contained" className={classes.success} onClick={handleClick}>
      {translateString("LEAVE_FEEDBACK_TITLE")}
    </Button>
  );
};

export default LeaveFeedbackButton;
