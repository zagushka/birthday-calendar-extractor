import React from 'react';
import {
  Button,
  Modal,
  ModalProps,
} from 'react-bootstrap';
import translate from '../../filters/translate';

export default class DoneModal extends React.Component<ModalProps, any> {
  // @TODO ADD DESCRIPTION REGARDING OUTLOOK EVENTS REMOVAL ISSUES
  render() {
    return <Modal
      size='sm'
      centered
      id='DONE'
    >
      <Modal.Header>
        {translate('DONE_TITLE')}
      </Modal.Header>
      <Modal.Body>
        <p>{translate('DONE_DESCRIPTION')}</p>
      </Modal.Body>

      <Modal.Footer>
        {/*<leave-feedback-button/>*/}
        <Button
          variant='success'
          size='sm'
          onClick={this.props.onHide}
        > Ok</Button>
      </Modal.Footer>
    </Modal>;
  }
}
