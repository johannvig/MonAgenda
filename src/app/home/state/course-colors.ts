import type { FullCalendarComponent } from '@fullcalendar/angular';
import type { ColorKey, ColorPalette, ColorPaletteSet, CourseItem } from '../models/calendar.models';
import { getAccentBorderColor, getContrastTextColor } from '../utils/color-utils';
import { getBaseCourseName, getEventKey } from '../utils/event-utils';

export function getColorPaletteForCourse(
  courseName: string,
  originalColorKey: ColorKey,
  colors: ColorPaletteSet,
  colorsDaltonism: ColorPaletteSet,
  daltonismMode: boolean,
  customCourseColors: Map<string, string>
): ColorPalette {
  const custom = customCourseColors.get(courseName);
  if (custom) {
    const textColor = getContrastTextColor(custom);
    return { bg: custom, border: getAccentBorderColor(custom), text: textColor };
  }

  const palette = daltonismMode ? colorsDaltonism : colors;
  const colorKey: ColorKey = originalColorKey in palette ? originalColorKey : 'blue';
  return palette[colorKey];
}

export function toggleDaltonismMode(params: {
  daltonismMode: boolean;
  colors: ColorPaletteSet;
  colorsDaltonism: ColorPaletteSet;
  courseColorKeys: Map<string, ColorKey>;
  customCourseColors: Map<string, string>;
  allEvents: Array<any>;
  courses: CourseItem[];
  calendarComponent?: FullCalendarComponent;
}): void {
  const api = params.calendarComponent?.getApi?.();
  if (!api) return;

  api.getEvents().forEach(ev => {
    const evBase = getBaseCourseName(ev.title || '');
    const colorKey: ColorKey = params.courseColorKeys.get(evBase) ?? 'blue';
    const customCourseColor = params.customCourseColors.get(evBase);
    const eventKey = getEventKey(ev.title || '', ev.start, ev.end);
    const stored = params.allEvents.find(e => e.__key === eventKey);
    const useStoredCustom = !!stored?.customColor && !!stored?.backgroundColor;
    const palette = getColorPaletteForCourse(
      evBase,
      colorKey,
      params.colors,
      params.colorsDaltonism,
      params.daltonismMode,
      params.customCourseColors
    );

    const bgColor = customCourseColor
      ? customCourseColor
      : (useStoredCustom ? (stored.backgroundColor || palette.bg) : palette.bg);
    const borderColor = customCourseColor
      ? getAccentBorderColor(customCourseColor)
      : (useStoredCustom ? (stored.borderColor || getAccentBorderColor(bgColor)) : palette.border);
    const textColor = customCourseColor
      ? getContrastTextColor(customCourseColor)
      : (useStoredCustom ? (stored.textColor || getContrastTextColor(bgColor)) : palette.text);

    try {
      ev.setProp('backgroundColor', bgColor);
      ev.setProp('borderColor', borderColor);
      ev.setProp('textColor', textColor);
    } catch (err) {
      console.error('[HomePage] Error updating event color:', err);
    }
  });

  params.courses.forEach(course => {
    const customCourseColor = params.customCourseColors.get(course.name);
    if (customCourseColor) {
      course.colorFill = customCourseColor;
      course.colorBorder = getAccentBorderColor(customCourseColor);
      course.textColor = getContrastTextColor(customCourseColor);
      return;
    }
    const colorKey: ColorKey = params.courseColorKeys.get(course.name) ?? 'blue';
    const palette = getColorPaletteForCourse(
      course.name,
      colorKey,
      params.colors,
      params.colorsDaltonism,
      params.daltonismMode,
      params.customCourseColors
    );
    course.colorFill = palette.bg;
    course.colorBorder = palette.border;
    course.textColor = palette.text;
  });
}

export function applyCourseColor(params: {
  courseName: string;
  color: string;
  courses: CourseItem[];
  allEvents: Array<any>;
  customCourseColors: Map<string, string>;
  calendarComponent?: FullCalendarComponent;
}): Array<any> {
  params.customCourseColors.set(params.courseName, params.color);
  const textColor = getContrastTextColor(params.color);
  const borderColor = getAccentBorderColor(params.color);

  const api = params.calendarComponent?.getApi?.();
  if (api) {
    api.getEvents().forEach(ev => {
      const evBase = getBaseCourseName(ev.title || '');
      if (evBase === params.courseName) {
        try {
          ev.setProp('backgroundColor', params.color);
          ev.setProp('borderColor', borderColor);
          ev.setProp('textColor', textColor);
        } catch (err) {
          console.error('[HomePage] Error updating event color:', err);
        }
      }
    });
  }

  const course = params.courses.find(c => c.name === params.courseName);
  if (course) {
    course.colorFill = params.color;
    course.colorBorder = borderColor;
    course.textColor = textColor;
    course.isCustomColor = true;
  }

  return params.allEvents.map(ev => {
    if (ev.baseName !== params.courseName) return ev;
    return {
      ...ev,
      backgroundColor: params.color,
      borderColor: borderColor,
      textColor: textColor,
      customColor: false
    };
  });
}

export function resetCourseColor(params: {
  courseName: string;
  daltonismMode: boolean;
  colors: ColorPaletteSet;
  colorsDaltonism: ColorPaletteSet;
  courseColorKeys: Map<string, ColorKey>;
  courses: CourseItem[];
  allEvents: Array<any>;
  customCourseColors: Map<string, string>;
  calendarComponent?: FullCalendarComponent;
}): Array<any> {
  params.customCourseColors.delete(params.courseName);
  const paletteSet = params.daltonismMode ? params.colorsDaltonism : params.colors;
  const colorKey: ColorKey = params.courseColorKeys.get(params.courseName) ?? 'blue';
  const palette = paletteSet[colorKey] ?? paletteSet.blue;
  const textColor = palette.text || getContrastTextColor(palette.bg);

  const api = params.calendarComponent?.getApi?.();
  if (api) {
    api.getEvents().forEach(ev => {
      const evBase = getBaseCourseName(ev.title || '');
      if (evBase === params.courseName) {
        try {
          ev.setProp('backgroundColor', palette.bg);
          ev.setProp('borderColor', palette.border);
          ev.setProp('textColor', textColor);
        } catch (err) {
          console.error('[HomePage] Error resetting event color:', err);
        }
      }
    });
  }

  const updatedAllEvents = params.allEvents.map(ev => {
    if (ev.baseName !== params.courseName) return ev;
    return {
      ...ev,
      backgroundColor: palette.bg,
      borderColor: palette.border,
      textColor: textColor,
      customColor: false
    };
  });

  const course = params.courses.find(c => c.name === params.courseName);
  if (course) {
    course.colorFill = palette.bg;
    course.colorBorder = palette.border;
    course.textColor = textColor;
    course.isCustomColor = false;
  }

  return updatedAllEvents;
}
