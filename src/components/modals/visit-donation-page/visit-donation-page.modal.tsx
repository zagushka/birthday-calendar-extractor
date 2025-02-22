import handleLink from "@/filters/handleLink";
import { translateString } from "@/filters/translateString";
import { storeUserSettings } from "@/libs/storage/chrome.storage";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent, Input,
  Typography,
} from '@material-ui/core';
import { DateTime } from "luxon";
import React, { FunctionComponent, useRef, useState, } from 'react';
import { t } from '@/filters/translate';
import { DialogCloseButton } from '@/components/buttons/dialog-close/dialog-close';
import { DialogTitle, handleCloseModal, } from '@/components/modals/modals.lib';

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
    await handleLink('VISIT_DONATION_MODAL_LINK', { close: false, active: true });
  }

  return (
    <Dialog
      open={true}
      onClose={handleCloseModal}
    >
      <DialogTitle>
        {t('VISIT_DONATION_MODAL_TITLE')}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="textSecondary">
          {t('VISIT_DONATION_MODAL_DESCRIPTION')}
          <p> {t('VISIT_DONATION_MODAL_MORE_INFO_BUTTON_TITLE')}</p>
          {t('VISIT_DONATION_MODAL_MORE_INFO')}
          {/*{t('VISIT_DONATION_MODAL_DESCRIPTION')}*/}
        </Typography>
        <Input
          fullWidth
          margin="none"
          placeholder={translateString('VISIT_DONATION_MODAL_TITLE')}
          onChange={onKeywordChange}
        />
      </DialogContent>

      <DialogActions>
        <Button
          size="small"
          color="primary"
          variant="contained"
          onClick={() => openAKeywordPage()}
        >
          {t('VISIT_DONATION_MODAL_SUBMIT_BUTTON_TITLE')}
        </Button>
        <DialogCloseButton/>
      </DialogActions>

    </Dialog>
  );
};

export default VisitDonationPageModal;
