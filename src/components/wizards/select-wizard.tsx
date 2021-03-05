import { Box } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import {
  generatePath,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { WIZARD_NAMES } from '../../constants';
import { translateString } from '../../filters/translateString';
import ActionAccordion, { ActionAccordionInterface } from '../action-accordion';
import Layout from '../layout/layout';
import CsvGeneratorWizard from './csv/csv';
import DeleteIcsGeneratorWizard from './delete-ics/delete-ics';
import IcsGeneratorWizard from './ics/ics';

const SelectWizard: FunctionComponent = () => {
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
    <>
      <Layout.Header>
        {translateString('SELECT_EXPORT_FORMAT')}
      </Layout.Header>

      <Layout.Content pt={1} pr={1}>
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
    </>
  );
};

export default SelectWizard;
