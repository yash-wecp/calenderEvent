# Calender Event

iCalendar (.ics) file generator

## NOTE: This package is currently under development

[![npm version](https://badge.fury.io/js/calender_event.svg)](https://badge.fury.io/js/calender_event)

## Install

Use [npm package][npmjs] manger to install

`npm i calender_event`

## Usage

#### In node / CommonJS

```javascript
const createEvent = require('calender_event');

// or, in ESM: import { createEvent } from 'calender_event'

// Create event object. Find details for parameters below

const eventDetails = {
	// Event properties
};

const calenderEvent = createEvent(eventDetails);
```

#### Properties for event in calender (VEVENT)

| Key | Notes | Data type | Required | Default |
| :--- | :---: | :---: | :---: | :---: |
| **uid** | Unique Id to identify the event | string | NO | UUIDv4 |
| **productId** | Name of the product / organization creating the event | string | NO | Calender_Event |
| **method** | iTip method to invite attendees to meetings | 'PUBLISH' \| 'REQUEST' \| 'REPLY' \| 'ADD' \| 'CANCEL' \| 'REFRESH' \| 'COUNTER' \| 'DECLINECOUNTER' | NO | PUBLISH |
| **createdAt** | Date and time of the event | ISO Date [UTC] | NO | Current date and time |
| **startAt** | Date and time of the event starting at | ISO Date [UTC] | NO | null |
| **endAt** | Date and time of the event ending at | ISO Date [UTC] | NO | null |
| **duration** | Duration of event in minutes. Note: If both `endAt` and `duration` are missing event is considered as a whole day event | number | NO | 1440 |
| **organizer** | Details of the event organizer. Find the parameters below | `Organizer` | YES | NA |
| **attendees** | Details of the people attending the event | Array of `Attendee` | NO | [] |
| **description** | Description / agenda of the event | string | NO | null |
| **lastModified** | Date and time of the event was last modified at | ISO Date [UTC] | NO | null |
| **location** | Location of the event taking place at | string | NO | null |
| **status** | Current status of the event | 'TENTATIVE' \| 'CONFIRMED' \| 'CANCELLED' | NO | 'CONFIRMED' |
| **sequence** | Counter of the updates performed on the event, to keep the latest version in user's calender | number | NO | 0 |
| **summary** | Title of the event | string | NO | null |
| **timeTransparency** | To mark the calender as busy or free during the event | 'OPAQUE' \| 'TRANSPARENT' | NO | 'OPAQUE' |
| **url** | URL to associated with the event | string | NO | null |

#### Organizer Properties

| Key | Note | Data type | Required | Default |
| :--- | :---: | :---: | :---: | :---: |
| **mailto** | Email id on which the receiver can reply to | email | YES | NA |
| **name** | Name of the person owing the email | string | NO | `mailto` |
| **inviteBy** | Email of the person sharing the event | string | NO | null |
| **directoryURL** | URL to the person's \/ organization's profile | URL | NO | null |

## Reference

-   https://www.rfc-editor.org/rfc/rfc2446.html

-   https://www.kanzaki.com/docs/ical

-   https://github.com/adamgibbons/ics

## Contributing?

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

[npmjs]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
