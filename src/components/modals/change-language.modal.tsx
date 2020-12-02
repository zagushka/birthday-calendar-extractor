import React from 'react';
import {
  Button,
  Modal,
  ModalProps,
} from 'react-bootstrap';
import translateFilter from '../../filters/translate';
import { getLanguagesList } from '../../libs/lib';

export default class ChangeLanguageModal extends React.Component<ModalProps, any> {
  languages = getLanguagesList().map(e => `<span class="badge badge-info">${e}</span>`).join(' ');

  render() {
    return <Modal.Dialog
      size='sm'
      centered
      id='NOT_SUPPORTED_LANGUAGE'
    >
      <Modal.Header>
        {translateFilter('NOT_SUPPORTED_LANGUAGE', this.languages)}
      </Modal.Header>
      <Modal.Body>
        <p>{translateFilter('NO_TOKEN_DETECTED')}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          size='sm'
          className='ml-auto'
          variant='primary'
          // v-link.close.active="'CHANGE_FACEBOOK_LANGUAGE_LINK'"
        >{translateFilter('CHANGE_FACEBOOK_LANGUAGE_LINK_TITLE')}</Button>

        <Button size='sm' onClick={this.props.onHide}> Close</Button>
      </Modal.Footer>
    </Modal.Dialog>;
  }
}
