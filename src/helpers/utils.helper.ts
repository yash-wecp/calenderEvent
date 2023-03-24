import _ from 'lodash';
import moment from 'moment';

export const isEventDataValid = (eventData: any): void => {
	// TODO: Add checks for required fields for the provided method and throw the error
};

export const formatDate = (milliseconds: number): string => {
	const array = _.map(_.split(moment(milliseconds).utc(false).format('YYYY-MM-DD-HH-mm-ss'), '-'), (value) =>
		new Number(value).toLocaleString('en-US', {
			minimumIntegerDigits: 2,
			useGrouping: false
		})
	);
	return `${_.join(_.slice(array, 0, 3), '')}T${_.join(_.slice(array, 3, 6), '')}Z`;
};
