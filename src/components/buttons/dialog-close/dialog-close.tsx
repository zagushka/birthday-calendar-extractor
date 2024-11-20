import { Button } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { t } from '../../../filters/translate';
import { handleCloseModal } from '../../modals/modals.lib';

export const DialogCloseButton: FunctionComponent = () => (
  <Button
    size="small"
    color="primary"
    variant="text"
    onClick={handleCloseModal}
  >
    {t('CLOSE_BUTTON_TITLE')}
  </Button>
);
