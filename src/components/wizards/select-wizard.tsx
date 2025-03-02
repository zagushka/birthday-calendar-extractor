import React, { FunctionComponent } from "react";
import { generatePath, useNavigate, useMatch } from "react-router-dom";
import { WIZARD_NAMES } from "@/constants";
import { translateString } from "@/filters/translateString";
import ActionAccordion, { ActionAccordionInterface } from "../action-accordion";
import Layout from "../layout/layout";
import CsvDataGeneratorWizard from "./csv-data/csv-data";
import DeleteIcsGeneratorWizard from "./delete-ics/delete-ics";
import IcsGeneratorWizard from "./ics/ics";

type ActionTypes = (typeof WIZARD_NAMES)[keyof typeof WIZARD_NAMES];

const SelectWizard: FunctionComponent = () => {
  const {
    params: { action },
  } = useMatch("/export/:action");
  const navigate = useNavigate();

  const handleChange = (selectedAction: ActionTypes) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    if (isExpanded) {
      navigate(generatePath("/export/:action", { action: selectedAction }), { replace: true });
    }
  };

  const attributes = (ac: ActionTypes): ActionAccordionInterface => ({
    onChange: handleChange,
    currentAction: action as ActionTypes,
    action: ac,
  });

  return (
    <>
      <Layout.Header>{translateString("SELECT_EXPORT_FORMAT")}</Layout.Header>

      <Layout.Content pt={1} pr={1}>
        <ActionAccordion {...attributes(WIZARD_NAMES.CREATE_ICS)}>
          <IcsGeneratorWizard />
        </ActionAccordion>

        <ActionAccordion {...attributes(WIZARD_NAMES.CREATE_DELETE_ICS)}>
          <DeleteIcsGeneratorWizard />
        </ActionAccordion>

        {/* <ActionAccordion  {...attributes(WIZARD_NAMES.CREATE_CSV)}> */}
        {/*  <CsvGeneratorWizard/> */}
        {/* </ActionAccordion> */}

        <ActionAccordion {...attributes(WIZARD_NAMES.CREATE_CSV_DATA)}>
          <CsvDataGeneratorWizard />
        </ActionAccordion>
      </Layout.Content>
    </>
  );
};

export default SelectWizard;
