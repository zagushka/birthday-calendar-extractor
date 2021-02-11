import { v4 as uuidv4 } from 'uuid';

export const fetchUserFriendsBirthdayInfoFromContext = () => {
  const id = uuidv4();
  fetch('https://www.facebook.com/api/graphql/', {
    'headers': {
      'content-type': 'application/x-www-form-urlencoded',
    },
    'body': '&__a=1'
      + '&fb_dtsg=AQH6roDbgTk-%3AAQEk-S6Z0Oai'
      + '&fb_api_caller_class=RelayModern'
      + '&fb_api_req_friendly_name=BirthdayCometMonthlyBirthdaysRefetchQuery'
      + '&variables=' + encodeURIComponent(JSON.stringify({'count': 12}))
      + '&server_timestamps=true'
      + '&doc_id=3681233908586032',
    'method': 'POST',
  })
    .then((r) => r.json())
    .then((r: any) => {
      const result = r.data.viewer.all_friends_by_birthday_month.edges
        .map(({node}: any) => node.friends.edges)
        .flat()
        .map(({node}: any) => ({
          name: node.name,
          birthdate: node.birthdate,
          id: node.id,
        }));
      chrome.runtime.sendMessage({responseId: id, payload: result});
    });
  return {type: 'web-reply', id};
};
