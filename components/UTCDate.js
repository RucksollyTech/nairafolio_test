import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import isToday from 'dayjs/plugin/isToday';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);

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

        if (dates.isToday()) {
            isToday=true
            myDateFormat = `Today, ${dates.format('h:mma')}`; 
        } else {
            myDateFormat = dates.format('ddd MMM Do, h:mma'); 
        }

        return {today, datetime, daysGone,appwriteDatetime,myDateFormat,isToday};
    }
    return {today,appwriteDatetime};
};

export default UTCDate;
