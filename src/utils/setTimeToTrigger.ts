export const setTimeToTrigger = (fn: () => any, triggerIn: Date) => {
	setTimeout(fn, triggerIn.getTime() - new Date().getTime());
};