
export function getNigeriaUtcOffsetMs() {
    const now = new Date();
  
    const nigeriaTime = new Intl.DateTimeFormat('en-NG', {
      timeZone: 'Africa/Lagos',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    }).formatToParts(now);
  
    const systemTime = {
      hour: now.getUTCHours(),
      minute: now.getUTCMinutes(),
      second: now.getUTCSeconds(),
    };
  
    const lagosTime = {
      hour: parseInt(nigeriaTime.find(p => p.type === 'hour')?.value ?? 0),
      minute: parseInt(nigeriaTime.find(p => p.type === 'minute')?.value ?? 0),
      second: parseInt(nigeriaTime.find(p => p.type === 'second')?.value ?? 0),
    };
  
    const systemTotal = systemTime.hour * 3600 + systemTime.minute * 60 + systemTime.second;
    const lagosTotal = lagosTime.hour * 3600 + lagosTime.minute * 60 + lagosTime.second;
  
    let offsetSec = lagosTotal - systemTotal;
  
    // Handle timezone wraparound (e.g. 23:00 UTC vs 00:00 Lagos)
    if (offsetSec <= -43200) offsetSec += 86400;
    if (offsetSec > 43200) offsetSec -= 86400;
  
    return offsetSec * 1000; // convert to ms
  }
  
export function formatToNigerianTime(utcString){
    if (!utcString) return '';

    const utcDate = new Date(utcString);
    if (isNaN(utcDate.getTime())) {
        console.warn('Invalid UTC date:', utcString);
        return '';
    }

    // Nigeria is always UTC+1
    // const nigeriaOffsetInMs = 1 * 60 * 60 * 1000;
    const nigeriaOffsetInMs = getNigeriaUtcOffsetMs();
    const nigeriaDate = new Date(utcDate.getTime() + nigeriaOffsetInMs);

    return nigeriaDate.toISOString();
}
