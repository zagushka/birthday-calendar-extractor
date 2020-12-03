import React from 'react';

interface BirthdayRowProps {
  item: {
    name: string;
    start: string;
    href: string;
  },
}

export default class BirthdayRow extends React.Component<BirthdayRowProps, any> {
  render() {
    const item = this.props.item;
    return <tr>
      <td>{item.name}</td>
      <td>{item.start}</td>
      <td>{item.href}</td>
      <td>DAY</td>
      <td>WEEK</td>
    </tr>;
  }
}
