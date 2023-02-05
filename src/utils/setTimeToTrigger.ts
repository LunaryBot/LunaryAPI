export const setTimeToTrigger = (fn: () => any, triggerIn: Date) => {
	const now = new Date();
	const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

	setTimeout(fn, triggerIn.getTime() - utc.getTime());
};