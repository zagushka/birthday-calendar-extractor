import { Button, CircularProgress, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { green, red } from "@material-ui/core/colors";
import { Done, Error, PlayArrow } from "@material-ui/icons";
import clsx from "clsx";

import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateStatisticsAdd } from "@/libs/storage/statistics";
import { retrieveUserSettings } from "@/libs/storage/chrome.storage";
import useRuntime from "@/libs/hooks/use-runtime";
import Analytics from "@/libs/analytics";
import { CurrentStatusContext } from "@/context/current-status.context";
import { t } from "@/filters/translate";
import { translateString } from "@/filters/translateString";
import { BirthdaysStartScan } from "@/libs/events/actions";
import { sendMessage } from "@/libs/events/events";
import { useWasOff, useWasOnOff } from "@/libs/hooks/on-and-offs.hook";
import { useScanLogListener } from "@/libs/hooks/scan-log-listener.hook";
import { FunnyMessagesToAvoidCruelReality } from "./funny-messages-to-avoid-cruel-reality";
import Layout from "../layout/layout";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing(1),
      position: "relative",
      alignSelf: "center",
    },
    buttonSuccess: {
      backgroundColor: green[500],
      "&:hover": {
        backgroundColor: green[700],
      },
    },
    buttonFail: {
      backgroundColor: red[500],
      "&:hover": {
        backgroundColor: red[700],
      },
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);

const funnyStringsToFakeCruelReality = JSON.parse(translateString("FUNNY_MESSAGES_TO_AVOID_REALITY"));

export const Scan: FunctionComponent = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { isScanning, isScanSucceed, isActive } = useContext(CurrentStatusContext);
  const [wasScanningAndDone, resetWasScanningAndDone] = useWasOnOff(isScanning);
  const scanTimeMsc = useRuntime(isScanning);

  const [wasActivated] = useWasOff(isActive);
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    setFirstTime(!wasActivated && isActive);
  }, [wasActivated]);

  // Redirect to the calendar page if the scan was successful
  useEffect(() => {
    async function asyncScanned() {
      await updateStatisticsAdd("scannedTimes");
      const { statistics } = await retrieveUserSettings(["statistics"]);
      await Analytics.fireEvent("scan_succeed", {
        scan_time: Math.round(scanTimeMsc),
        scanned_times: statistics.scannedTimes,
      });
      navigate("/calendar");
    }

    if (wasScanningAndDone && isScanSucceed) {
      asyncScanned();
    }
  }, [wasScanningAndDone, isScanSucceed]);

  const [[_log], resetLog] = useScanLogListener(1);

  const startScanHandler = () => {
    resetWasScanningAndDone();
    resetLog();
    sendMessage(BirthdaysStartScan());
  };

  const buttonClassname = clsx({
    [classes.buttonSuccess]: wasScanningAndDone && isScanSucceed,
    [classes.buttonFail]: wasScanningAndDone && !isScanSucceed,
  });

  return (
    <>
      <Layout.Header>{translateString("SCAN_PAGE_TITLE")}</Layout.Header>

      <Layout.Content>
        {/* Upper part */}
        <Box display="flex" textAlign="left" alignItems="flex-end" flexGrow={1} justifyContent="center" pl={1} pr={2}>
          <Typography variant="body1" gutterBottom>
            {t(firstTime ? "SCAN_PAGE_DESCRIPTION" : "SCAN_PAGE_FIRST_TIME_DESCRIPTION")}
          </Typography>
        </Box>

        {/* Button */}
        <Box display="flex" flexGrow={0} justifyContent="center">
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={buttonClassname}
              disabled={isScanning}
              onClick={startScanHandler}
              startIcon={wasScanningAndDone ? isScanSucceed ? <Done /> : <Error /> : <PlayArrow />}
            >
              {translateString("START_SCAN")}
            </Button>
            {isScanning && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </Box>

        {/* Bottom part */}
        <Box
          flexGrow={1}
          flexDirection="column"
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          {isScanning && (
            <>
              <Typography variant="body1" gutterBottom>
                <FunnyMessagesToAvoidCruelReality strings={funnyStringsToFakeCruelReality} />
              </Typography>
              {/* {_log && <Typography variant="body2" gutterBottom>({_log})</Typography>} */}
            </>
          )}
        </Box>
      </Layout.Content>
    </>
  );
};
