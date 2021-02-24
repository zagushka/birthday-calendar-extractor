import { Button } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import handleLink from '../../filters/handleLink';
import { translate } from '../../filters/translate';

const BuyCoffeeButton: FunctionComponent = () => {
  return (
    <Button
      onClick={(e) => handleLink(e, 'BUY_ME_COFFEE_LINK', {close: true, active: true})}
    >
      {translate('BUY_ME_COFFEE_TITLE')}
    </Button>
  );
};

export default BuyCoffeeButton;
