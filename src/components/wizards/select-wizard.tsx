import {
  Box,
  Button,
} from '@material-ui/core';
import { EventNote } from '@material-ui/icons';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import {
  generatePath,
  Link,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { WIZARD_NAMES } from '../../constants';
import { CurrentStatusContext } from '../../context/current-status.context';
import { translateString } from '../../filters/translateString';
import { useWasOnOff } from '../../libs/hooks/on-and-offs.hook';
import ActionAccordion, { ActionAccordionInterface } from '../action-accordion';
import { CustomTooltip } from '../custom-tooltip';
import Layout from '../layout/layout';
import CsvGeneratorWizard from './csv/csv';
import DeleteIcsGeneratorWizard from './delete-ics/delete-ics';
import IcsGeneratorWizard from './ics/ics';

const SelectWizard: FunctionComponent = () => {
  const {isActive, isScanSucceed, isScanning} = useContext(CurrentStatusContext);
  const [wasScanningAndDone] = useWasOnOff(isScanning);

  const {path, params: {action = WIZARD_NAMES.CREATE_ICS}} = useRouteMatch<{ action: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES] }>();
  const history = useHistory();

  const handleChange = (selectedAction: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES]) =>
    (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      history.replace(generatePath(path, {action: isExpanded ? selectedAction : undefined}));
    };

  const attributes = (ac: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES]): ActionAccordionInterface => ({
    onChange: handleChange,
    currentAction: action,
    action: ac,
  });

  return (
    <Layout.Wrapper>
      <Layout.Header>
        {translateString('SELECT_EXPORT_FORMAT')}
      </Layout.Header>

      <Layout.Content p={1}>
        <ActionAccordion {...attributes(WIZARD_NAMES.CREATE_ICS)}>
          <IcsGeneratorWizard/>
        </ActionAccordion>

        <ActionAccordion  {...attributes(WIZARD_NAMES.CREATE_DELETE_ICS)}>
          <DeleteIcsGeneratorWizard/>
        </ActionAccordion>

        <ActionAccordion  {...attributes(WIZARD_NAMES.CREATE_CSV)}>
          <CsvGeneratorWizard/>
        </ActionAccordion>
      </Layout.Content>

      {isActive && <Layout.Footer display={'flex'} justifyContent={'center'}>
        <Box>
          <CustomTooltip
            title={translateString('BUTTON_TO_CALENDAR_TOOLTIP')}
            defaultOpen={isScanSucceed && wasScanningAndDone}
          >
            <Button
              size='small'
              color='primary'
              variant={'outlined'}
              component={Link}
              to={'/calendar'}
              startIcon={<EventNote/>}
            >
              {translateString('BUTTON_TO_CALENDAR_TITLE')}
            </Button>
          </CustomTooltip>
        </Box>

      </Layout.Footer>}
    </Layout.Wrapper>
  );
};

export default SelectWizard;
