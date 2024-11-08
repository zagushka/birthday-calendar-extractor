import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
  Zoom,
} from '@material-ui/core';
import { FreeBreakfast } from '@material-ui/icons';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CurrentStatusContext } from '../../../context/current-status.context';
import handleLink from '../../../filters/handleLink';
import { translateString } from '../../../filters/translateString';

interface BuyCoffeeButtonProps extends ButtonProps {
  withIcon?: boolean;
}

const BuyCoffeeButton: FunctionComponent<BuyCoffeeButtonProps> = (props) => {
  const { withIcon = false, ...parentProps } = props;
  const { isDonated } = useContext(CurrentStatusContext);
  const [title, setTitle] = useState<string>();

  useEffect(() => {
    setTitle(
      translateString(withIcon ? 'BUY_ME_COFFEE_TITLE_SHORT' : 'BUY_ME_COFFEE_TITLE'),
    );
  }, [withIcon]);

  return (
    !isDonated && (
    <Zoom in={!isDonated} style={{ transitionDelay: !isDonated ? '500ms' : '0ms' }}>
      <Button
        onClick={() => handleLink('BUY_ME_COFFEE_LINK', { close: true, active: true })}
        endIcon={withIcon ? <FreeBreakfast /> : null}
        {...parentProps}
      >
        {title}
      </Button>
    </Zoom>
    )
  );
};

export const BuyCoffeeIconButton: FunctionComponent<IconButtonProps> = (props) => (
  <IconButton
    {...props}
    onClick={() => handleLink('BUY_ME_COFFEE_LINK', { close: true, active: true })}
  >
    <FreeBreakfast />
  </IconButton>
);

export default BuyCoffeeButton;
