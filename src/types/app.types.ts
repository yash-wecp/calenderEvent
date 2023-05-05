type Email = `${string}@${string}.${string}`;

export type SuccessResponse = { icsString: string | null; attachment: any };

type ErrorResponse = { error: string | null; errorMessage: string | null };

export interface CreateEventResponse extends ErrorResponse, SuccessResponse {}

export type Method = 'PUBLISH' | 'REQUEST' | 'REPLY' | 'ADD' | 'CANCEL' | 'REFRESH' | 'COUNTER' | 'DECLINECOUNTER';

export type Organizer = {
	mailto: Email;
	name?: string;
	inviteBy?: string;
	directoryURL?: string;
};

export type OrganizerProperty = 'CN' | 'mailto' | 'SENT-BY' | 'DIR';

export type Attendee = {
	role?: string;
	name?: string;
	status?: 'NEEDS-ACTION' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE' | 'DELEGATED';
	inviteFrom?: Email;
	mailto: Email;
};

export type AttendeeProperties = 'CN' | 'ROLE' | 'PARTSTAT' | 'DELEGATED-FROM' | 'MAILTO';

export type Status = 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED' | 'NEEDS-ACTION';

export type TimeTransparency = 'OPAQUE' | 'TRANSPARENT';

export type CalenderEventData = {
	uid?: string;
	productId?: string;
	method?: Method;
	timezone?: string;
	createdAt?: string;
	startAt?: string;
	endAt?: string;
	duration?: number;
	organizer: Organizer;
	attendees?: Array<Attendee>;
	description?: string;
	lastModified?: string;
	location?: string;
	status?: Status;
	sequence?: number;
	summary?: string;
	timeTransparency?: TimeTransparency;
	url?: string;
};
