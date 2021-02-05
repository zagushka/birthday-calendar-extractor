import {
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import {
  ChevronLeft,
  ChevronRight,
  Close,
  SaveAlt,
} from '@material-ui/icons';
import RepeatIcon from '@material-ui/icons/Repeat';

import { DateTime } from 'luxon';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import {
  ListOnScrollProps,
  VariableSizeList,
} from 'react-window';
import { TodayUsersContext } from '../../context/today-users.context';
import { closeWindowHandler } from '../../libs/tools';
import {
  useBirthdaysListStyles,
  useTooltipStyles,
} from './birthdays-list.styles';
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
  const {users: rawUsers} = useContext(TodayUsersContext);
  const [dayIndex, setDayIndex] = useState<number>(0);

  const [users, setUsers] = useState<UserMapInterface>({
    userGroups: [],
    usersMap: [],
  });

  const listRef = useRef<VariableSizeList>();
  const classes = useBirthdaysListStyles();
  const tooltipClasses = useTooltipStyles();

  useEffect(() => {
    // Prepare birthdays
    const grouped = groupUsersByOrdinal(rawUsers);
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
    <Box style={{minHeight: '80px'}}>
      {!!users.userGroups.length && <>
        {/*Top Part of the list*/}
        <Box p={1} display='flex' alignItems='center' className={classes.day}>
          <Box>{asShortDate(users.userGroups[dayIndex][0])}</Box>
          <Box flexGrow={1}/>
          <IconButton
            size='small'
            onClick={closeWindowHandler}>
            <Close/>
          </IconButton>
        </Box>

        <Divider/>

        {/*Navigation with today, next and previous day buttons*/}
        <Box p={1} pl={0} display='flex'>
          <Button size='small' color='primary' onClick={() => updateDayIndex()}>Today</Button>

          <IconButton size={'small'} onClick={() => updateDayIndex(-1)}>
            <ChevronLeft/>
          </IconButton>

          <IconButton size={'small'} onClick={() => updateDayIndex(1)}>
            <ChevronRight/>
          </IconButton>

          <Box flexGrow={1}/>

          <Button
            size='small'
            color='primary'
            variant={'outlined'}
            component={Link}
            to={'/export'}
            endIcon={<SaveAlt/>}
          >
            Export
          </Button>

          <Tooltip title='Scan birthdays again' arrow classes={tooltipClasses}>
            <IconButton
              size='small'
              color='primary'
              area-label='more actions'
              aria-haspopup='true'
              component={Link}
              to={'/activate'}
            >
              <RepeatIcon/>
            </IconButton>
          </Tooltip>
        </Box>
      </>}

      <Divider/>
      {/*Scroll with list of birthdays*/}
      {!!users.userGroups.length &&
      <Box p={2} pt={0} pr={0}>
        <VariableSizeList
          itemSize={i => users.usersMap[i].height}
          itemData={users.userGroups}
          ref={listRef}
          height={450}
          onScroll={scrollHandler}
          width={'100%'}
          outerElementType={CustomScrollbarsVirtualList}
          itemCount={users.userGroups.length}>
          {DayRow}
        </VariableSizeList>
      </Box>
      }
    </Box>
  );
};

export default BirthdaysList;
