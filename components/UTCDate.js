import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const UTCDate = (date) => {
    const now = dayjs().utc();
    const dates = dayjs(date).utc();
    const daysGone = now.diff(dates, 'days');
    const today = now.format()
    const datetime= dates.format()
    return {today, datetime, daysGone};
};

export default UTCDate;
