import type { FullCalendarComponent } from '@fullcalendar/angular';
import type { ModalController } from '@ionic/angular';
import type { ColorKey, ColorPaletteSet, CourseItem } from '../models/calendar.models';
import { getContrastTextColor } from '../utils/color-utils';
import { getBaseCourseName } from '../utils/event-utils';
import { applyCourseColor } from './course-colors';

interface CourseSettingsContext {
  modalCtrl: ModalController;
  calendarComponent?: FullCalendarComponent;
  colors: ColorPaletteSet;
  colorsDaltonism: ColorPaletteSet;
  daltonismMode: boolean;
  courses: CourseItem[];
  allEvents: Array<any>;
  customCourseColors: Map<string, string>;
  courseColorKeys: Map<string, ColorKey>;
  onShowToast: (message: string) => Promise<void>;
  setAllEvents: (events: Array<any>) => void;
  onToggleDaltonism: (enabled: boolean) => void;
  rebuildCoursesFromEvents: () => void;
}

export async function openCourseSettingsModal(context: CourseSettingsContext): Promise<void> {
  if (!context.courses || context.courses.length === 0) {
    context.rebuildCoursesFromEvents();
  }

  const coursesToShow = context.courses.map(c => ({ ...c }));

  const onColorChange = (courseName: string, newColor: string) => {
    const updatedEvents = applyCourseColor({
      courseName,
      color: newColor,
      courses: context.courses,
      allEvents: context.allEvents,
      customCourseColors: context.customCourseColors,
      calendarComponent: context.calendarComponent
    });
    context.setAllEvents(updatedEvents);
    context.onShowToast(`Couleur appliquée à ${courseName}.`);
  };

  const onDaltonismToggle = (enabled: boolean) => {
    context.onToggleDaltonism(enabled);
    context.onShowToast(enabled ? 'Mode daltonisme activé.' : 'Mode daltonisme désactivé.');
  };

  const onResetColors = () => {
    context.customCourseColors.clear();

    const api = context.calendarComponent?.getApi?.();
    if (!api) return;

    context.rebuildCoursesFromEvents();

    api.getEvents().forEach(ev => {
      const evBase = getBaseCourseName(ev.title || '');
      const course = context.courses.find(c => c.name === evBase);

      if (course) {
        try {
          ev.setProp('backgroundColor', course.colorFill);
          ev.setProp('borderColor', course.colorBorder);
          ev.setProp('textColor', course.textColor);
        } catch (err) {
          console.error('[HomePage] Error updating event:', err);
        }
      }
    });
    context.onShowToast('Couleurs réinitialisées.');
  };

  const mod = await import('../components/course-settings/course-settings.component');
  const CourseSettingsComponent = mod.CourseSettingsComponent;

  const modal = await context.modalCtrl.create({
    component: CourseSettingsComponent,
    componentProps: {
      courses: coursesToShow,
      onColorChange: onColorChange,
      onDaltonismToggle: onDaltonismToggle,
      onResetColors: onResetColors,
      daltonismMode: context.daltonismMode,
      courseColorKeys: context.courseColorKeys,
      customCourseColors: context.customCourseColors,
      colors: context.colors,
      colorsDaltonism: context.colorsDaltonism,
      getContrastTextColor: getContrastTextColor
    }
  });

  await modal.present();
  const res = await modal.onWillDismiss();

  if (res && res.data && res.data.courses) {
    const updated: Array<any> = res.data.courses;

    updated.forEach(u => {
      const prev = context.courses.find(c => c.name === u.name);
      if (prev) {
        prev.colorFill = u.colorFill;
        prev.textColor = u.textColor;
        prev.isCustomColor = u.isCustomColor;
      }
    });

    if (context.calendarComponent) {
      const api = context.calendarComponent.getApi();

      const updatedAllEvents = context.allEvents.map(ev => {
        const base = (ev.title || '').replace(/\s*\(.*\)/, '').trim();
        const newCourse = updated.find(u => u.name === base);
        if (newCourse) {
          return { ...ev, backgroundColor: newCourse.colorFill };
        }
        return ev;
      });
      context.setAllEvents(updatedAllEvents);

      api.getEvents().forEach(ev => {
        const base = (ev.title || '').replace(/\s*\(.*\)/, '').trim();
        const newCourse = updated.find(u => u.name === base);
        if (newCourse) {
          try { ev.setProp('backgroundColor', newCourse.colorFill); } catch (err) {}
          try { ev.setProp('borderColor', newCourse.colorBorder || newCourse.colorFill); } catch (err) {}
        }
      });
    }
  }
}
