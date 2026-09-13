// This function takes a duration string (e.g., "2d", "3h", "15m", "30s") 
// and returns the date after that duration from the current date and time.
const getDateAfterDuration = (duration) => {
    const currentDate = new Date();
    const parts = duration.match(/(\d+)([dhms])/);
    if (!parts) return null;
  
    const amount = parseInt(parts[1], 10);
    const unit = parts[2];
    let multiplier;
  
    switch (unit) {
      case 'd':
        multiplier = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        break;
      case 'h':
        multiplier = 60 * 60 * 1000; // 1 hour in milliseconds
        break;
      case 'm':
        multiplier = 60 * 1000; // 1 minute in milliseconds
        break;
      case 's':
        multiplier = 1000; // 1 second in milliseconds
        break;
      default:
        return null;
    }
  
    const futureDate = new Date(currentDate.getTime() + amount * multiplier);
    return futureDate;
  };
  

// This function takes a duration in milliseconds and returns the date after that duration from the current date and time.
const currentDateTime = () => {
    const date = new Date();
    const currentDataTime = date.toLocaleString([], { hour12: true });
    return currentDataTime;
  };
  
module.exports = {
    currentDateTime,
    getDateAfterDuration
};
