import { Box } from "@material-ui/core";
import { useThrottleCallback } from "@react-hook/throttle";
import update from "immutability-helper";

import { DateTime } from "luxon";
import memoize from "memoize-one";
import React, { FunctionComponent, useCallback, useContext, useEffect, useRef, useState } from "react";

import { ListOnScrollProps, VariableSizeList } from "react-window";
import { toggleStoredUserSettings } from "@/libs/birthdays-scan";
import { CurrentStatusContext } from "@/context/current-status.context";
import { reviveBirthday, storeUserSettings } from "@/libs/storage/chrome.storage";
import { STORED_BIRTHDAY, STORED_BIRTHDAY_SETTINGS } from "@/libs/storage/storaged.types";
import Layout from "../layout/layout";
import { CalendarNavigation } from "./calendar-navigation";
import {
  asLongDate,
  DAY_HEADER_HEIGHT,
  groupUsersByOrdinal,
  mapGroupedUsersToDisplayItemDimensions,
  UserMapInterface,
} from "./calendar-tools";
import { CreateButton } from "./create-button";
import { CustomScrollbarsVirtualList } from "./custom-scrollbars";
import { DayList } from "./day-row";

const createItemData = memoize((userGroup, toggleStatus) => ({
  userGroup,
  toggleStatus,
}));

const Calendar: FunctionComponent = () => {
  const { users: rawUsers } = useContext(CurrentStatusContext);
  const [dayIndex, setDayIndex] = useState<number>(0);

  const [users, setUsers] = useState<UserMapInterface>({
    userGroups: [],
    usersMap: [],
  });

  const scrollHandler = useThrottleCallback(
    useCallback(
      ({ scrollOffset }: ListOnScrollProps) => {
        const index = users.usersMap.findIndex((item) => item.offset + item.height >= scrollOffset);
        setDayIndex(index);
      },
      [users],
    ),
    10,
  );

  const listRef = useRef<VariableSizeList>();

  useEffect(() => {
    // Prepare birthdays
    const { year } = DateTime.local();
    const revivedUsers = rawUsers.map((u) => reviveBirthday(u, year));
    const grouped = groupUsersByOrdinal(revivedUsers);
    const itemsMap = mapGroupedUsersToDisplayItemDimensions(grouped);
    setUsers({ userGroups: grouped, usersMap: itemsMap });
  }, [rawUsers]);

  const updateUserSettings = (id: string, state: "on" | "off") => {
    const index = rawUsers.findIndex((user) => user[STORED_BIRTHDAY.UID] === id);
    const settings = toggleStoredUserSettings(
      rawUsers[index][STORED_BIRTHDAY.SETTINGS],
      STORED_BIRTHDAY_SETTINGS.HIDDEN_FOR_EXPORT,
      state,
    );
    storeUserSettings({
      birthdays: update(rawUsers, { [index]: { [STORED_BIRTHDAY.SETTINGS]: { $set: settings } } }),
    });
  };
  const itemData = createItemData(users.userGroups, updateUserSettings);

  const [ranOnce, setRanOnce] = useState(false);

  useEffect(() => {
    if (ranOnce) {
      return;
    }
    // Find next closest day for today
    const current = DateTime.local().ordinal;
    const nextClosestIndex = users.usersMap.findIndex(({ ordinal }) => ordinal >= current);
    if (~nextClosestIndex) {
      updateDayIndex(nextClosestIndex);
      setRanOnce(true);
    }
  }, [users, ranOnce]);

  /**
   * Change the title according to the users and dayIndex
   */
  const [title, setTitle] = useState<string>();
  useEffect(() => {
    setTitle(users.userGroups[dayIndex] ? asLongDate(users.userGroups[dayIndex][0]) : "");
  }, [users, dayIndex]);

  /**
   * Scroll the list to the closest element closest to index + delta parameter
   *
   * Delta parameter used to define direction of the next index
   * -1 - towards the top
   * +1 - toward the end of the list
   */
  const updateDayIndex = (delta?: number) => {
    let index = dayIndex + (delta ?? 0);

    if (typeof delta === "undefined") {
      // No index provided, set index close to today
      const todayOrdinal = DateTime.local().ordinal;
      index = users.usersMap.findIndex(({ ordinal }) => ordinal >= todayOrdinal);
    } else if (index < 0) {
      // Small index, set index to the end
      index = users.userGroups.length - 1;
    } else if (index >= users.userGroups.length) {
      // Index is too big, start over
      index = 0;
    }
    // Scroll to required position
    listRef.current.scrollTo(users.usersMap[index].offset + DAY_HEADER_HEIGHT - 10);
  };

  return (
    <>
      {/* Top Part of the list */}
      <Layout.Header>
        <Box style={{ textTransform: "capitalize" }}>{title}</Box>
      </Layout.Header>

      {/* Navigation with today, next and previous day buttons */}
      <CalendarNavigation updateDayIndex={updateDayIndex} />

      <Layout.Content>
        {/* Scroll with list of birthdays */}

        <VariableSizeList
          itemSize={(i) => users.usersMap[i].height}
          itemData={itemData}
          ref={listRef}
          height={429}
          onScroll={scrollHandler}
          width="100%"
          outerElementType={CustomScrollbarsVirtualList}
          itemCount={users.userGroups.length}
        >
          {DayList}
        </VariableSizeList>

        <CreateButton />
      </Layout.Content>
    </>
  );
};

export default Calendar;
