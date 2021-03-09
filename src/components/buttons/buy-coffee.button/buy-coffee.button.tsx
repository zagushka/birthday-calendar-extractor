import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
} from '@material-ui/core';
import { FreeBreakfast } from '@material-ui/icons';
import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import handleLink from '../../../filters/handleLink';
import { translateString } from '../../../filters/translateString';

interface BuyCoffeeButtonProps extends ButtonProps {
  withIcon?: boolean;
}

const BuyCoffeeButton: FunctionComponent<BuyCoffeeButtonProps> = (props) => {
  const {withIcon = false, ...parentProps} = props;
  const [title, setTitle] = useState<string>();

  useEffect(() => {
    setTitle(
      translateString(withIcon ? 'BUY_ME_COFFEE_TITLE_SHORT' : 'BUY_ME_COFFEE_TITLE'),
    );
  }, [withIcon]);

  return (
    <Button
      onClick={() => handleLink('BUY_ME_COFFEE_LINK', {close: true, active: true})}
      endIcon={withIcon ? <FreeBreakfast/> : null}
      {...parentProps}
    >
      {title}
    </Button>
  );
};

export const BuyCoffeeIconButton: FunctionComponent<IconButtonProps> = (props) => {
  return (
    <IconButton
      {...props}
      onClick={() => handleLink('BUY_ME_COFFEE_LINK', {close: true, active: true})}
    >
      <FreeBreakfast/>
    </IconButton>
  );
};

export default BuyCoffeeButton;
