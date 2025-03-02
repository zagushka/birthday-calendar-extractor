import { Dialog, DialogActions, DialogContent, DialogContentText } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { t } from "@/filters/translate";
import { DialogCloseButton } from "@/components/buttons/dialog-close/dialog-close";
import ToExportButton from "@/components/buttons/to-export.button/to-export.button";
import ToCalendarButton from "@/components/buttons/to-calendar.button/to-calendar.button";
import { DialogTitle, handleCloseModal } from "@/components/modals/modals.lib";

const ScanSuccessModal: FunctionComponent = () => (
  // @TODO ADD DESCRIPTION REGARDING OUTLOOK EVENTS REMOVAL ISSUES
  <Dialog open onClose={handleCloseModal}>
    <DialogTitle>{t("MODAL_SCAN_SUCCESS_TITLE")}</DialogTitle>

    <DialogContent>
      <DialogContentText>{t("MODAL_SCAN_SUCCESS_DESCRIPTION")}</DialogContentText>
    </DialogContent>

    <DialogActions>
      <ToCalendarButton />
      <ToExportButton />
      <DialogCloseButton />
    </DialogActions>
  </Dialog>
);
export default ScanSuccessModal;
