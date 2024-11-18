import {
  Button,
  Chip,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { DateTime } from 'luxon';
import React, { FunctionComponent, useRef, useState, } from 'react';
import { translate } from '../../../filters/translate';
import { updateStoredBirthdays } from "../../../libs/birthdays-scan";
import { RawScannedUser } from "../../../libs/events/executed-script.types";
import { DialogCloseButton } from '../../buttons/dialog-close/dialog-close';
import { DialogTitle, handleCloseModal, } from '../modals.lib';

declare global {
  interface Array<T> {
    partition(callback: (item: T) => boolean): [T[], T[]];

    uniques(criteria: () => boolean): T[];
  }
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

// Extend array with partition function
if (!Array.prototype.partition) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.partition = function partition<T>(this: T[], callback: (item: T) => boolean) {
    const [pass, fail]: [T[], T[]] = [[], []];
    this.forEach((item) => (callback(item) ? pass.push(item) : fail.push(item)));
    return [pass, fail];
  };
}

if (!Array.prototype.uniques) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.uniques = function uniques<T>(this: T[], callback: (item: T) => boolean) {
    return this.filter((item, index) => this.indexOf(item) === index);
  };
}

function userToFormattedBirthdate(user: RawScannedUser): string {
  return DateTime.fromObject({
    year: user.birthdate.year,
    month: user.birthdate.month,
    day: user.birthdate.day,
  }).toLocaleString();
}

function isUserHaveValidBirthdate(user: RawScannedUser): boolean {
  return DateTime.fromObject({
    year: user.birthdate.year,
    month: user.birthdate.month,
    day: user.birthdate.day,
  }).isValid;
}

const AddBirthdaysModal: FunctionComponent<{
  sourceText?: string
}> = ({ sourceText = '01/25/1978 Volodymyr Zelenskyy' }) => {
  const classes = useStyles();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [parsed, setParsed] = useState<RawScannedUser[]>([]);
  const [text, setText] = useState(sourceText);

  const removeBirthdate = (data: RawScannedUser) => {
    setParsed((old) => old.filter((item) => item !== data));
  };

  const onStoreNewUsers = async () => {
    await updateStoredBirthdays(parsed);
    setParsed([]);
  };

  const onSourceTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Check that there are more than one line in the text area
    const lines = event.target.value.split(/\n\r?/);
    // Remove last line, it could be not complete yet
    const last = lines.pop();
    const [valid, invalid] = lines
      .map<RawScannedUser>((line) => {
        // const [srcDate, name] = line.split(/(?<=^\S+)\s/);
        // Split the date and name based on the first space after the date
        const [datePart, name] = line.split(/ (.+)/);

        // Further split the date into month, day, and year
        const [month, day, year] = datePart.split('/');
        return {
          birthdate: {
            day: parseInt(day),
            month: parseInt(month),
            year: parseInt(year),
          },
          name,
          misc: {
            source: 'manual',
            original: line,
          },
          // Maybe we should use a real hash based on the line instead
          id: line.slice(0, 64),
        };
      })
      .partition(isUserHaveValidBirthdate);

    setParsed((old) => old.concat(valid));
    setText([...invalid.map((i) => i.misc.original), last].join('\n'));
  };

  return (
    <Dialog
      open={true}
      onClose={handleCloseModal}
    >
      <DialogTitle>
        {translate('ADD_BIRTHDAYS_HEADER')}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="textSecondary" paragraph>
          {translate('ADD_BIRTHDAYS_DESCRIPTION')}
        </Typography>
        <Paper component="ul" className={classes.root}>
          {parsed.map((data, index) => (
            <li key={index}>
              <Chip
                size="small"
                label={`${userToFormattedBirthdate(data)} ${data.name}`}
                onDelete={() => removeBirthdate(data)}
                className={classes.root}
              />
            </li>
          ))}
        </Paper>
        <TextField
          inputRef={textAreaRef}
          minRows={2}
          maxRows={2}
          fullWidth
          margin="none"
          value={text}
          multiline
          onChange={onSourceTextChange}
          variant="outlined"
        />
      </DialogContent>

      <DialogActions>
        <Button
          size="small"
          color="primary"
          variant="contained"
          onClick={() => {
            onStoreNewUsers();
          }}
        >
          {translate('ADD_BIRTHDAYS_BUTTON_TITLE')}
        </Button>
        <DialogCloseButton/>
      </DialogActions>

    </Dialog>
  );
};

export default AddBirthdaysModal;
