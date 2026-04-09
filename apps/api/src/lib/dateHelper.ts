const dateHelper = {
	getTodayZeroHours: () => {
		const d = new Date();
		d.setUTCHours(0, 0, 0, 0);
		return d;
	},
	getNextMidnight: () => {
		const next = new Date();
		next.setUTCHours(24, 0, 0, 0);
		return next.getTime();
	},
	getWaitTimeNextMidnight: () => {
		return dateHelper.getNextMidnight() - Date.now();
	},
	getNextMonthDate: () => {
		const next = new Date();
		next.setUTCHours(24, 0, 0, 0);
		next.setDate(next.getDate() + 30);
		return next;
	},
};

export default dateHelper;
