import { Button, Dialog, DialogActions, DialogContent, Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { t } from "@/filters/translate";
import { ShowModalAction } from "@/libs/events/types";
import { DialogCloseButton } from "@/components/buttons/dialog-close/dialog-close";
import { DialogTitle, handleCloseModal, handleLinkClickAndCloseModal } from "@/components/modals/modals.lib";

const GeneralErrorModal: FunctionComponent<{ error: ShowModalAction }> = ({ error }) => {
  const handleReportBugClick = () => {
    handleLinkClickAndCloseModal("REPORT_A_BUG_URL");
  };

  return (
    <Dialog open onClose={handleCloseModal}>
      <DialogTitle>{t("ERROR_HEADER")}</DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="textSecondary" paragraph>
          {t(error.type)}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button size="small" color="primary" variant="contained" onClick={handleReportBugClick}>
          {t("REPORT_A_BUG_TITLE")}
        </Button>
        <DialogCloseButton />
      </DialogActions>
    </Dialog>
  );
};

export default GeneralErrorModal;
