import { CalenderEventData, ErrorResponse, SuccessResponse } from './dist/types/app.types';
export declare const createEvent: (eventData: CalenderEventData | any) => ErrorResponse | SuccessResponse;
export declare const isISO: (input: any) => boolean;
