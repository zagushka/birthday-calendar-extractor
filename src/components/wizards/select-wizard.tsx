import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { WIZARD_NAMES } from '../../constants';
import { SettingsContext } from '../../context/settings.context';
import { translateString } from '../../filters/translateString';
import ActionAccordion, { ActionAccordionInterface } from '../action-accordion';
import Layout from '../layout/layout';
import CsvGeneratorWizard from './csv/csv';
import DeleteIcsGeneratorWizard from './delete-ics/delete-ics';
import IcsGeneratorWizard from './ics/ics';

const SelectWizard: FunctionComponent = () => {
  const {action, setAction} = useContext(SettingsContext);

  const handleChange = (selectedAction: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES]) =>
    (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      const newAction = isExpanded ? selectedAction : null;
      setAction(newAction);
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
    </Layout.Wrapper>
  );
};

export default SelectWizard;
