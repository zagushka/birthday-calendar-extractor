import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  makeStyles,
  Theme,
} from '@material-ui/core';
import {
  ChevronLeft,
  ChevronRight,
  Close,
  SaveAlt,
} from '@material-ui/icons';
import { DateTime } from 'luxon';
import React, {
  FunctionComponent,
  memo,
  NamedExoticComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Scrollbars from 'react-custom-scrollbars';

import {
  ListChildComponentProps,
  ListOnScrollProps,
  VariableSizeList,
} from 'react-window';
import { ErrorsContext } from '../context/errors.context';
import { TodayUsersContext } from '../context/today-users.context';
import handleLink from '../filters/handleLink';
import { RestoredBirthday } from '../libs/storage/chrome.storage';

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
    // display: 'inline-block',
    // color: theme.palette.action.active,
    color: '#5f6368',
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: '16px',
  },
  list: {
    padding: 0,
    width: 'calc(100% - 16px) !important',
  },
}));

const dayHeaderHeight = 38;
const userRowHeight = 32;

const handleClick = (href: string) => (e: React.MouseEvent) => handleLink(e, href);

interface CustomScrollbarsProps {
  onScroll: any;
  forwardedRef: any;
  style: any;
}

const CustomScrollbars: FunctionComponent<CustomScrollbarsProps> = ({onScroll, forwardedRef, style, children}) => {
  const refSetter = useCallback(scrollbarsRef => {
    if (scrollbarsRef) {
      forwardedRef(scrollbarsRef.view);
    } else {
      forwardedRef(null);
    }
  }, []);

  return (
    <Scrollbars
      ref={refSetter}
      style={{...style, overflow: 'hidden'}}
      onScroll={onScroll}
    >
      {children}
    </Scrollbars>
  );
};

const CustomScrollbarsVirtualList = React.forwardRef<unknown, CustomScrollbarsProps>((props, ref) => (
  <CustomScrollbars {...props} forwardedRef={ref}/>
));

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

interface UserMapInterface {
  users: Array<[number, Array<RestoredBirthday>]>;
  usersMap: Array<{ offset: number; ordinal: number; height: number }>;
}

const TodayBirthdays: FunctionComponent = () => {
  const {users: rawUsers, isActive} = useContext(TodayUsersContext);
  const [dayIndex, setDayIndex] = useState<number>(0);

  const [users, setUsers] = useState<UserMapInterface>({
    users: [],
    usersMap: [],
  });

  const listRef = useRef<VariableSizeList>();

  const classes = useStyles();

  useEffect(() => {
    // Prepare birthdays
    const grouped =
      Array.from(
        rawUsers
          // Sort birthdays by user name
          .sort((a, b) => a.name.localeCompare(b.name))
          // create Map with birthday date as a key (unix time stamp) and array of users as value
          .reduce((ac, user) => ac.set(user.start.toMillis(), [...(ac.get(user.start.toMillis()) ?? []), user])
            , new Map<number, Array<RestoredBirthday>>(),
          ),
        )
        // Sort days
        .sort((a, b) => a[0] - b[0]);

    const itemsMap = grouped.reduce((acc, [day, items]) => {
      return acc.concat({
        // Map ordinal of the day to its index in final array
        ordinal: DateTime.fromMillis(day).ordinal,
        // Calculate the height for each day
        height: dayHeaderHeight + items.length * userRowHeight,
        // Offset of the index
        offset: acc.length ? (acc[acc.length - 1].offset + acc[acc.length - 1].height) : 0,
      });
    }, []);

    setUsers({users: grouped, usersMap: itemsMap});

  }, [rawUsers]);

  useEffect(() => {
    // Find next closest day for today
    const current = DateTime.local().ordinal;
    const nextClosestIndex = users.usersMap.findIndex(({ordinal}) => ordinal >= current);
    if (~nextClosestIndex) {
      updateDayIndex(nextClosestIndex);
    }
  }, [users]);

  const {error} = useContext(ErrorsContext);

  if (!isActive) {
    // Show button to activate
  } else {
    // Show navigation
    if (rawUsers.length) {
      // Display list of birthdays today
    } else {
      // Display "no birthdays today"
    }
    // Show button to deactivate
  }

  const updateDayIndex = (index?: number) => {
    if ('undefined' === typeof index) {
      // No index provided, set index close to today
      const todayOrdinal = DateTime.local().ordinal;
      index = users.usersMap.findIndex(({ordinal}) => ordinal >= todayOrdinal);
    } else if (index < 0) {
      // Small index, set index to the the end
      index = users.users.length - 1;
    } else if (index >= users.users.length) {
      // Index is too big, start over
      index = 0;
    }
    // Scroll to required position
    listRef.current.scrollTo(users.usersMap[index].offset + dayHeaderHeight - 10);
  };

  const scrollHandler = ({scrollOffset, scrollUpdateWasRequested}: ListOnScrollProps) => {
    const index = users.usersMap.findIndex(item => item.offset + item.height >= scrollOffset);
    setDayIndex(index);
  };

  return (
    <Box style={{minHeight: '80px'}}>
      {!!users.users.length && <>
        <Box p={1} display='flex' alignItems='center' className={classes.day}>

          <Box>
            {DateTime.fromMillis(users.users[dayIndex][0]).toLocaleString({weekday: 'short', month: 'short', day: 'numeric'})}
          </Box>

          <Box flexGrow={1}/>

          <IconButton
            size='small'
            onClick={() => window.close()}>
            <Close/>
          </IconButton>
        </Box>

        <Divider/>

        <Box p={1} pl={0} display='flex'>
          <Button size='small' color='primary' onClick={() => updateDayIndex()}>Today</Button>

          <IconButton size={'small'} onClick={() => updateDayIndex(dayIndex - 1)}>
            <ChevronLeft/>
          </IconButton>

          <IconButton size={'small'} onClick={() => updateDayIndex(dayIndex + 1)}>
            <ChevronRight/>
          </IconButton>

          <Box flexGrow={1}/>

          <Button
            size='small'
            color='primary'
            onClick={() => window.close()}
            endIcon={<SaveAlt/>}
          >
            Save
          </Button>

        </Box>
      </>}

      <Divider/>
      {!!users.users.length &&
      <Box p={2} pt={0} pr={0}>
        <VariableSizeList
          itemSize={i => users.usersMap[i].height}
          itemData={users.users}
          ref={listRef}
          height={400}
          onScroll={scrollHandler}
          width={'100%'}
          outerElementType={CustomScrollbarsVirtualList}
          itemCount={users.users.length}>
          {DayRow}
        </VariableSizeList>
      </Box>
      }
    </Box>
  );
};


export default TodayBirthdays;
