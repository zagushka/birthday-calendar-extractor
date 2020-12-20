import React from 'react';
import {
  Button,
  Modal,
  ModalProps,
} from 'react-bootstrap';

import { translate } from '../../filters/translate';

export default class NoTokenDetectedModal extends React.Component<ModalProps, any> {
  render() {
    return <Modal
      size='sm'
      centered
      id='NO_TOKEN_DETECTED'
    >
      <Modal.Header>
        {translate('ERROR_HEADER')}
      </Modal.Header>
      <Modal.Body>
        <p>{translate('NO_TOKEN_DETECTED')}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          size='sm'
          className='ml-auto'
          variant='primary'
        >{translate('LOG_INTO_FACEBOOK_TITLE')}</Button>

        <Button size='sm' onClick={this.props.onHide}> Close</Button>
      </Modal.Footer>
    </Modal>;
  }
}
