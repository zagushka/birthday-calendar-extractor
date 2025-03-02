import { createTheme, ThemeOptions, ThemeProvider } from "@material-ui/core/styles";
import React, { FunctionComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Analytics from "@/libs/analytics";
import usePageTracking from "@/libs/hooks/use-page-tracking";
import { retrieveUserSettings } from "@/libs/storage/chrome.storage";
import { updateStatisticsAdd } from "@/libs/storage/statistics";
import UserSettings from "@/components/user-settings/user-settings";
import CurrentStatusContextProvider from "@/context/current-status.context";
import LoadingContextProvider from "@/context/loading.context";
import "@/popup/App.scss";

export const themeOptions: ThemeOptions = {
  palette: {
    type: "light",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
  props: {
    MuiTypography: {
      variantMapping: {
        body1: "span",
        body2: "span",
      },
    },
    MuiButton: {
      size: "small",
    },
    MuiButtonGroup: {
      size: "small",
    },
    MuiCheckbox: {
      size: "small",
    },
    MuiFab: {
      size: "small",
    },
    MuiFormControl: {
      margin: "dense",
      size: "small",
    },
    MuiFormHelperText: {
      margin: "dense",
    },
    MuiIconButton: {
      size: "small",
    },
    MuiInputBase: {
      margin: "dense",
    },
    MuiInputLabel: {
      margin: "dense",
    },
    MuiRadio: {
      size: "small",
    },
    MuiSwitch: {
      size: "small",
    },
    MuiTextField: {
      margin: "dense",
      size: "small",
    },
    MuiList: {
      dense: true,
    },
    MuiMenuItem: {
      dense: true,
    },
    MuiTable: {
      size: "small",
    },
  },
};

const theme = createTheme(themeOptions);

const App: FunctionComponent = () => {
  usePageTracking();
  const location = useLocation();

  useEffect(() => {
    // Establish connection to the background script
    const port = chrome.runtime.connect();

    async function asyncFunction() {
      await updateStatisticsAdd("timesOpened");
      const { statistics } = await retrieveUserSettings(["statistics"]);
      Analytics.fireEvent("popup_opened", {
        page_location: location.pathname + location.search,
        times_opened: statistics.timesOpened,
      });
    }

    asyncFunction();

    return () => {
      if (port) {
        // Clean up connection when the component unmounts
        port.disconnect();
      }
    };
  }, []);

  return (
    <LoadingContextProvider>
      <CurrentStatusContextProvider>
        <ThemeProvider theme={theme}>
          <UserSettings />
        </ThemeProvider>
      </CurrentStatusContextProvider>
    </LoadingContextProvider>
  );
};

export default App;
