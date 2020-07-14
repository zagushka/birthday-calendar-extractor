## terminal: python select_contacts_from_ics.py <file-name>

import os, re, sys

try:
    file = open(sys.argv[1]).read()
except:
    print('ERROR: Add a ICS file to your command: python select_contacts_from_ics.py <file-name>')

start_pattern = 'BEGIN:VEVENT'
end_pattern = 'END:VCALENDAR'
start = re.search(start_pattern,file).span()[0]
end = re.search(end_pattern,file).span()[0]

header = file[:start].strip()
footer = '\n' + file[end:]
file = file[start:end]

file = file.replace('END:VEVENT','END:VEVENT&sep')
data = file.split('&sep')

pattern = '(SUMMARY:.*(.*)\nTRANSP)'
i = 1
new_list = []
for element in data:
    if element == '\n':
        continue
    try:
        match = re.search(pattern, element).group(2)
        print(match)
    except:
        print('Unknown pattern: ', element)
        print('{} pattern not found - check cal file'.format(i))
        i = i+1
    print('relevant? y (YES) / (NO) any other key')
    user_input = input()
    if user_input == 'y':
        new_list.append(element)

return_cal = '\n'.join(new_list)
return_cal = return_cal.replace('END:VEVENT\n','END:VEVENT')

return_cal = header+return_cal+footer

with open('new_birthdays.ics','w') as f:
    f.write(return_cal)

print('Success, new cal generated: new_birthdays.ics')
