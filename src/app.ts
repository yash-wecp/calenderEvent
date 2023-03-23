import _ from 'lodash';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

// Use ES6 formate
const mimemessage = require('mimemessage');

import {
	Attendee,
	CalenderEventData,
	Method,
	Organizer,
	OrganizerProperty,
	Status,
	TimeTransparency,
	ErrorResponse,
	SuccessResponse,
	AttendeeProperties
} from './types/app.types';
import { DateInISO } from './types/custom.types';
import { formatDate, validateEventData } from './helpers/utils.helper';

export const createEvent = (eventData: any): ErrorResponse | SuccessResponse => {
	try {
		validateEventData(eventData);
		return generateCalenderEvent(eventData);
	} catch (error: any) {
		return {
			error: '',
			errorMessage: error
		};
	}
};

const generateCalenderEvent = (eventData: CalenderEventData): SuccessResponse => {
	const icsString = _.join(
		_.filter(
			[
				`BEGIN:VCALENDAR`,
				resolveProductID(eventData.productId),
				`VERSION:2.0`,
				`CALSCALE:GREGORIAN`,
				resolveMethod(eventData.method),
				resolveTimezone(),
				`BEGIN:VEVENT`,
				resolveEventTime(eventData.startAt, eventData.endAt, eventData.duration),
				resolveOrganizer(eventData.organizer),
				resolveUniqueID(eventData.uid),
				resolveAttendee(eventData.attendees),
				resolveCreatedAt(eventData.createdAt),
				resolveDescription(eventData.description),
				resolveURL(eventData.url),
				resolveLastModified(eventData.lastModified),
				resolveLocation(eventData.location),
				resolveSequence(eventData.sequence),
				resolveStatus(eventData.status),
				resolveSummary(eventData.summary),
				resolveTimeTransparency(eventData.timeTransparency),
				`END:VEVENT`,
				`END:VCALENDAR`
			],
			(value) => value
		),
		'\n'
	);

	const attachmentEntity = mimemessage.factory({
		contentType: 'text/calendar',
		contentTransferEncoding: 'base64',
		body: Buffer.from(icsString)
			.toString('base64')
			.replace(/([^\0]{76})/g, '$1\n')
	});
	attachmentEntity.header('Content-Disposition', `attachment;filename=invite.ics`);

	return {
		icsString: icsString,
		attachment: attachmentEntity
	};
};

const resolveTimezone = (TzID?: string) => {
	return null;
	// `
	//     BEGIN:VTIMEZONE
	//     TZID:Asia/Kolkata,
	//     X-LIC-LOCATION:Asia/Kolkata
	//     BEGIN:STANDARD
	//     TZOFFSETFROM:+0530
	//     TZOFFSETTO:+0530
	//     TZNAME:IST
	//     DTSTART:19700101T000000
	//     END:STANDARD
	//     END:VTIMEZONE
	// `;
};

const resolveProductID = (productId: string | undefined) => {
	return `PRODID:${productId || 'Calender_Event'}`;
};

const resolveMethod = (method?: Method) => {
	return `METHOD:${method ? method : 'PUBLISH'}`;
};

export const isISO = (input: any): boolean => {
	return moment(input, moment.ISO_8601, true).isValid();
};

const resolveEventTime = (startAt?: DateInISO, endAt?: DateInISO, duration?: number): string | null => {
	if (!startAt || !isISO(startAt)) {
		return null;
	}

	if (!duration && (!endAt || !isISO(endAt))) {
		duration = 24 * 60 * 60 * 1000;
	} else if (!duration && endAt && isISO(endAt)) {
		if (moment(endAt).valueOf() < moment(startAt).valueOf()) {
			throw new Error();
		}
		duration = moment(endAt).valueOf() - moment(startAt).valueOf();
	} else if (duration) {
		duration = duration * 60 * 1000;
	} else {
		throw new Error();
	}

	const startTime: number = moment(startAt).valueOf();
	const endTime: number = moment(startAt).valueOf() + duration;

	return _.join(
		[`DTSTART:${formatDate(startTime)}`, `DTEND:${formatDate(endTime)}`, `DTSTAMP:${formatDate(Date.now())}`],
		'\n'
	);
};

