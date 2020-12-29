import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import handleLink from '../../filters/handleLink';
import { translate } from '../../filters/translate';
import { getLanguagesList } from '../../libs/lib';

interface ChangeLanguageModalProps {
  onHide: () => void;
  open?: boolean;
}

const ChangeLanguageModal: FunctionComponent<ChangeLanguageModalProps> = (props) => {
  const {onHide, open = true} = props;

  const handleClose = () => {
    onHide();
  };

  const languages = getLanguagesList().map(e => `<span class="badge badge-info">${e}</span>`).join(' ');

  return (

    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id='NOT_SUPPORTED_LANGUAGE'> {translate('NO_TOKEN_DETECTED')}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {translate('NOT_SUPPORTED_LANGUAGE', languages)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color='primary'
          onClick={(e) => handleLink(e, 'CHANGE_FACEBOOK_LANGUAGE_LINK', {close: true, active: true})}
        >
          {translate('CHANGE_FACEBOOK_LANGUAGE_LINK_TITLE')}
        </Button>
        <Button onClick={handleClose} color='primary' autoFocus>
          {translate('CLOSE')}
        </Button>
      </DialogActions>
    </Dialog>
  );

//   <Modal
//     size='sm'
//     centered
//     id='NOT_SUPPORTED_LANGUAGE'
//   >
//     <Modal.Header>
//       {translate('NOT_SUPPORTED_LANGUAGE', languages)}
//     </Modal.Header>
//     <Modal.Body>
//       <p>{translate('NO_TOKEN_DETECTED')}</p>
//     </Modal.Body>
//
//     <Modal.Footer>
//       <Button
//         size='sm'
//         className='ml-auto'
//         variant='primary'
//         onClick={(e) => handleLink(e, 'CHANGE_FACEBOOK_LANGUAGE_LINK', {close: true, active: true})}
//       >{translate('CHANGE_FACEBOOK_LANGUAGE_LINK_TITLE')}</Button>
//
//       <Button size='sm' onClick={this.props.onHide}> Close</Button>
//     </Modal.Footer>
//   </Modal>;
// );
};


export default ChangeLanguageModal;
