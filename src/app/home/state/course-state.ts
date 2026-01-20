import type { FullCalendarComponent } from '@fullcalendar/angular';
import type { ColorKey, ColorPaletteSet, CourseItem } from '../models/calendar.models';
import { getContrastTextColor } from '../utils/color-utils';
import { getBaseCourseName, getEventKey } from '../utils/event-utils';
import { getColorPaletteForCourse } from './course-colors';

export interface CourseStateContext {
  colors: ColorPaletteSet;
  colorsDaltonism: ColorPaletteSet;
  daltonismMode: boolean;
  courses: CourseItem[];
  allEvents: Array<any>;
  courseColorKeys: Map<string, ColorKey>;
  rooms: string[];
  teachers: string[];
  filteredRooms: string[];
  filteredTeachers: string[];
}

export function buildCoursesFromEvents(
  context: CourseStateContext,
  events: any[]
): void {
  context.allEvents = events.map(ev => ({
    ...ev,
    baseName: getBaseCourseName(ev.title || ''),
    __key: getEventKey(ev.title || '', ev.start, ev.end),
    customColor: false
  }));

  const map = new Map<string, { name: string; colorFill: string; colorBorder?: string; textColor?: string; checked: boolean }>();

  events.forEach(ev => {
    if (!ev || !ev.title) return;
    const baseName = getBaseCourseName(ev.title || '');
    if (!baseName) return;
    if (!map.has(baseName)) {
      const colorBorder = ev.borderColor || ev.extendedProps?.borderColor || context.colors.blue.border;
      const colorFill = ev.backgroundColor || ev.background || ev.extendedProps?.backgroundColor || colorBorder || context.colors.blue.bg;
      const textColor = getContrastTextColor(colorFill);
      map.set(baseName, { name: baseName, colorFill, colorBorder, textColor, checked: true });

      let colorKey: ColorKey = 'blue';
      let colorFound = false;
      const palettes: ColorPaletteSet[] = [context.colors, context.colorsDaltonism];
      for (const palette of palettes) {
        for (const key of Object.keys(palette) as ColorKey[]) {
          const colorObj = palette[key];
          if (colorObj.bg === colorFill) {
            colorKey = key;
            colorFound = true;
            break;
          }
        }
        if (colorFound) break;
      }
      context.courseColorKeys.set(baseName, colorKey);
    }
  });

  context.courses = Array.from(map.values());

  const roomSet = new Set<string>();
  context.allEvents.forEach(ev => {
    const r = (ev?.extendedProps?.room || '').toString().trim();
    if (r && r !== '-') roomSet.add(r);
  });

  context.rooms = Array.from(roomSet).sort((a, b) => a.localeCompare(b));
  context.filteredRooms = [...context.rooms];

  const teacherSet = new Set<string>();
  context.allEvents.forEach(ev => {
    const t = (ev?.extendedProps?.teacher || '').toString().trim();
    if (t && t !== '-') teacherSet.add(t);
  });

  context.teachers = Array.from(teacherSet).sort((a, b) => a.localeCompare(b));
  context.filteredTeachers = [...context.teachers];
}

export function rebuildCoursesForVisibleRange(context: CourseStateContext): void {
  const evts = context.allEvents || [];
  const map = new Map<string, { name: string; colorFill: string; colorBorder?: string; textColor?: string; checked: boolean }>();

  evts.forEach(ev => {
    if (!ev || !ev.title) return;
    const baseName = getBaseCourseName(ev.title || '');
    if (!baseName) return;
    if (!map.has(baseName)) {
      const colorBorder = ev.borderColor || ev.extendedProps?.borderColor || context.colors.blue.border;
      const colorFill = ev.backgroundColor || ev.background || ev.extendedProps?.backgroundColor || colorBorder || context.colors.blue.bg;
      const textColor = getContrastTextColor(colorFill);
      const prev = context.courses.find(c => c.name === baseName);
      const checked = prev ? prev.checked : true;
      map.set(baseName, { name: baseName, colorFill, colorBorder, textColor, checked });
    }
  });

  context.courses = Array.from(map.values());
}

export function applyFiltersToCalendar(params: {
  context: CourseStateContext;
  viewMode: 'student' | 'room' | 'teacher';
  selectedRoom: string | null;
  selectedTeacher: string | null;
  calendarComponent?: FullCalendarComponent;
  customCourseColors: Map<string, string>;
}): void {
  const api = params.calendarComponent?.getApi?.();
  if (!api) return;

  api.removeAllEvents();

  if (params.viewMode === 'room') {
    if (!params.selectedRoom) return;

    const filtered = params.context.allEvents.filter(ev => {
      const r = (ev?.extendedProps?.room || '').toString().trim();
      return r === params.selectedRoom;
    });

    filtered.forEach(e => api.addEvent({
      title: e.title,
      start: e.start,
      end: e.end,
      extendedProps: e.extendedProps,
      backgroundColor: e.backgroundColor,
      borderColor: e.borderColor,
      textColor: e.textColor
    }));

    return;
  }

  if (params.viewMode === 'teacher') {
    if (!params.selectedTeacher) return;

    const filtered = params.context.allEvents.filter(ev => {
      const t = (ev?.extendedProps?.teacher || '').toString().trim();
      return t === params.selectedTeacher;
    });

    filtered.forEach(e => api.addEvent({
      title: e.title,
      start: e.start,
      end: e.end,
      extendedProps: e.extendedProps,
      backgroundColor: e.backgroundColor,
      borderColor: e.borderColor,
      textColor: e.textColor
    }));

    return;
  }

  const checkedCourses = new Set(
    (params.context.courses || []).filter(c => c.checked).map(c => c.name)
  );

  const filtered = params.context.allEvents.filter(e => checkedCourses.has(e.baseName));

  filtered.forEach(e => {
    const colorKey: ColorKey = params.context.courseColorKeys.get(e.baseName) ?? 'blue';
    const palette = getColorPaletteForCourse(
      e.baseName,
      colorKey,
      params.context.colors,
      params.context.colorsDaltonism,
      params.context.daltonismMode,
      params.customCourseColors
    );
    const bgColor = e.customColor ? (e.backgroundColor || palette.bg) : palette.bg;
    const borderColor = e.customColor ? (e.borderColor || palette.border) : palette.border;
    const textColor = e.customColor ? (e.textColor || palette.text) : palette.text;

    api.addEvent({
      title: e.title,
      start: e.start,
      end: e.end,
      extendedProps: e.extendedProps,
      backgroundColor: bgColor,
      borderColor: borderColor,
      textColor: textColor
    });
  });
}
