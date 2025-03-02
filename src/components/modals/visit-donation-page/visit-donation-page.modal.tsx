import { DialogCloseButton } from "@/components/buttons/dialog-close/dialog-close";
import { DialogTitle, handleCloseModal } from "@/components/modals/modals.lib";
import handleLink from "@/filters/handleLink";
import { t } from "@/filters/translate";
import { translateString } from "@/filters/translateString";
import { storeUserSettings } from "@/libs/storage/chrome.storage";
import { Dialog, DialogActions, DialogContent, Link, TextField, Typography } from "@material-ui/core";
import { DateTime } from "luxon";
import React, { FunctionComponent } from "react";

declare global {
  interface Array<T> {
    partition(callback: (item: T) => boolean): [T[], T[]];

    uniques(criteria: () => boolean): T[];
  }
}
const VisitDonationPageModal: FunctionComponent<{
  sourceText?: string
}> = () => {

  const onKeywordChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const lines = event.target.value?.toLowerCase();
    const keywords = translateString("VISIT_DONATION_MODAL_KEYWORD").toLowerCase();
    if (keywords.split(" ").includes(lines)) {
      // Success, proceed to the download page
      await storeUserSettings({ donationPageVisited: DateTime.now() });
      await handleCloseModal();
    }
  };

  const openAKeywordPage = async () => {
    await handleLink("VISIT_DONATION_MODAL_LINK", { close: false, active: true });
  }

  return (
    <Dialog
      open={true}
      onClose={handleCloseModal}
    >
      <DialogTitle>
        {t("VISIT_DONATION_MODAL_TITLE")}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="textPrimary">
          {t("VISIT_DONATION_MODAL_MORE_INFO")}
        </Typography>
        <Link
          href="#"
          onClick={() => openAKeywordPage()}
        >
          {t("VISIT_DONATION_MODAL_SUBMIT_BUTTON_TITLE")}
        </Link>
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          placeholder={translateString("VISIT_DONATION_MODAL_INPUT_PLACEHOLDER")}
          onChange={onKeywordChange}
        />
      </DialogContent>

      <DialogActions>
        <DialogCloseButton/>
      </DialogActions>

    </Dialog>
  );
};

export default VisitDonationPageModal;
