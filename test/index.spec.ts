import { expect } from 'chai';
import { createEvent } from '../src/app';
import { CalenderEventData } from '../src/types/app.types';

const emptyPayload = {};
const onlyRequiredAttributes: CalenderEventData = {
	organizer: {
		mailto: 'developer@calernderEvent.io'
	}
};

describe('calenderEvent', () => {
	describe('.createEvent', () => {
		it('Returns an error on empty payload', () => {
			const result = createEvent(emptyPayload);
			expect(result).to.have.keys(['error', 'errorMessage']);
			expect(result).to.not.have.keys(['icsString', 'attachment']);
		});

		it('Returns value with only required parameters', () => {
			const result = createEvent(onlyRequiredAttributes);
			expect(result).to.not.have.keys(['error', 'errorMessage']);
			expect(result).to.have.keys(['icsString', 'attachment']);
		});
	});
});
