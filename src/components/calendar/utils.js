export function generateColors(numColors) {
  const colors = [];
  const saturation = 70; // Adjust as needed
  const minLightness = 40; // Minimum lightness value
  const maxLightness = 80; // Maximum lightness value

  for (let i = 0; i < numColors; i++) {
    const hue = (360 / numColors) * i;
    const lightness = minLightness + (i / numColors) * (maxLightness - minLightness);
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colors.push(color);
  }

  return colors;
}

export function getCurrentWeekDateStrings() {
  const date = new Date();
  const day = date.getDay();
  const start = date.getDate() - day + (day === 0 ? -6 : 1);
  const end = start + 6;

  const dates = [];

  for (let i = start; i <= end; i++) {
    dates.push(new Date(date.setDate(i)).toISOString().split("T")[0]);
  }

  return dates;
}

export function getCurrentWeekDates() {
  const date = new Date();
  const day = date.getDay();
  const start = date.getDate() - day + (day === 0 ? -6 : 1);
  const end = start + 6;

  const dates = [];

  for (let i = start; i <= end; i++) {
    dates.push(new Date(date.setDate(i)));
  }

  return dates;
}
export function getNextWeekDates(currentWeekDates) {
  // Get last date of current week
  const currentLastDate = currentWeekDates[currentWeekDates.length - 1];
  const nextWeekStart = new Date(currentLastDate);
  nextWeekStart.setDate(nextWeekStart.getDate() + 1);
  // Array to store previous week dates
  const nextDates = [];

  // Loop 7 days
  for (let i = 0; i < 7; i++) {
    // Add each date to array
    nextDates.push(new Date(nextWeekStart));

    // Increment day
    nextWeekStart.setDate(nextWeekStart.getDate() + 1);
  }

  return nextDates;
}

export function getPrevWeekDates(currentDates) {
  // Get first date of current week
  const currentFirstDate = currentDates[0];

  // Subtract 7 days to get start of previous week
  const prevWeekStart = new Date(currentFirstDate);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);

  // Array to store previous week dates
  const prevDates = [];

  // Loop 7 days
  for (let i = 0; i < 7; i++) {
    // Add each date to array
    prevDates.push(new Date(prevWeekStart));

    // Increment day
    prevWeekStart.setDate(prevWeekStart.getDate() + 1);
  }

  return prevDates;
}

// Helper function
function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function getEventPosition(event, cellWidth, cellHeight, headerHeight, hourOffset) {
  const { start, end } = event;
  const startDateTime = new Date(start);
  const endDateTime = new Date(end);
  const startHour = startDateTime.getHours();
  const endHour = endDateTime.getHours();

  const startRow = startHour + startDateTime.getMinutes() / 60;
  const endRow = endHour + endDateTime.getMinutes() / 60;

  // Calculate position
  const top = (startRow - hourOffset) * cellHeight + headerHeight;
  const dates = getCurrentWeekDateStrings();
  let startCol = dates.indexOf(startDateTime.toISOString().split("T")[0]) + 1;
  let endCol = dates.indexOf(endDateTime.toISOString().split("T")[0]) + 1;

  const left = 1; // startCol * (cellWidth + 1);

  return {
    top,
    left,
    height: `${(endRow - startRow) * cellHeight}px`,
  };
}

export function utcToLocalTime(utcTimeString) {
  // Create a new Date object from the UTC time string
  var utcDate = new Date(utcTimeString);

  // Extract hours, minutes, and seconds
  var hours = utcDate.getHours().toString().padStart(2, "0");
  var minutes = utcDate.getMinutes().toString().padStart(2, "0");
  var seconds = utcDate.getSeconds().toString().padStart(2, "0");

  // Format the time string as "HH:mm:ss"
  var localTimeString = hours + ":" + minutes + ":" + seconds;

  return localTimeString;
}

export function utcToLocalDate(utcDateTimeString) {
  // Parse UTC datetime string
  let utcDate = new Date(utcDateTimeString);

  // Convert to local time
  let localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000);

  // Format date string
  let dateString = localDate.toISOString().slice(0, 10);

  return dateString;
}

export function getEventMapByDate(events) {
  const eventsByDate = {};

  events.forEach((event) => {
    const dateString = utcToLocalDate(event.start);

    if (!eventsByDate[dateString]) {
      eventsByDate[dateString] = [];
    }

    eventsByDate[dateString].push(event);
  });
  return eventsByDate;
}

export function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;

  // return date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
}
export function getWeekdayName(date) {
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return weekdayNames[date.getDay()];
}
