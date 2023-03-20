import _ from 'lodash';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

import {
	Attendee,
	CalenderEventData,
	ErrorMessage,
	Method,
	Organizer,
	OrganizerProperty,
	Status,
	TimeTransparency
} from '../types/app';
import { DateInISO } from '../types/custom';
import { formatDate } from './utils.helper';

export const createEvent = (eventData: any): { error: null | string; value: null | string } => {
	const result = { error: null, value: null };
	try {
		result['value'] = generateCalenderEvent(eventData);
		result['error'] = null;
	} catch (error) {
		result['error'] = error;
		result['value'] = null;
	}
	return result;
};

const generateCalenderEvent = (eventData: CalenderEventData): string => {
	return _.join(
		_.filter(
			[
				`BEGIN:VCALENDAR`,
				resolveProductID(eventData.productId),
				`VERSION:2.0`,
				`CALSCALE:GREGORIAN`,
				resolveMethod(eventData.method),
				resolveTimezone(),
				`BEGIN:VEVENT`,
				resolveStartTime(eventData.startAt, eventData.endAt, eventData.duration),
				resolveOrganizer(eventData.organizer),
				resolveUniqueID(eventData.uid),
				resolveAttendee(eventData.attendees),
				resolveCreatedAt(eventData.createdAt),
				resolveDescription(eventData.description),
				resolveLastModified(eventData.lastModified),
				resolveLocation(eventData.location),
				resolveSequence(eventData.sequence),
				resolveStatus(eventData.status),
				resolveSummary(eventData.summery),
				resolveTimeTransparency(eventData.timeTransparency),
				`END:VEVENT`,
				`END:VCALENDAR`
			],
			(value) => value
		),
		'\n'
	);
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

const resolveProductID = (productId: string) => {
	return `PRODID:${productId || 'Calender_Event'}`;
};

const resolveMethod = (method?: Method) => {
	return `METHOD:${method ? method : 'PUBLISH'}`;
};

export const isISO = (input: any): boolean => {
	return moment(input, moment.ISO_8601, true).isValid();
};

const resolveStartTime = (
	startAt?: DateInISO,
	endAt?: DateInISO,
	duration?: number
): string | ErrorMessage => {
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

	return `
        DTSTART:${formatDate(startTime)}
        DTEND:${formatDate(endTime)}
        DTSTAMP:${formatDate(Date.now())}
    `;
};

const resolveOrganizer = (organizer: Organizer | undefined) => {
	if (_.isUndefined(organizer) || _.isEmpty(organizer)) return null;

	return _.join(
		_.filter(
			[
				`ORGANIZER`,
				resolveOrganizerProperty('CN', organizer.name),
				resolveOrganizerProperty('SENT-BY', organizer.inviteBy),
				resolveOrganizerProperty('DIR', organizer.directoryURL),
				resolveOrganizerProperty('mailto', organizer.mailto)
			],
			(value) => value
		),
		';'
	);
};

const resolveOrganizerProperty = (type: OrganizerProperty, value: string) => {
	if (_.isEmpty(value)) return null;
	if (type === 'SENT-BY') return `${type}:"mailto:${value}"`;
	return `${type}:"${value}"`;
};

const resolveUniqueID = (uid: string | undefined) => {
	if (_.isUndefined(uid) || _.isEmpty(uid)) uid = uuid();
	if (!_.includes(uid, '@')) uid += '@calender.io';
	return uid;
};

const resolveAttendee = (attendees: Array<Attendee> | undefined) => {
	return null;
};

const resolveCreatedAt = (createdAt: DateInISO | undefined) => {
	const date = _.isUndefined(createdAt) ? moment().valueOf() : moment(createdAt).valueOf();
	return `CREATED:${formatDate(date)}`;
};

const resolveDescription = (description: string | undefined) => {
	if (_.isUndefined(description) || _.isEmpty(description)) return null;
	return `DESCRIPTION:${description}`;
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
	if (_.isUndefined(status)) return null;
	return `STATUS:${status}`;
};

const resolveSummary = (summary: string | undefined) => {
	if (_.isUndefined(summary) || _.isEmpty(summary)) return `SUMMARY:null`;
	return `SUMMARY:${summary}`;
};

const resolveTimeTransparency = (timeTransparency: TimeTransparency | undefined) => {
	if (_.isUndefined(timeTransparency) || _.isEmpty(timeTransparency)) return null;
	return `TRANSP:${timeTransparency}`;
};
