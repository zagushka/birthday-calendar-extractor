import React from 'react';
import {
  Button,
  Modal,
  ModalProps,
} from 'react-bootstrap';
import translateFilter from '../../filters/translate';

export default class DoneModal extends React.Component<ModalProps, any> {
  // @TODO ADD DESCRIPTION REGARDING OUTLOOK EVENTS REMOVAL ISSUES
  render() {
    return <Modal.Dialog
      size='sm'
      centered
      id='DONE'
    >
      <Modal.Header>
        {translateFilter('DONE_TITLE')}
      </Modal.Header>
      <Modal.Body>
        <p>{translateFilter('DONE_DESCRIPTION')}</p>
      </Modal.Body>

      <Modal.Footer>
        {/*<leave-feedback-button/>*/}
        <Button
          variant='success'
          size='sm'
          onClick={this.props.onHide}
        > Ok</Button>
      </Modal.Footer>
    </Modal.Dialog>;
  }
}
