import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { ACTIONS_SET } from '../constants';
import { SettingsContext } from '../context/settings.context';
import ActionAccordion, { ActionAccordionInterface } from './action-accordion';
import CsvGeneratorWizard from './wizards/csv';
import DeleteIcsGeneratorWizard from './wizards/delete-ics';
import IcsGeneratorWizard from './wizards/ics';
import TodayBirthdayWizard from './wizards/today-birthday';

const SelectWizard: FunctionComponent = () => {
  const {action, setAction} = useContext(SettingsContext);

  const handleChange = (selectedAction: ACTIONS_SET) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    const newAction = isExpanded ? selectedAction : null;
    setAction(newAction);
  };

  const attributes = (ac: ACTIONS_SET): ActionAccordionInterface => ({
    onChange: handleChange,
    currentAction: action,
    action: ac,
  });

  return (
    <>
      <ActionAccordion {...attributes(ACTIONS_SET.ENABLE_BADGE)} >
        <TodayBirthdayWizard/>
      </ActionAccordion>

      <ActionAccordion {...attributes(ACTIONS_SET.SELECT_FILE_FORMAT_ICS)}>
        <IcsGeneratorWizard/>
      </ActionAccordion>

      <ActionAccordion  {...attributes(ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS)}>
        <DeleteIcsGeneratorWizard/>
      </ActionAccordion>

      <ActionAccordion  {...attributes(ACTIONS_SET.SELECT_FILE_FORMAT_CSV)}>
        <CsvGeneratorWizard/>
      </ActionAccordion>
    </>
  );
};

export default SelectWizard;
