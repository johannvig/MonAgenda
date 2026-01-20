import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { getWeek } from 'date-fns';

import { BASE_COLORS, DALTONISM_COLORS } from './data/color-palettes';
import type { CourseItem, ColorKey, ColorPaletteSet } from './models/calendar.models';
import { createCalendarOptions } from './state/calendar-options';
import { buildCoursesFromEvents, rebuildCoursesForVisibleRange, applyFiltersToCalendar } from './state/course-state';
import { openCourseSettingsModal } from './state/course-settings-modal';
import { openEventDetailsModal } from './state/event-modal';
import { toggleDaltonismMode as applyDaltonismMode } from './state/course-colors';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {
viewMode: 'student' | 'room' | 'teacher' = 'student';
selectedTeacher: string | null = null;

  @ViewChild('myCalendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('layoutRow') layoutRow!: ElementRef<HTMLElement>;

  currentWeek: number = 0;
  currentYear: number = 0;
  // Valeur sélectionnée pour l'`ion-datetime` (ISO string)
  selectedDate: string = new Date().toISOString();

  // Définition des palettes de couleurs (centralisées)
  colors: ColorPaletteSet = BASE_COLORS;
  colorsDaltonism: ColorPaletteSet = DALTONISM_COLORS;

  daltonismMode: boolean = false;


/** SALLES */
rooms: string[] = [
  'JV 120', 'JV 122', 'JV 127', 'NA_J147 (V-40)', 'Amphi A', 'Salle B12'
];
filteredRooms: string[] = [];
roomQuery = '';
selectedRoom: string | null = null;

/** PROFESSEURS */
teachers: string[] = [];
filteredTeachers: string[] = [];
teacherQuery = '';

private isResizing = false;
private startX = 0;
private startLeftWidth = 0;
private resizeRaf: number | null = null;

ngOnInit() {
  this.filteredRooms = [...this.rooms];
  this.filteredTeachers = [...this.teachers];

  this.calendarOptions = createCalendarOptions({
    selectedDate: this.selectedDate,
    colors: this.colors,
    onDatesSet: (start: Date, end: Date) => {
      this.currentWeek = getWeek(start, { weekStartsOn: 1 });
      this.currentYear = start.getFullYear();
      rebuildCoursesForVisibleRange(this);
    },
    onEventClick: (event) => this.openEventDetails(event)
  });

  const events = (this.calendarOptions as any).events || [];
  buildCoursesFromEvents(this, events);
}

onViewModeChange(nextMode?: 'student' | 'room' | 'teacher') {
  if (nextMode) {
    this.viewMode = nextMode;
  }
  if (this.viewMode !== 'teacher') {
    this.selectedTeacher = null;
  }
  this.applyFiltersToCalendar();
}


filterRooms() {
  const q = (this.roomQuery || '').toLowerCase().trim();
  this.filteredRooms = !q
    ? [...this.rooms]
    : this.rooms.filter(r => r.toLowerCase().includes(q));
}

selectRoom(room: string) {
  this.selectedRoom = room;
  this.applyFiltersToCalendar();
}

filterTeachers() {
  const q = (this.teacherQuery || '').toLowerCase().trim();
  this.filteredTeachers = !q
    ? [...this.teachers]
    : this.teachers.filter(t => t.toLowerCase().includes(q));
}

selectTeacher(teacher: string) {
  this.selectedTeacher = teacher;
  this.applyFiltersToCalendar();
}

startResize(event: MouseEvent | TouchEvent | PointerEvent) {
  if (window.innerWidth < 992) return;
  event.preventDefault();

  const clientX = this.getClientX(event);
  const rowEl = this.layoutRow?.nativeElement;
  if (!rowEl) return;

  if (event instanceof PointerEvent) {
    const target = event.target as HTMLElement | null;
    if (target && target.setPointerCapture) {
      target.setPointerCapture(event.pointerId);
    }
  }

  const leftEl = rowEl.querySelector<HTMLElement>('.calendar-col');
  const rightEl = rowEl.querySelector<HTMLElement>('.side-col');
  if (!leftEl || !rightEl) return;

  const currentLeft = leftEl.getBoundingClientRect().width;
  const currentRight = rightEl.getBoundingClientRect().width;
  const total = currentLeft + currentRight;

  this.isResizing = true;
  this.startX = clientX;
  this.startLeftWidth = currentLeft || (total * 0.75);
  rowEl.classList.add('is-resizing');
}

@HostListener('window:mousemove', ['$event'])
onResizeMove(event: MouseEvent) {
  if (!this.isResizing) return;
  this.applyResize(event.clientX);
}

@HostListener('window:pointermove', ['$event'])
onResizePointerMove(event: PointerEvent) {
  if (!this.isResizing) return;
  this.applyResize(event.clientX);
}

@HostListener('window:touchmove', ['$event'])
onResizeTouchMove(event: TouchEvent) {
  if (!this.isResizing) return;
  if (event.touches.length === 0) return;
  this.applyResize(event.touches[0].clientX);
}

@HostListener('window:mouseup')
@HostListener('window:pointerup')
@HostListener('window:touchend')
onResizeEnd() {
  if (!this.isResizing) return;
  this.isResizing = false;
  const rowEl = this.layoutRow?.nativeElement;
  if (rowEl) {
    rowEl.classList.remove('is-resizing');
  }
  this.scheduleCalendarResize(true);
}

@HostListener('window:resize')
onWindowResize() {
  if (window.innerWidth >= 992) return;
  this.resetLayoutForMobile();
}

private getClientX(event: MouseEvent | TouchEvent | PointerEvent): number {
  if (event instanceof TouchEvent) {
    return event.touches[0]?.clientX || 0;
  }
  return event.clientX;
}

private applyResize(clientX: number) {
  const rowEl = this.layoutRow?.nativeElement;
  if (!rowEl) return;

  const leftEl = rowEl.querySelector<HTMLElement>('.calendar-col');
  const rightEl = rowEl.querySelector<HTMLElement>('.side-col');
  if (!leftEl || !rightEl) return;

  const total =
    rowEl.getBoundingClientRect().width ||
    leftEl.getBoundingClientRect().width + rightEl.getBoundingClientRect().width;
  if (!total) return;
  const minLeft = total * 0.55;
  const maxLeft = total * 0.85;

  const delta = clientX - this.startX;
  const nextLeft = Math.min(maxLeft, Math.max(minLeft, this.startLeftWidth + delta));
  const leftPercent = (nextLeft / total) * 100;
  const rightPercent = 100 - leftPercent;

  rowEl.style.setProperty('--calendar-col-width', `${leftPercent}%`, 'important');
  rowEl.style.setProperty('--side-col-width', `${rightPercent}%`, 'important');
  leftEl.style.setProperty('flex', `0 0 ${leftPercent}%`, 'important');
  leftEl.style.setProperty('max-width', `${leftPercent}%`, 'important');
  leftEl.style.setProperty('width', `${leftPercent}%`, 'important');
  rightEl.style.setProperty('flex', `0 0 ${rightPercent}%`, 'important');
  rightEl.style.setProperty('max-width', `${rightPercent}%`, 'important');
  rightEl.style.setProperty('width', `${rightPercent}%`, 'important');
  this.scheduleCalendarResize(false);
}

private resetLayoutForMobile() {
  const rowEl = this.layoutRow?.nativeElement;
  if (!rowEl) return;

  const leftEl = rowEl.querySelector<HTMLElement>('.calendar-col');
  const rightEl = rowEl.querySelector<HTMLElement>('.side-col');
  if (!leftEl || !rightEl) return;

  rowEl.classList.remove('is-resizing');
  rowEl.style.removeProperty('--calendar-col-width');
  rowEl.style.removeProperty('--side-col-width');
  leftEl.style.removeProperty('flex');
  leftEl.style.removeProperty('max-width');
  leftEl.style.removeProperty('width');
  rightEl.style.removeProperty('flex');
  rightEl.style.removeProperty('max-width');
  rightEl.style.removeProperty('width');
  this.scheduleCalendarResize(true);
}

private scheduleCalendarResize(force: boolean) {
  if (this.resizeRaf) {
    cancelAnimationFrame(this.resizeRaf);
  }
  this.resizeRaf = requestAnimationFrame(() => {
    this.resizeRaf = null;
    const api = this.calendarComponent?.getApi?.();
    if (!api) return;
    api.updateSize();
    if (force) {
      // Ensure nested layout settles after drag ends.
      setTimeout(() => api.updateSize(), 0);
    }
  });
}


  calendarOptions!: CalendarOptions;

  // Liste des cours créée dynamiquement depuis `calendarOptions.events`.
  courses: CourseItem[] = [];
  // Tous les events d'origine (avec baseName) pour pouvoir les (re)ajouter au calendrier
  allEvents: Array<any> = [];
  // Stocke les couleurs personnalisées par cours (nom -> couleur hex)
  customCourseColors: Map<string, string> = new Map();
  // Stocke la clé de couleur originale pour chaque cours (pour pouvoir switcher entre palettes)
  courseColorKeys: Map<string, ColorKey> = new Map();

constructor(
  private modalCtrl: ModalController,
  private toastCtrl: ToastController
) {}

  private async showActionToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1600,
      position: 'bottom',
      icon: 'checkmark-circle-outline',
      cssClass: 'action-toast'
    });
    await toast.present();
  }

  async showFakeNotif() {
  const toast = await this.toastCtrl.create({
    message: `Vous n’avez pas badgé\nIl vous reste encore 15 minutes pour aller badger.`,

    duration: 2500,
    position: 'top',
    cssClass: 'fake-notif-toast',
    icon: 'warning-outline',
    buttons: [{ icon: 'close', role: 'cancel' }]
  });

  await toast.present();
}

