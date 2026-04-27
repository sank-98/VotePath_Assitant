/**
 * Utility to generate Google Calendar links for election events.
 * This is a meaningful integration of Google Services.
 */
export function generateGoogleCalendarUrl(event: {
  title: string;
  details: string;
  location: string;
  start: string; // YYYYMMDD
  end: string;   // YYYYMMDD
}) {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: event.title,
    details: event.details,
    location: event.location,
    dates: `${event.start}/${event.end}`,
  });
  return `${baseUrl}&${params.toString()}`;
}

export function handleAddToCalendar(stateName: string, electionDate: string, language: 'en' | 'hi') {
  // Parsing dd/mm/yyyy or year
  const isYearOnly = electionDate.length === 4;
  const startDate = isYearOnly ? `${electionDate}0401` : electionDate.split('/').reverse().join('') + 'T070000';
  const endDate = isYearOnly ? `${electionDate}0501` : electionDate.split('/').reverse().join('') + 'T180000';

  const title = language === 'hi' 
    ? `${stateName} चुनाव - मतदान दिवस` 
    : `${stateName} Election - Voting Day`;
  
  const details = language === 'hi'
    ? `वोटपथ भारत द्वारा जानकारी। कृपया अपने मतदान केंद्र पर वोटर आईडी के साथ समय पर पहुंचें।`
    : `Provided by VotePath BHARAT. Please reach your polling booth on time with your Voter ID.`;

  const url = generateGoogleCalendarUrl({
    title,
    details,
    location: `${stateName}, India`,
    start: startDate,
    end: endDate
  });

  window.open(url, '_blank');
}
