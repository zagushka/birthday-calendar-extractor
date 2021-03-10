import {
  List,
  ListItem,
} from '@material-ui/core';
import { DateTime } from 'luxon';
import React, {
  FunctionComponent,
  memo,
  NamedExoticComponent,
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
  user: RestoredBirthday,
}

const DayRow: FunctionComponent<DayRowProps> = (props) => {
  const classes = useDayRowStyles(props);
  const {user} = props;
  return (<ListItem className={classes.root} button key={user.href} onClick={handleClick(user.href)}>
    {user.name}
  </ListItem>);
};

export const DayList: NamedExoticComponent<ListChildComponentProps> = memo(({data, index, style}) => {
  const classes = useDayListStyles();
  const [dayMils, users]: [number, Array<RestoredBirthday>] = data[index] as [number, Array<RestoredBirthday>];
  const active = DateTime.local().ordinal === DateTime.fromMillis(dayMils).ordinal;
  return (
    <List className={classes.root}
          dense style={style}
    >
      <div className={classes.dayTitle}>
        {asLongDate(dayMils)}
      </div>
      {users.map((user, key) =>
        <DayRow
          user={user}
          key={key}
          classes={{root: active ? 'active' : null}}
        />,
      )}
    </List>
  );
});
