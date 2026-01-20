import { CalendarOptions, type DateSelectArg } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

import { buildCalendarEvents } from '../data/calendar-events';
import type { ColorPaletteSet } from '../models/calendar.models';
import { buildEventContent } from './event-content';

export interface CalendarOptionsConfig {
  selectedDate: string;
  colors: ColorPaletteSet;
  onDatesSet: (start: Date, end: Date) => void;
  onEventClick: (event: any) => void;
}

export function createCalendarOptions(config: CalendarOptionsConfig): CalendarOptions {
  return {
    plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: frLocale,
    headerToolbar: false,
    weekends: false,
    initialDate: config.selectedDate,

    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    slotDuration: '00:15:00',
    slotLabelInterval: '01:00',
    allDaySlot: false,
    nowIndicator: true,

    aspectRatio: 1.5,

    height: '90%',
    contentHeight: 'auto',
    expandRows: false,
    displayEventTime: false,

    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      omitZeroMinute: false,
      meridiem: false
    },

    dayHeaderFormat: { weekday: 'long', day: 'numeric' },

    datesSet: (dateInfo) => {
      config.onDatesSet(dateInfo.start, dateInfo.end);
    },

    eventClick: (info) => {
      info.jsEvent.preventDefault();
      config.onEventClick(info.event);
    },

    eventContent: buildEventContent,

    events: buildCalendarEvents(config.colors)
  };
}
