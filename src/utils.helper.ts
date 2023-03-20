import _ from 'lodash';
import moment from 'moment';

export const formatDate = (milliseconds: number): string => {
	const array = _.map(_.split(moment(milliseconds).format('YYYY-MM-DD-HH-mm'), '-'), (value) =>
		new Number(value).toLocaleString('en-US', {
			minimumIntegerDigits: 2,
			useGrouping: false
		})
	);
	return `${_.join(_.slice(array, 0, 3), '')}T${_.join(_.slice(array, 3, 5), '')}Z`;
};