const resolveOrganizer = (organizer: Organizer | undefined) => {
	if (_.isUndefined(organizer) || _.isEmpty(organizer) || !_.isString(organizer?.mailto)) {
		throw new Error('Organizer not found');
	}

	return (
		_.join(
			_.filter(
				[
					`ORGANIZER`,
					resolveOrganizerProperty('CN', organizer.name || organizer.mailto),
					resolveOrganizerProperty('SENT-BY', organizer.inviteBy),
					resolveOrganizerProperty('DIR', organizer.directoryURL)
				],
				(value) => value
			),
			';'
		) + `:mailto:${organizer.mailto}`
	);
};

const resolveOrganizerProperty = (type: OrganizerProperty, value: string | undefined) => {
	if (_.isUndefined(value) || _.isEmpty(value)) return null;
	if (type === 'SENT-BY') return `${type}=mailto:${value}`;
	return `${type}=${value}`;
};

const resolveUniqueID = (uid: string | undefined) => {
	if (_.isUndefined(uid) || _.isEmpty(uid)) uid = uuid();
	if (!_.includes(uid, '@')) uid += '@calender.io';
	return `UID:${uid}`;
};

const resolveAttendee = (attendees: Array<Attendee> | undefined) => {
	if (_.isUndefined(attendees)) attendees = [];
	const attendeesArray: Array<string> = _.map(attendees, (attendee) => {
		return (
			_.join(
				_.filter(
					[
						`ATTENDEE`,
						resolveAttendeeProperty('ROLE', attendee.role),
						resolveAttendeeProperty('CN', attendee.name || attendee.mailto),
						resolveAttendeeProperty('PARTSTAT', attendee.status),
						resolveAttendeeProperty('DELEGATED-FROM', attendee.inviteFrom)
					],
					(value) => value
				),
				';'
			) + `:MAILTO:${attendee.mailto}`
		);
	});

	return _.join(attendeesArray, '\n');
};

const resolveAttendeeProperty = (type: AttendeeProperties, value: string | undefined) => {
	if (_.isUndefined(value) || _.isEmpty(value)) return null;
	return `${type}:${value}`;
};

const resolveCreatedAt = (createdAt: DateInISO | undefined) => {
	const date = _.isUndefined(createdAt) ? moment().valueOf() : moment(createdAt).valueOf();
	return `CREATED:${formatDate(date)}`;
};

const resolveDescription = (description: string | undefined) => {
	if (_.isUndefined(description) || _.isEmpty(description)) return null;
	return `DESCRIPTION:${description}`;
};
const resolveURL = (url: string | undefined) => {
	if (_.isUndefined(url) || _.isEmpty(url)) return null;
	return `URL:${url}`;
};

const resolveLastModified = (lastModified: DateInISO | undefined) => {
	const date = _.isUndefined(lastModified) ? moment().valueOf() : moment(lastModified).valueOf();
	return `LAST-MODIFIED:${formatDate(date)}`;
};

const resolveLocation = (location: string | undefined) => {
	if (_.isUndefined(location) || _.isEmpty(location)) return null;
	return `LOCATION:${location}`;
};

const resolveSequence = (sequence: number | undefined) => {
	return `SEQUENCE:${sequence || 0}`;
};

const resolveStatus = (status: Status | undefined) => {
	if (_.isUndefined(status)) status = 'CONFIRMED';
	return `STATUS:${status}`;
};

const resolveSummary = (summary: string | undefined) => {
	if (_.isUndefined(summary) || _.isEmpty(summary)) return `SUMMARY:null`;
	return `SUMMARY;LANGUAGE=en-us:${summary}`;
};

const resolveTimeTransparency = (timeTransparency: TimeTransparency | undefined) => {
	if (_.isUndefined(timeTransparency) || _.isEmpty(timeTransparency)) timeTransparency = 'OPAQUE';
	return `TRANSP:${timeTransparency}`;
};