toggleDaltonismFromHeader() {
  const enabled = !this.daltonismMode;
  this.toggleDaltonismMode(enabled);
  this.showActionToast(enabled ? 'Mode daltonisme activé.' : 'Mode daltonisme désactivé.');
}

  toggleDaltonismMode(enabled: boolean) {
    this.daltonismMode = enabled;
    applyDaltonismMode({
      daltonismMode: this.daltonismMode,
      colors: this.colors,
      colorsDaltonism: this.colorsDaltonism,
      courseColorKeys: this.courseColorKeys,
      customCourseColors: this.customCourseColors,
      allEvents: this.allEvents,
      courses: this.courses,
      calendarComponent: this.calendarComponent
    });
  }

  // Open the course settings modal
  async openSettings() {
    await openCourseSettingsModal({
      modalCtrl: this.modalCtrl,
      calendarComponent: this.calendarComponent,
      colors: this.colors,
      colorsDaltonism: this.colorsDaltonism,
      daltonismMode: this.daltonismMode,
      courses: this.courses,
      allEvents: this.allEvents,
      customCourseColors: this.customCourseColors,
      courseColorKeys: this.courseColorKeys,
      onShowToast: (message: string) => this.showActionToast(message),
      setAllEvents: (events) => { this.allEvents = events; },
      onToggleDaltonism: (enabled: boolean) => this.toggleDaltonismMode(enabled),
      rebuildCoursesFromEvents: () => {
        const events = (this.calendarOptions as any).events || [];
        buildCoursesFromEvents(this, events);
      }
    });
  }

  private applyFiltersToCalendar() {
    applyFiltersToCalendar({
      context: this,
      viewMode: this.viewMode,
      selectedRoom: this.selectedRoom,
      selectedTeacher: this.selectedTeacher,
      calendarComponent: this.calendarComponent,
      customCourseColors: this.customCourseColors
    });
  }


