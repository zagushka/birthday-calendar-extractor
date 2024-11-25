import Analytics from "@/libs/analytics";
import { updateStatisticsAdd } from "@/libs/storage/statistics";
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
import handleLink from '@/filters/handleLink';
import { RestoredBirthday } from '@/libs/storage/storaged.types';
import { asLongDate } from '@/components/calendar/calendar-tools';
import {
  useDayListStyles,
  useDayRowStyles,
} from './calendar.styles';

interface MUIClassesProp<TUseStyles extends () => unknown> {
  classes?: Partial<ReturnType<TUseStyles>>;
}

interface DayRowProps extends MUIClassesProp<typeof useDayRowStyles> {
  user: RestoredBirthday;
  toggleVisibility: (id: string, state: "on" | "off") => void;
}

/**
 * Calculate the shortest distance to the birthday, considering year transition
 */
function daysOffsetTo({ day, month }: { month: number, day: number; }): number {
  const today = DateTime.local();
  const birthday = DateTime.fromObject({ day, month });
  const dayOffsets = [
    birthday.diff(today, 'days').days,
    birthday.diff(today.plus({ year: 1 }), 'days').days,
    birthday.diff(today.minus({ year: 1 }), 'days').days
  ];
  // Find the index of the min absolute value from the offsets
  return dayOffsets.sort((a, b) => Math.abs(a) - Math.abs(b)).at(0);
}

const DayRow: FunctionComponent<DayRowProps> = (props) => {
  const classes = useDayRowStyles(props);
  const {
    user: {
      id, href, name, hidden, birthdate
    },
  } = props;

  const handleClick = async (e: React.MouseEvent) => {
    await Analytics.fireButtonClickEvent("friend_birthday", "/calendar", {
      day_offset: daysOffsetTo(birthdate),
    });
    await updateStatisticsAdd("followedBirthdayLinks");
    await handleLink(href, {}, e);
  }

  return (
    <ListItem
      button
      key={href}
      classes={{
        container: classes.listItem,
        dense: classes.dense,
      }}
      onClick={handleClick}
    >
      <ListItemText primary={name} className={classes.listItemText}/>
      <ListItemSecondaryAction
        className={classes.listItemSecondaryAction}
      >
        <IconButton
          size="small"
          edge="end"
          className={classes.icon}
          onClick={() => props.toggleVisibility(id, hidden ? 'off' : 'on')}
        >
          {hidden ? <VisibilityOff fontSize="small"/> : <Visibility fontSize="small"/>}
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

type DayListProps = ListChildComponentProps<{
  userGroup: Array<[number, Array<RestoredBirthday>]>;
  toggleStatus: (id: string, state: "on" | "off") => void;
}>;

export const DayList = memo<DayListProps>(({ data: { userGroup, toggleStatus }, index, style }) => {
  const classes = useDayListStyles();

  const [dayMils, users]: [number, Array<RestoredBirthday>] = userGroup[index];
  const active = DateTime.local().ordinal === DateTime.fromMillis(dayMils).ordinal;

  return (
    <List
      className={classes.root}
      dense
      style={style}
    >
      <div className={classes.dayTitle}>
        {asLongDate(dayMils)}
      </div>
      {users.map((user) => (
        <DayRow
          user={user}
          key={user.id}
          toggleVisibility={toggleStatus}
          classes={{
            listItem: active ? 'active' : null,
            listItemSecondaryAction: user.hidden ? 'hidden' : null,
          }}
        />
      ))}
    </List>
  );
});
