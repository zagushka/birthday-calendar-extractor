import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { WIZARD_NAMES } from '../constants';
import { SettingsContext } from '../context/settings.context';
import ActionAccordion, { ActionAccordionInterface } from './action-accordion';
import CsvGeneratorWizard from './wizards/csv';
import DeleteIcsGeneratorWizard from './wizards/delete-ics';
import IcsGeneratorWizard from './wizards/ics';
import TodayBirthdayWizard from './wizards/today-birthday';

const SelectWizard: FunctionComponent = () => {
  const {action, setAction} = useContext(SettingsContext);

  const handleChange = (selectedAction: keyof typeof WIZARD_NAMES) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    const newAction = isExpanded ? selectedAction : null;
    setAction(newAction);
  };

  const attributes = (ac: keyof typeof WIZARD_NAMES): ActionAccordionInterface => ({
    onChange: handleChange,
    currentAction: action,
    action: ac,
  });

  return (
    <>
      <ActionAccordion {...attributes(WIZARD_NAMES.ENABLE_BADGE)} >
        <TodayBirthdayWizard/>
      </ActionAccordion>

      <ActionAccordion {...attributes(WIZARD_NAMES.CREATE_ICS)}>
        <IcsGeneratorWizard/>
      </ActionAccordion>

      <ActionAccordion  {...attributes(WIZARD_NAMES.CREATE_DELETE_ICS)}>
        <DeleteIcsGeneratorWizard/>
      </ActionAccordion>

      <ActionAccordion  {...attributes(WIZARD_NAMES.CREATE_CSV)}>
        <CsvGeneratorWizard/>
      </ActionAccordion>
    </>
  );
};

export default SelectWizard;
