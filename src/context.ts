export const fetchUserFriendsBirthdayInfoFromContext = (): string => {
  const responseId = Math.random().toString();

  /**
   * Parse provided html page and extract token
   */
  function extractTokenFromPage(page: string): string {
    const pattern = new RegExp('.*"token":"(.*?)"', 'm');
    const result = pattern.exec(page);
    return result && result[1];
  }

  /**
   * Make request to facebook.com in order to receive html with vital information such as
   * token
   */
  fetch('https://www.facebook.com', {
    'headers': {
      'accept': 'text/html',
    },
  })
    .then(r => r.text())
    .then(page => {
      const token = extractTokenFromPage(page);

      // No token found, report an error, quit
      if ('string' !== typeof token) {
        // chrome.runtime.sendMessage({type: 'EXECUTED_SCRIPT_USER_TOKEN_NOT_FOUND', payload: {responseId}});
        // sendScanLog('SCAN_LOG_CHECK_LOGIN_ERROR_LOGIN');
        return Promise.reject('EXECUTED_SCRIPT_USER_TOKEN_NOT_FOUND');
      }
      // sendScanLog('SCAN_LOG_CHECK_SUCCESS');
      return token;
    })

    // Fetch user friends birthday data
    .then(token => fetch('https://www.facebook.com/api/graphql/', {
      'headers': {
        'content-type': 'application/x-www-form-urlencoded',
      },
      'body': '&__a=1'
        + '&fb_dtsg=' + encodeURIComponent(token)
        + '&fb_api_caller_class=RelayModern'
        + '&fb_api_req_friendly_name=BirthdayCometMonthlyBirthdaysRefetchQuery'
        + '&variables=' + encodeURIComponent(JSON.stringify({'count': 12}))
        + '&server_timestamps=true'
        + '&doc_id=3681233908586032',
      'method': 'POST',
    }))
    .then((r) => r.json())
    .then(
      (r: any) => {
        const result = r.data.viewer.all_friends_by_birthday_month.edges
          .map(({node}: any) => node.friends.edges)
          .flat()
          .map(({node}: any) => ({
            name: node.name,
            birthdate: node.birthdate,
            id: node.id,
          }));
        // Fake ExecutedScriptContextResponse since the function is not accessible from here
        chrome.runtime.sendMessage({type: 'EXECUTED_SCRIPT_CONTEXT_RESPONSE', payload: {responseId, users: result}});
      },
      (error) => {
        chrome.runtime.sendMessage({type: 'EXECUTED_SCRIPT_CONTEXT_ERROR', payload: {responseId, reason: error}});
      },
    );
  return responseId;
};
