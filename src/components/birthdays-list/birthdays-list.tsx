import {
  Box,
  Button,
  Divider,
  IconButton,
} from '@material-ui/core';
import {
  ChevronLeft,
  ChevronRight,
} from '@material-ui/icons';

import { DateTime } from 'luxon';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ListOnScrollProps,
  VariableSizeList,
} from 'react-window';
import { CurrentStatusContext } from '../../context/current-status.context';
import { reviveBirthdayThisYear } from '../../libs/storage/chrome.storage';
import Layout from '../layout/layout';
import {
  asShortDate,
  DAY_HEADER_HEIGHT,
  groupUsersByOrdinal,
  mapGroupedUsersToDisplayItemDimensions,
  UserMapInterface,
} from './birthdays-list.tools';
import { CustomScrollbarsVirtualList } from './custom-scrollbars';
import { DayRow } from './day-row';

const BirthdaysList: FunctionComponent = () => {
  const {users: rawUsers} = useContext(CurrentStatusContext);
  const [dayIndex, setDayIndex] = useState<number>(0);

  const [users, setUsers] = useState<UserMapInterface>({
    userGroups: [],
    usersMap: [],
  });

  const listRef = useRef<VariableSizeList>();

  useEffect(() => {
    // Prepare birthdays
    const revivedUsers = rawUsers.map(reviveBirthdayThisYear);
    const grouped = groupUsersByOrdinal(revivedUsers);
    const itemsMap = mapGroupedUsersToDisplayItemDimensions(grouped);

    setUsers({userGroups: grouped, usersMap: itemsMap});

  }, [rawUsers]);

  useEffect(() => {
    // Find next closest day for today
    const current = DateTime.local().ordinal;
    const nextClosestIndex = users.usersMap.findIndex(({ordinal}) => ordinal >= current);
    if (~nextClosestIndex) {
      updateDayIndex(nextClosestIndex);
    }
  }, [users]);

  /**
   * Scroll the list to the closest element closest to index + delta parameter
   *
   * Delta parameter used to define direction of the next index
   * -1 - towards the top
   * +1 - toward the end of the list
   */
  const updateDayIndex = (delta?: number) => {
    let index = dayIndex + (delta ?? 0);

    if ('undefined' === typeof delta) {
      // No index provided, set index close to today
      const todayOrdinal = DateTime.local().ordinal;
      index = users.usersMap.findIndex(({ordinal}) => ordinal >= todayOrdinal);
    } else if (index < 0) {
      // Small index, set index to the the end
      index = users.userGroups.length - 1;
    } else if (index >= users.userGroups.length) {
      // Index is too big, start over
      index = 0;
    }
    // Scroll to required position
    listRef.current.scrollTo(users.usersMap[index].offset + DAY_HEADER_HEIGHT - 10);
  };

  const scrollHandler = ({scrollOffset, scrollUpdateWasRequested}: ListOnScrollProps) => {
    const index = users.usersMap.findIndex(item => item.offset + item.height >= scrollOffset);
    setDayIndex(index);
  };

  return (
    <>
      {/*Top Part of the list*/}
      <Layout.Header>
        <Box>{users.userGroups[dayIndex] ? asShortDate(users.userGroups[dayIndex][0]) : ''}</Box>
      </Layout.Header>

      {/*Navigation with today, next and previous day buttons*/}
      <Box p={1} pl={0} display='flex'>
        <Button size='small' color='primary' onClick={() => updateDayIndex()}>Today</Button>

        <IconButton size={'small'} onClick={() => updateDayIndex(-1)}>
          <ChevronLeft/>
        </IconButton>

        <IconButton size={'small'} onClick={() => updateDayIndex(1)}>
          <ChevronRight/>
        </IconButton>
      </Box>

      <Divider/>

      <Layout.Content>
        {/*Scroll with list of birthdays*/}
        {!!users.userGroups.length &&
        <VariableSizeList
          itemSize={i => users.usersMap[i].height}
          itemData={users.userGroups}
          ref={listRef}
          height={429}
          onScroll={scrollHandler}
          width={'100%'}
          outerElementType={CustomScrollbarsVirtualList}
          itemCount={users.userGroups.length}>
          {DayRow}
        </VariableSizeList>
        }
      </Layout.Content>
    </>
  );
};

export default BirthdaysList;
