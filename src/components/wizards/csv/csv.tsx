import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import update from 'immutability-helper';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { LoadingContext } from '../../../context/loading.context';
import {
  CsvDateFormats,
  SettingsContext,
} from '../../../context/settings.context';
import { translate } from '../../../filters/translate';
import { translateString } from '../../../filters/translateString';
import { createCalendarCsv } from '../../../libs/events/actions';
import { sendMessage } from '../../../libs/events/events';

const CsvGeneratorWizard: FunctionComponent = (props) => {
  const {startLoading, stopLoading} = useContext(LoadingContext);
  const {wizards, setWizards} = useContext(SettingsContext);

  const startGeneration = () => {
    const loaderName = startLoading();
    sendMessage(
      createCalendarCsv(wizards.csv.format),
    )
      .subscribe(() => stopLoading(loaderName));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value as CsvDateFormats;
    const newState = update(wizards, {csv: {format: {$set: value}}});
    setWizards(newState);
  };

  return (
    <Box flexDirection='column' display='flex'>
      <Box pb={1}>
        {translate('FILE_FORMAT_CSV_DESCRIPTION')}
      </Box>
      <FormControl size='small' component='fieldset'>
        <FormLabel component='legend'>{translateString('CREATE_CSV_SETTINGS_DATE_FORMAT')}</FormLabel>
        <RadioGroup row name='date-format' value={wizards.csv.format} onChange={handleChange}>
          <FormControlLabel
            value='dd/LL/yyyy'
            control={<Radio size='small'/>}
            label={translateString('CREATE_CSV_SETTINGS_DATE_FORMAT_DAY_MONTH')}/>
          <FormControlLabel
            value='LL/dd/yyyy'
            control={<Radio size='small'/>}
            label={translateString('CREATE_CSV_SETTINGS_DATE_FORMAT_MONTH_DAY')}/>
        </RadioGroup>
      </FormControl>
      <Box display='flex' justifyContent='flex-end'>
        <Button size='small' variant='contained' color='primary' onClick={startGeneration}>{translateString('GENERATE')}</Button>
      </Box>
    </Box>
  );
};

export default CsvGeneratorWizard;