onCourseToggle(course: { name: string; colorFill: string; colorBorder?: string; checked: boolean }) {
  if (this.viewMode !== 'student') return; // en mode salle, on ignore
  this.applyFiltersToCalendar();
}

uncheckAllCourses() {
  this.courses.forEach(course => course.checked = false);
  this.applyFiltersToCalendar();
}

checkAllCourses() {
  this.courses.forEach(course => course.checked = true);
  this.applyFiltersToCalendar();
}

  goToday() {
    if (this.calendarComponent) {
      this.selectedDate = new Date().toISOString();
      try {
        this.calendarComponent.getApi().today();
      } catch (err) {
        this.calendarComponent.getApi().gotoDate(new Date());
      }
    }
  }

  prevWeek() {
    if (this.calendarComponent) {
      this.calendarComponent.getApi().prev();
    }
  }

  nextWeek() {
    if (this.calendarComponent) {
      this.calendarComponent.getApi().next();
    }
  }

  changeDate(event: any) {
    const selectedDate = event.detail.value;
    this.selectedDate = selectedDate;
    if (this.calendarComponent) {
      this.calendarComponent.getApi().gotoDate(selectedDate);
    }
  }

  // --- NOUVELLE MÉTHODE POUR OUVRIR LA POPUP ---
  async openEventDetails(event: any) {
    await openEventDetailsModal({
      modalCtrl: this.modalCtrl,
      calendarComponent: this.calendarComponent,
      colors: this.colors,
      colorsDaltonism: this.colorsDaltonism,
      daltonismMode: this.daltonismMode,
      courses: this.courses,
      allEvents: this.allEvents,
      customCourseColors: this.customCourseColors,
      courseColorKeys: this.courseColorKeys,
      onShowToast: (message: string) => this.showActionToast(message),
      onTeacherSelected: (teacher: string) => {
        this.selectedTeacher = teacher;
        this.viewMode = 'teacher';
        this.teacherQuery = '';
        this.filteredTeachers = [...this.teachers];
        this.applyFiltersToCalendar();
      },
      setAllEvents: (events) => { this.allEvents = events; }
    }, event);
  }
}
