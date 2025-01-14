import dayjs from 'dayjs';

// Function to convert days to a readable format
export const convertDaysToReadableFormat = (days) => {
    if (days < 30) {
        return `${days} day${days === 1 ? '' : 's'}`;
    }

    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    if (months < 12) {
        return `${months} month${months === 1 ? '' : 's'}${remainingDays > 0 ? ` and ${remainingDays} day${remainingDays === 1 ? '' : 's'}` : ''}`;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    return `${years} year${years === 1 ? '' : 's'}${remainingMonths > 0 ? ` and ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}` : ''}`;
};
