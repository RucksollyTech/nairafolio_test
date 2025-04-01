import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isToday from 'dayjs/plugin/isToday';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { formatToNigerianTime } from './ConvertToLocalTime';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);

const UTCDate = (date) => {
    const now = dayjs().utc();
    const appwriteDatetime = dayjs().utc().toISOString();
    const today = now.format();
    let myDateFormat;
    let isToday = false;
    let isPastOrToday = false;

    if (date) {
        const dates = dayjs(formatToNigerianTime(date)).utc();
        // const dates = dayjs(date).utc();
        const daysGone = now.diff(dates, 'days');
        const datetime = dates.format();
        const diffInMinutes = now.diff(dates, 'minute');
        const simpleDateFormat = dates.format('MMM D, YYYY');
        const isoDate = dates.toISOString();
        
        if (dates.isToday()) {
            isToday = true;
            myDateFormat = `Today, ${dates.format('h:mma')}`;
        } else {
            myDateFormat = dates.format('ddd MMM D, h:mma');
        }

        // Check if the given date is today or in the past
        isPastOrToday = dates.isSameOrBefore(now, 'day');

        return { today, isoDate, datetime, daysGone, appwriteDatetime, simpleDateFormat, myDateFormat, isToday, diffInMinutes, isPastOrToday };
    }

    return { today, appwriteDatetime };
};

export default UTCDate;
