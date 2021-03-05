import {
  List,
  ListItem,
} from '@material-ui/core';
import React, {
  memo,
  NamedExoticComponent,
} from 'react';
import { ListChildComponentProps } from 'react-window';
import handleLink from '../../filters/handleLink';
import { RestoredBirthday } from '../../libs/storage/storaged.types';
import { useBirthdaysListStyles } from './birthdays-list.styles';
import { asShortDate } from './birthdays-list.tools';

const handleClick = (href: string) => (e: React.MouseEvent) => handleLink(href, {}, e);

export const DayRow: NamedExoticComponent<ListChildComponentProps> = memo(({data, index, style}) => {
  const classes = useBirthdaysListStyles();
  const [dayMils, users]: [number, Array<RestoredBirthday>] = data[index] as [number, Array<RestoredBirthday>];
  return (
    <List className={classes.list} dense style={style}>
      <div className={classes.day}>
        {asShortDate(dayMils)}
      </div>
      {users.map(user => <ListItem className={classes.item} button key={user.href} onClick={handleClick(user.href)}>
        {user.name}
      </ListItem>)}
    </List>
  );
});
