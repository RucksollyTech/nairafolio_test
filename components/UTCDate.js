import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isToday from 'dayjs/plugin/isToday';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(duration);

const UTCDate = (date) => {
    const now = dayjs().utc();
    const appwriteDatetime = dayjs().utc().toISOString();
    const today = now.format()
    let myDateFormat
    let isToday = false
    if(date){
        const dates = dayjs(date).utc();
        const daysGone = now.diff(dates, 'days');
        const datetime= dates.format()
        const diffInMinutes = now.diff(dates, 'minute');
        const simpleDateFormat = dates.format('MMM D, YYYY')

        if (dates.isToday()) {
            isToday=true
            myDateFormat = `Today, ${dates.format('h:mma')}`; 
        } else {
            myDateFormat = dates.format('ddd MMM D, h:mma'); 
        }

        return {today, datetime, daysGone,appwriteDatetime,simpleDateFormat,myDateFormat,isToday,diffInMinutes};
    }
    return {today,appwriteDatetime};
};

export default UTCDate;
