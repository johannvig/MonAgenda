import type { FullCalendarComponent } from '@fullcalendar/angular';
import type { ModalController } from '@ionic/angular';
import type { ColorKey, ColorPaletteSet, CourseItem } from '../models/calendar.models';
import { EventDetailComponent } from '../components/event-detail/event-detail.component';
import { getAccentBorderColor, getContrastTextColor } from '../utils/color-utils';
import { getBaseCourseName, getEventKey } from '../utils/event-utils';
import { applyCourseColor, resetCourseColor } from './course-colors';

interface EventModalContext {
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
  onTeacherSelected: (teacher: string) => void;
  setAllEvents: (events: Array<any>) => void;
}

export async function openEventDetailsModal(context: EventModalContext, event: any): Promise<void> {
  const props = event.extendedProps || {};
  let lastNote = (props['note'] ?? '').toString();
  let noteChanged = false;

  let dateStr = '';
  if (event.start && event.end) {
    const day = event.start.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const timeStart = event.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const timeEnd = event.end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    dateStr = `${day}, ${timeStart}-${timeEnd}`;
  }

  const modal = await context.modalCtrl.create({
    component: EventDetailComponent,
    componentProps: {
      eventTitle: event.title,
      dateFormatted: dateStr,
      teacher: props['teacher'],
      room: props['room'],
      organism: 'FIL 1ère année',
      note: props['note'] || '',
      color: event.backgroundColor || context.colors.blue.bg,
      onNoteChange: (note: string) => {
        if (note === lastNote) return;
        lastNote = note;
        noteChanged = true;
        event.setExtendedProp('note', note);

        const eventKey = getEventKey(event.title || '', event.start, event.end);
        const updatedEvents = context.allEvents.map(ev => {
          if (ev.__key !== eventKey) return ev;
          return {
            ...ev,
            extendedProps: { ...(ev.extendedProps || {}), note: note }
          };
        });
        context.setAllEvents(updatedEvents);
      }
    },
    cssClass: 'event-detail-modal',
    backdropDismiss: true,
    mode: 'ios'
  });

  await modal.present();
  const res = await modal.onWillDismiss();

  if (res?.data?.action === 'teacher_schedule' && res.data.teacher) {
    context.onTeacherSelected(res.data.teacher);
  }

  if ((res?.data?.action === 'color_change' || res?.data?.action === 'color_change_course') && res.data.color) {
    const color = res.data.color as string;
    const borderColor = getAccentBorderColor(color);
    event.setProp('backgroundColor', color);
    event.setProp('borderColor', borderColor);
    event.setProp('textColor', getContrastTextColor(color));

    const eventKey = getEventKey(event.title || '', event.start, event.end);
    const updatedEvents = context.allEvents.map(ev => {
      if (ev.__key !== eventKey) return ev;
      return {
        ...ev,
        backgroundColor: color,
        borderColor: borderColor,
        textColor: getContrastTextColor(color),
        customColor: true
      };
    });
    context.setAllEvents(updatedEvents);
    await context.onShowToast('Couleur appliquée à ce cours.');
  }

  if (res?.data?.action === 'color_change_same_course' && res.data.color) {
    const color = res.data.color as string;
    const baseName = getBaseCourseName(event.title || '');
    if (baseName) {
      const updatedEvents = applyCourseColor({
        courseName: baseName,
        color,
        courses: context.courses,
        allEvents: context.allEvents,
        customCourseColors: context.customCourseColors,
        calendarComponent: context.calendarComponent
      });
      context.setAllEvents(updatedEvents);
    }
    await context.onShowToast('Couleur appliquée aux cours du même intitulé.');
  }

  if (res?.data?.action === 'color_reset') {
    const baseName = getBaseCourseName(event.title || '');
    if (baseName) {
      const updatedEvents = resetCourseColor({
        courseName: baseName,
        daltonismMode: context.daltonismMode,
        colors: context.colors,
        colorsDaltonism: context.colorsDaltonism,
        courseColorKeys: context.courseColorKeys,
        courses: context.courses,
        allEvents: context.allEvents,
        customCourseColors: context.customCourseColors,
        calendarComponent: context.calendarComponent
      });
      context.setAllEvents(updatedEvents);
    }
    await context.onShowToast('Couleur réinitialisée.');
  }

  if (noteChanged) {
    await context.onShowToast(lastNote.trim() ? 'Note enregistrée.' : 'Note supprimée.');
  }
}
