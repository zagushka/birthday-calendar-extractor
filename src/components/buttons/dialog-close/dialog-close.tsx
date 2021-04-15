import { Button } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { translate } from '../../../filters/translate';
import { handleCloseModal } from '../../modals/modals.lib';

export const DialogCloseButton: FunctionComponent = () => {
  return (
    <Button size="small"
            color="primary"
            variant="text"
            onClick={handleCloseModal}
    >
      {translate('CLOSE_BUTTON_TITLE')}
    </Button>
  );
};
