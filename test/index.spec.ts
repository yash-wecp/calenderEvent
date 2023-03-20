import { expect } from 'chai';
import { createEvent } from '../src/app';

const validAttributes = {};

describe('ics', () => {
	describe('.createEvent', () => {
		it('returns an error or value when not passed a callback', () => {
			const event1 = createEvent(validAttributes);
			expect(event1.error).to.be.null;
			expect(event1.value).to.be.a('string');
		});
	});
});
