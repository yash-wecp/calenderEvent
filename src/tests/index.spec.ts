import { expect } from 'chai';
import _ from 'lodash';
import { createEvent } from '../../index';
import { CalenderEventData, CreateEventResponse } from '../types/app.types';

const emptyPayload = {};
const onlyRequiredAttributes: CalenderEventData = {
	productId: 'CalenderEvent',
	method: 'REQUEST',
	createdAt: new Date().toISOString(),
	startAt: '2023-03-24T22:50:30.000Z',
	duration: 0.25,
	organizer: { name: 'yash', mailto: 'noreply@wecp.in' },
	description:
		'Please use this link to take the interview: https://assess.wecreateproblems.com/interviews/5c0db082-52dd-4139-9c3d-c9f030ed3d32',
	url: 'https://assess.wecreateproblems.com/interviews/5c0db082-52dd-4139-9c3d-c9f030ed3d32',
	lastModified: undefined,
	location: 'Online',
	status: 'NEEDS-ACTION',
	sequence: 1679607597323,
	summary: 'Interviewer invite'
};

describe('calenderEvent', () => {
	describe('.createEvent', () => {
		it('Returns an error on empty payload', () => {
			const result = createEvent(emptyPayload);
			expect(result).to.have.keys(['error', 'errorMessage', 'icsString', 'attachment']);
			expect(result.icsString).to.be.a('null');
			expect(result.attachment).to.be.a('null');
		});

		it('Returns value with only required parameters', () => {
			const result: CreateEventResponse = createEvent(onlyRequiredAttributes);
			expect(result).to.have.keys(['error', 'errorMessage', 'icsString', 'attachment']);
			expect(result.error).to.be.a('null');
			expect(result.errorMessage).to.be.a('null');
			expect(result.icsString).to.have.length.greaterThan(0);
		});
	});
});
