import { DateInISO, Email } from './custom.types';
export type ErrorMessage = {
    error: string;
    message: string;
};
export type Method = 'PUBLISH' | 'REQUEST' | 'REPLY' | 'ADD' | 'CANCEL' | 'REFRESH' | 'COUNTER' | 'DECLINECOUNTER';
export type Organizer = {
    mailto: Email;
    name?: string;
    inviteBy?: string;
    directoryURL?: string;
};
export type OrganizerProperty = 'CN' | 'mailto' | 'SENT-BY' | 'DIR';
export type Attendee = {};
export type Status = 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
export type TimeTransparency = 'OPAQUE' | 'TRANSPARENT';
export type CalenderEventData = {
    uid?: string;
    productId?: string;
    method?: Method;
    timezone?: string;
    createdAt?: DateInISO;
    startAt?: DateInISO;
    endAt?: DateInISO;
    duration?: number;
    organizer: Organizer;
    attendees?: Array<Attendee>;
    description?: string;
    lastModified?: DateInISO;
    location?: string;
    status?: Status;
    sequence?: number;
    summary?: string;
    timeTransparency?: TimeTransparency;
    url?: string;
};
