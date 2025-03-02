import React, { FunctionComponent, useContext, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { isDevelopment, WIZARD_NAMES } from "@/constants";
import { CurrentStatusContext } from "@/context/current-status.context";
import { storeUserSettings } from "@/libs/storage/chrome.storage";
import Calendar from "@/components/calendar/calendar";
import DevTools from "@/components/dev-tools";
import { BottomMenu } from "@/components/bottom-navigation/bottom-navigation";
import Layout from "@/components/layout/layout";
import SwitchModals from "@/components/modals/switch-modals";
import { Scan } from "@/components/scan/scan";
import SelectWizard from "@/components/wizards/select-wizard";

const UserSettings: FunctionComponent = () => {
  const { isActive, initDone, location: restoredLocation } = useContext(CurrentStatusContext);

  const location = useLocation();

  /**
   * Start storing new location to the storage
   * after initDone and restoredLocation been fetched
   */
  useEffect(() => {
    if (restoredLocation) {
      storeUserSettings({ location });
    }
  }, [location]);

  if (!initDone) {
    return <></>;
  }

  return (
    <>
      <SwitchModals />
      <Layout.Wrapper>
        <Routes>
          <Route
            path="/"
            element={
              restoredLocation.pathname === "/" ? (
                <Navigate to="calendar" replace />
              ) : (
                <Navigate to={restoredLocation} replace />
              )
            }
          />
          <Route path="activate" element={<Scan />} />

          {isActive && (
            <Route path="export">
              <Route path=":action" element={<SelectWizard />} />
              <Route path="" element={<Navigate to={`/export/${WIZARD_NAMES.CREATE_ICS}`} replace />} />
            </Route>
          )}

          <Route path="calendar" element={isActive ? <Calendar /> : <Navigate to="/activate" replace />} />

          {isDevelopment && <Route path="dev-tools" element={<DevTools />} />}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Layout.Footer>
          <BottomMenu />
        </Layout.Footer>
      </Layout.Wrapper>
    </>
  );
};

export default UserSettings;
