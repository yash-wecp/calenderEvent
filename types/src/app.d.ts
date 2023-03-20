import { CalenderEventData } from './types/app.types';
export declare const createEvent: (eventData: CalenderEventData) => {
    error: null | string;
    value: null | string;
};
export declare const isISO: (input: any) => boolean;
