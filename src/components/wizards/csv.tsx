import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import update from 'immutability-helper';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { ACTIONS_SET } from '../../constants';
import { LoadingContext } from '../../context/loading.context';
import { SettingsContext } from '../../context/settings.context';
import { translate } from '../../filters/translate';
import { StartGenerationAction } from '../../libs/events/actions';
import { sendMessage } from '../../libs/events/events';

const CsvGeneratorWizard: FunctionComponent = (props) => {
  const {startLoading, stopLoading} = useContext(LoadingContext);
  const {wizards, setWizards} = useContext(SettingsContext);

  const startGeneration = () => {
    const loaderName = startLoading();
    sendMessage(new StartGenerationAction(ACTIONS_SET.SELECT_FILE_FORMAT_CSV))
      .subscribe(() => stopLoading(loaderName));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value as 'dd/mm' | 'mm/dd';
    const newState = update(wizards, {csv: {format: {$set: value}}});
    setWizards(newState);
  };
  return (
    <>
      {translate('FILE_FORMAT_CSV_DESCRIPTION')}
      <FormControl size='small' component='fieldset'>
        <FormLabel component='legend'>Date Format</FormLabel>
        <RadioGroup row name='date-format' value={wizards.csv.format} onChange={handleChange}>
          <FormControlLabel value='dd/mm' control={<Radio size='small'/>} label='Day/Month'/>
          <FormControlLabel value='mm/dd' control={<Radio size='small'/>} label='Month/Day'/>
        </RadioGroup>
      </FormControl>
      <Button size='small' variant='contained' color='primary' onClick={startGeneration}>NEXT</Button>
    </>
  );
};

export default CsvGeneratorWizard;