import type { EventContentArg } from '@fullcalendar/core';
import { getContrastTextColor } from '../utils/color-utils';

export function buildEventContent(arg: EventContentArg): { html: string } {
  const event = arg.event;

  let timeText = '';
  if (event.start && event.end) {
    const formatOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    const startStr = event.start.toLocaleTimeString('fr-FR', formatOptions);
    const endStr = event.end.toLocaleTimeString('fr-FR', formatOptions);
    timeText = `${startStr} - ${endStr}`;
  }

  const room = event.extendedProps['room'] || '';
  const teacher = event.extendedProps['teacher'] || '';

  let durationMinutes = 0;
  if (event.start && event.end) {
    const diffMs = event.end.getTime() - event.start.getTime();
    durationMinutes = diffMs / (1000 * 60);
  }

  let detailsHtml = '';
  if (durationMinutes <= 60) {
    if (room && teacher) {
      detailsHtml = `<div class="text-ellipsis">${room} - ${teacher}</div>`;
    } else {
      detailsHtml = `<div class="text-ellipsis">${room}${teacher}</div>`;
    }
  } else {
    detailsHtml = `<div>${room}</div><div style="opacity: 0.8">${teacher}</div>`;
  }

  const bgColor = event.backgroundColor || '#ffffff';
  const textColor = getContrastTextColor(bgColor);
  const hasNote = !!event.extendedProps?.['note'];
  const noteBadge = hasNote ? '<span class="note-indicator" aria-hidden="true">N</span>' : '';

  return {
    html: `
      <div class="custom-event-content" style="color: ${textColor}">
        <div class="event-title">${event.title}</div>
        <div class="event-details">${detailsHtml}</div>
        <div class="event-time">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${timeText}
        </div>
        ${noteBadge}
      </div>
    `
  };
}
