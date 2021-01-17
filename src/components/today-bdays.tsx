import {
  Button,
  List,
  ListItem,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { DateTime } from 'luxon';
import React, {
  FunctionComponent,
  memo,
  NamedExoticComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ErrorsContext } from '../context/errors.context';
import { TodayUsersContext } from '../context/today-users.context';
import handleLink from '../filters/handleLink';
import { translate } from '../filters/translate';
import { RestoredBirthday } from '../libs/storage/chrome.storage';

import {
  VariableSizeList,
  ListChildComponentProps,
} from 'react-window';

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    color: '#fff',
    borderRadius: 4,
    marginBottom: 8,
    paddingLeft: 8,
    paddingTop: 6,
    backgroundColor: theme.palette.action.active,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightBold,
    '&:hover': {
      backgroundColor: theme.palette.action.active,
    },
  },
  day: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 10,
    display: 'inline-block',
    color: theme.palette.action.active,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: '16px',
  },
  list: {
    padding: 0,
  },
}));

const handleClick = (href: string) => (e: React.MouseEvent) => handleLink(e, href);

const DayRow: NamedExoticComponent<ListChildComponentProps> = memo(({data, index, style}) => {
  const classes = useStyles();
  const [dayMils, users]: [number, Array<RestoredBirthday>] = data[index] as [number, Array<RestoredBirthday>];
  return (
    <List className={classes.list} dense style={style}>
      <div className={classes.day}>
        {DateTime.fromMillis(dayMils).toLocaleString({weekday: 'short', month: 'short', day: 'numeric'})}
      </div>
      {users.map(user => <ListItem className={classes.item} button key={user.href} onClick={handleClick(user.href)}>
        {user.name}
      </ListItem>)}
    </List>
  );
});

const TodayBirthdays: FunctionComponent = () => {
  const {users, isActive} = useContext(TodayUsersContext);
  const [dayIndex, setDayIndex] = useState<number>(0);

  // tslint:disable-next-line:max-line-length
  const [groupedUsers, setGroupedUsers] = useState<{ users: Array<[number, Array<RestoredBirthday>]>; itemsMap: Array<{ ordinal: number; height: number }> }>({
    users: [],
    itemsMap: [],
  });

  const listRef = useRef<VariableSizeList>();

  const classes = useStyles();

  useEffect(() => {
    const dayHeaderHeight = 38;
    const userRowHeight = 32;
    // Prepare birthdays
    const grouped =
      Array.from(
        users
          // Sort birthdays by user name
          .sort((a, b) => a.name.localeCompare(b.name))
          // create Map with birthday date as a key (unix time stamp) and array of users as value
          .reduce((ac, user) => ac.set(user.start.toMillis(), [...(ac.get(user.start.toMillis()) ?? []), user])
            , new Map<number, Array<RestoredBirthday>>(),
          ),
        )
        // Sort days
        .sort((a, b) => a[0] - b[0]);


    const itemsMap = grouped.map(([day, items]) => ({
      // Map ordinal of the day to its index in final array
      ordinal: DateTime.fromMillis(day).ordinal,
      // Lets calculate the height for each day
      height: dayHeaderHeight + items.length * userRowHeight,
    }));

    setGroupedUsers({users: grouped, itemsMap});

  }, [users]);

  useEffect(() => {
    if (dayIndex) {
      listRef.current.scrollToItem(dayIndex, 'start');
    }
  }, [dayIndex]);

  const {error} = useContext(ErrorsContext);

  if (!isActive) {
    // Show button to activate
  } else {
    // Show navigation
    if (users.length) {
      // Display list of birthdays today
    } else {
      // Display "no birthdays today"
    }
    // Show button to deactivate
  }

  return (<div className='m-2' style={{minHeight: '80px'}}>

    {!!groupedUsers.users.length && <>
      <Button onClick={() => setDayIndex(dayIndex - 1 < 0 ? groupedUsers.users.length - 1 : dayIndex - 1)}> &lt; </Button>
      {DateTime.fromMillis(groupedUsers.users[dayIndex][0]).toLocaleString({weekday: 'short', month: 'short', day: '2-digit'})}
      <Button onClick={() => setDayIndex(dayIndex + 1 === groupedUsers.users.length ? 0 : dayIndex + 1)}> &gt; </Button>
    </>}

    {!users.length && isActive && <p>
      <strong>{translate('TODAY_NO_BIRTHDAYS_TITLE')}</strong>
    </p>}
    <VariableSizeList
      itemSize={i => groupedUsers.itemsMap[i].height}
      itemData={groupedUsers.users}
      ref={listRef}
      height={400}
      width={300}
      itemCount={groupedUsers.users.length}>
      {DayRow}
    </VariableSizeList>
  </div>);
};

export default TodayBirthdays;
