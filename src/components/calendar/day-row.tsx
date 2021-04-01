import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import {
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { DateTime } from 'luxon';
import React, {
  FunctionComponent,
  memo,
} from 'react';
import { ListChildComponentProps } from 'react-window';
import handleLink from '../../filters/handleLink';
import { RestoredBirthday } from '../../libs/storage/storaged.types';
import { asLongDate } from './calendar-tools';
import {
  useDayListStyles,
  useDayRowStyles,
} from './calendar.styles';

const handleClick = (href: string) => (e: React.MouseEvent) => handleLink(href, {}, e);

interface MUIClassesProp<TUseStyles extends () => unknown> {
  classes?: Partial<ReturnType<TUseStyles>>;
}

interface DayRowProps extends MUIClassesProp<typeof useDayRowStyles> {
  user: RestoredBirthday;
  toggleVisibility: (id: string, settings: number) => void;
}

const DayRow: FunctionComponent<DayRowProps> = (props) => {
  const classes = useDayRowStyles(props);
  const {user: {id, href, name, hidden}} = props;
  return (<ListItem button
                    key={href}
                    classes={{
                      container: classes.listItem,
                      dense: classes.dense,
                    }}
                    onClick={handleClick(href)}
  >
    <ListItemText primary={name} className={classes.listItemText}/>
    <ListItemSecondaryAction
      className={classes.listItemSecondaryAction}
    >
      <IconButton size='small' edge='end' className={classes.icon}
                  onClick={() => props.toggleVisibility(id, +!hidden)}>
        {hidden ? <VisibilityOff fontSize='small'/> : <Visibility fontSize='small'/>}
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>);
};

interface DayListProps extends ListChildComponentProps {
  data: {
    userGroup: Array<[number, Array<RestoredBirthday>]>;
    toggleStatus: (id: string, settings: number) => void;
  };
}

export const DayList = memo<DayListProps>(({data: {userGroup, toggleStatus}, index, style}) => {
  const classes = useDayListStyles();

  const [dayMils, users]: [number, Array<RestoredBirthday>] = userGroup[index];
  const active = DateTime.local().ordinal === DateTime.fromMillis(dayMils).ordinal;

  return (
    <List className={classes.root}
          dense style={style}
    >
      <div className={classes.dayTitle}>
        {asLongDate(dayMils)}
      </div>
      {users.map((user) =>
        <DayRow
          user={user}
          key={user.id}
          toggleVisibility={toggleStatus}
          classes={{
            listItem: active ? 'active' : null,
            listItemSecondaryAction: user.hidden ? 'hidden' : null,
          }}
        />,
      )}
    </List>
  );
});
