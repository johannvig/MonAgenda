import { Component, ViewChild} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { AlertController, ModalController } from '@ionic/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { getWeek } from 'date-fns';

// Utility: detect if a color is too dark and return appropriate text color
function getContrastTextColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance using relative luminance formula (WCAG)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // If luminance < 0.5, background is dark, use white text
  return luminance < 0.5 ? '#ffffff' : '#000000';
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {

  @ViewChild('myCalendar') calendarComponent!: FullCalendarComponent;

  currentWeek: number = 0;
  currentYear: number = 0;
  // Valeur sélectionnée pour l'`ion-datetime` (ISO string)
  selectedDate: string = new Date().toISOString();
  
  // Mode daltonisme
  daltonismMode: boolean = false;

  // Définition des palettes de couleurs
  colors = {
    blue:   { bg: '#dbeafe', border: '#3b82f6', text: '#1e3a8a' }, 
    green:  { bg: '#dcfce7', border: '#22c55e', text: '#14532d' }, 
    yellow: { bg: '#fef9c3', border: '#facc15', text: '#854d0e' }, 
    cyan:   { bg: '#cffafe', border: '#06b6d4', text: '#164e63' }, 
    gray:   { bg: '#f3f4f6', border: '#9ca3af', text: '#374151' }  
  };

  // Palettes daltonisme (protanopie, deutéranopie, tritanopie)
  // Utilise des couleurs plus distinctes pour les daltoniens
  colorsDaltonism = {
    blue:   { bg: '#0173B2', border: '#0173B2', text: '#ffffff' },    // Bleu
    green:  { bg: '#DE8F05', border: '#DE8F05', text: '#ffffff' },    // Orange
    yellow: { bg: '#CC78BC', border: '#CC78BC', text: '#ffffff' },    // Magenta
    cyan:   { bg: '#029E73', border: '#029E73', text: '#ffffff' },    // Vert
    gray:   { bg: '#ECE133', border: '#ECE133', text: '#000000' }     // Jaune
  };

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: frLocale,
    headerToolbar: false,
    weekends: false,
    initialDate: '2025-11-24', 
    
    // --- HORAIRES & TAILLE ---
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    slotDuration: '00:15:00', 
    slotLabelInterval: '01:00', 
    allDaySlot: false,
    nowIndicator: true,

    // C'EST ICI LE SECRET POUR COMPRESSER LA HAUTEUR :
    // "aspectRatio" contrôle la largeur vs hauteur. 
    // Plus le chiffre est grand, plus le calendrier est "plat" (écrasé).
    // Essayez 2 ou 2.5 pour tasser verticalement.
    aspectRatio: 1.5, 
    
    // On s'assure qu'il n'essaie pas de remplir tout l'écran
    height: '90%',        // Force le calendrier à respecter la hauteur du parent
    contentHeight: 'auto',
    expandRows: false,
    displayEventTime: false, 

    slotLabelFormat: {
      hour: '2-digit', minute: '2-digit', omitZeroMinute: false, meridiem: false
    },

    dayHeaderFormat: { weekday: 'long', day: 'numeric' },

    datesSet: (dateInfo) => {
      this.currentWeek = getWeek(dateInfo.start, { weekStartsOn: 1 });
      this.currentYear = dateInfo.start.getFullYear();
      // Rebuild the course list to reflect only events visible in the current range
      try {
        (this as any).rebuildCoursesForVisibleRange?.(dateInfo.start, dateInfo.end);
      } catch (e) {
        // defensive: ignore if method is not available for any reason
      }
    },

    // --- DESIGN DES COURS ---
    eventContent: (arg) => {
      const event = arg.event;
      
      // Calcul manuel de l'heure
      let myTimeText = '';
      if (event.start && event.end) {
        const formatOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
        const startStr = event.start.toLocaleTimeString('fr-FR', formatOptions);
        const endStr = event.end.toLocaleTimeString('fr-FR', formatOptions);
        myTimeText = `${startStr} - ${endStr}`;
      }

      const room = event.extendedProps['room'] || '';
      const teacher = event.extendedProps['teacher'] || '';

      // Calcul durée
      let durationMinutes = 0;
      if (event.start && event.end) {
        const diffMs = event.end.getTime() - event.start.getTime();
        durationMinutes = diffMs / (1000 * 60);
      }

      let detailsHtml = '';
      
      // CHANGEMENT ICI : Condition stricte <= 60 minutes (1h)
      if (durationMinutes <= 60) {
        // Mode compact (Tout sur une ligne)
        if(room && teacher) {
           detailsHtml = `<div class="text-ellipsis">${room} - ${teacher}</div>`;
        } else {
           detailsHtml = `<div class="text-ellipsis">${room}${teacher}</div>`;
        }
      } else {
        // Mode normal (> 1h) : L'un au dessus de l'autre
        detailsHtml = `<div>${room}</div><div style="opacity: 0.8">${teacher}</div>`;
      }

      return {
        html: `
          <div class="custom-event-content">
            <div class="event-title">${event.title}</div>
            <div class="event-details">${detailsHtml}</div>
            <div class="event-time">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${myTimeText}
            </div>
          </div>
        `
      };
    },

    // --- DONNÉES DE L'EMPLOI DU TEMPS ---
    events: [
      // LUNDI 24
      {
        title: 'Sport (APSA)',
        start: '2025-11-24T08:00:00', end: '2025-11-24T10:00:00',
        extendedProps: { room: 'Gymnase', teacher: 'M. LEGRAND' },
        backgroundColor: this.colors.cyan.bg, borderColor: this.colors.cyan.border, textColor: this.colors.cyan.text
      },
      {
        title: 'Maths (Cours)',
        start: '2025-11-24T11:00:00', end: '2025-11-24T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. VIGNEAU' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },
      {
        title: 'Conception Log.',
        start: '2025-11-24T13:30:00', end: '2025-11-24T14:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. CHENE' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },
      {
        title: 'Conception Log.',
        start: '2025-11-24T15:00:00', end: '2025-11-24T16:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. CHENE' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },
      {
        title: 'Conception Log.',
        start: '2025-11-24T16:30:00', end: '2025-11-24T17:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. CHENE' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },

      // MARDI 25
      {
        title: 'Maths (EVAL)',
        start: '2025-11-25T08:00:00', end: '2025-11-25T09:15:00',
        extendedProps: { room: 'NA-G. Charpak', teacher: 'Mme. VIGNEAU' },
        backgroundColor: this.colors.green.bg, borderColor: this.colors.green.border, textColor: this.colors.green.text
      },
      {
        title: 'Maths (EVAL)',
        start: '2025-11-25T09:30:00', end: '2025-11-25T10:45:00',
        extendedProps: { room: 'NA-G. Charpak', teacher: 'Mme. VIGNEAU' },
        backgroundColor: this.colors.green.bg, borderColor: this.colors.green.border, textColor: this.colors.green.text
      },
      {
        title: 'Anglais',
        start: '2025-11-25T11:00:00', end: '2025-11-25T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. WILSON' },
        backgroundColor: this.colors.yellow.bg, borderColor: this.colors.yellow.border, textColor: this.colors.yellow.text
      },
      {
        title: 'Compréhension Ent.',
        start: '2025-11-25T13:30:00', end: '2025-11-25T14:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. DUMAS' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },
      {
        title: 'Compréhension Ent.',
        start: '2025-11-25T15:00:00', end: '2025-11-25T16:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. DUMAS' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },
      {
        title: 'Compréhension Ent.',
        start: '2025-11-25T16:30:00', end: '2025-11-25T17:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. DUMAS' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },

      // MERCREDI 26
      {
        title: 'IHM',
        start: '2025-11-26T08:00:00', end: '2025-11-26T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. ROCHE' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },
      {
        title: 'IHM',
        start: '2025-11-26T09:30:00', end: '2025-11-26T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. ROCHE' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },
      {
        title: 'IHM',
        start: '2025-11-26T11:00:00', end: '2025-11-26T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. ROCHE' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },
      {
        title: 'Lancement Comm.',
        start: '2025-11-26T13:30:00', end: '2025-11-26T16:15:00',
        extendedProps: { room: 'NA-J142 / J147', teacher: 'Mme. FABRE' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },

      // JEUDI 27
      {
        title: 'Maths Discrètes',
        start: '2025-11-27T08:00:00', end: '2025-11-27T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. PERRIN' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },
      {
        title: 'Maths Discrètes',
        start: '2025-11-27T09:30:00', end: '2025-11-27T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. PERRIN' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },
      {
        title: 'Maths Discrètes',
        start: '2025-11-27T11:00:00', end: '2025-11-27T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. PERRIN' },
        backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text
      },

      // VENDREDI 28
      {
        title: 'Anglais',
        start: '2025-11-28T08:00:00', end: '2025-11-28T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. WILSON' },
        backgroundColor: this.colors.yellow.bg, borderColor: this.colors.yellow.border, textColor: this.colors.yellow.text
      },
      {
        title: 'Anglais',
        start: '2025-11-28T09:30:00', end: '2025-11-28T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. WILSON' },
        backgroundColor: this.colors.yellow.bg, borderColor: this.colors.yellow.border, textColor: this.colors.yellow.text
      },
      {
        title: 'Archi Distribuée',
        start: '2025-11-28T13:30:00', end: '2025-11-28T14:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. TORRES' },
        backgroundColor: this.colors.gray.bg, borderColor: this.colors.gray.border, textColor: this.colors.gray.text
      },
      {
        title: 'Archi Distribuée',
        start: '2025-11-28T15:00:00', end: '2025-11-28T16:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. TORRES' },
        backgroundColor: this.colors.gray.bg, borderColor: this.colors.gray.border, textColor: this.colors.gray.text
      },
      {
        title: 'Archi Distribuée',
        start: '2025-11-28T16:30:00', end: '2025-11-28T17:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. TORRES' },
        backgroundColor: this.colors.gray.bg, borderColor: this.colors.gray.border, textColor: this.colors.gray.text
      }
    ]
  };

  // Liste des cours créée dynamiquement depuis `calendarOptions.events`.
  courses: Array<{ name: string; colorFill: string; colorBorder?: string; textColor?: string; checked: boolean; isCustomColor?: boolean }> = [];
  // Tous les events d'origine (avec baseName) pour pouvoir les (re)ajouter au calendrier
  allEvents: Array<any> = [];
  // Stocke les couleurs personnalisées par cours (nom -> couleur hex)
  customCourseColors: Map<string, string> = new Map();
  // Stocke la clé de couleur originale pour chaque cours (pour pouvoir switcher entre palettes)
  courseColorKeys: Map<string, string> = new Map();

  constructor(private alertCtrl: AlertController, private modalCtrl: ModalController) {
    this.buildCoursesFromEvents();
  }

  // Récupère la couleur à utiliser selon le mode et les customisations
  private getColorForCourse(baseName: string, defaultColor: string): string {
    // Si l'utilisateur a personnalisé cette couleur, utiliser sa couleur (même en mode daltonisme)
    if (this.customCourseColors.has(baseName)) {
      return this.customCourseColors.get(baseName)!;
    }
    
    // Sinon, utiliser la couleur par défaut appropriée
    return defaultColor;
  }

  // Récupère la palette de couleurs appropriée pour un cours selon le mode
  private getColorPaletteForCourse(courseName: string, originalColorKey: string): { bg: string; border: string; text: string } {
    // Si daltonisme ON: toujours afficher palette daltonisme (même pour perso)
    if (this.daltonismMode) {
      const palette = this.colorsDaltonism;
      const colorKey = (originalColorKey in palette) ? originalColorKey : 'blue';
      return (palette as any)[colorKey];
    }
    
    // Si daltonisme OFF: utiliser couleur perso si elle existe, sinon palette normale
    if (this.customCourseColors.has(courseName)) {
      const customColor = this.customCourseColors.get(courseName)!;
      const textColor = getContrastTextColor(customColor);
      return { bg: customColor, border: customColor, text: textColor };
    }
    
    // Sinon palette normale
    const palette = this.colors;
    const colorKey = (originalColorKey in palette) ? originalColorKey : 'blue';
    return (palette as any)[colorKey];
  }

  // Applique le mode daltonisme ou revient aux couleurs normales
  toggleDaltonismMode(enabled: boolean) {
    this.daltonismMode = enabled;
    console.log('[HomePage] Daltonism mode toggled:', enabled);
    
    if (!this.calendarComponent) return;
    const api = this.calendarComponent.getApi();
    
    // Mettre à jour les couleurs de tous les événements basée sur le nouveau mode
    api.getEvents().forEach(ev => {
      const evBase = (ev.title || '').replace(/\s*\(.*\)/, '').trim();
      
      // Obtenir la clé de couleur stockée pour ce cours
      const colorKey = this.courseColorKeys.get(evBase) || 'blue';
      
      // Obtenir la palette appropriée (perso ou daltonisme/normal)
      const palette = this.getColorPaletteForCourse(evBase, colorKey);
      
      try {
        ev.setProp('backgroundColor', palette.bg);
        ev.setProp('borderColor', palette.border);
        ev.setProp('textColor', palette.text);
      } catch (err) {
        console.error('[HomePage] Error updating event color:', err);
      }
    });
    
    // Mettre à jour aussi this.courses pour que la liste à droite change
    this.courses.forEach(course => {
      const colorKey = this.courseColorKeys.get(course.name) || 'blue';
      const palette = this.getColorPaletteForCourse(course.name, colorKey);
      course.colorFill = palette.bg;
      course.colorBorder = palette.border;
      course.textColor = palette.text;
    });
  }

  // Reconstruit tous les cours et met à jour les événements du calendrier
  private rebuildAllCoursesAndEvents() {
    if (!this.calendarComponent) return;
    const api = this.calendarComponent.getApi();
    
    api.getEvents().forEach(ev => {
      const evBase = (ev.title || '').replace(/\s*\(.*\)/, '').trim();
      const course = this.courses.find(c => c.name === evBase);
      
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
  }

  // Open the course settings modal
  async openSettings() {
    console.log('[HomePage] openSettings called, this.courses:', this.courses);
    
    // Make sure courses are populated (fallback to rebuilding from visible events)
    if (!this.courses || this.courses.length === 0) {
      console.log('[HomePage] courses empty, rebuilding...');
      this.buildCoursesFromEvents();
    }
    
    // Create a copy with current colors to pass to modal
    const coursesToShow = this.courses.map(c => ({ ...c }));
    console.log('[HomePage] passing to modal:', coursesToShow);
    
    // Callback to update calendar when color changes in modal
    const onColorChange = (courseName: string, newColor: string) => {
      console.log('[HomePage] onColorChange:', courseName, newColor);
      
      // Stocker la couleur personnalisée
      this.customCourseColors.set(courseName, newColor);
      
      if (!this.calendarComponent) return;
      const api = this.calendarComponent.getApi();
      
      // Calculer la couleur de texte appropriée
      const textColor = getContrastTextColor(newColor);
      
      // Update all events of this course on the calendar
      api.getEvents().forEach(ev => {
        const evBase = (ev.title || '').replace(/\s*\(.*\)/, '').trim();
        if (evBase === courseName) {
          try {
            ev.setProp('backgroundColor', newColor);
            ev.setProp('borderColor', newColor);
            ev.setProp('textColor', textColor);
          } catch (err) {
            console.error('[HomePage] Error updating event color:', err);
          }
        }
      });
      
      // Also update the course in this.courses for the list
      const course = this.courses.find(c => c.name === courseName);
      if (course) {
        course.colorFill = newColor;
        course.textColor = textColor;
        course.isCustomColor = true;
      }
    };
    
    // Callback for daltonism mode toggle
    const onDaltonismToggle = (enabled: boolean) => {
      console.log('[HomePage] daltonism toggled:', enabled);
      this.toggleDaltonismMode(enabled);
    };

    // Callback to reset all colors to base palette
    const onResetColors = () => {
      console.log('[HomePage] Resetting all colors');
      // Clear all custom colors
      this.customCourseColors.clear();
      
      if (!this.calendarComponent) return;
      const api = this.calendarComponent.getApi();
      
      // Rebuild courses from events (gets base colors)
      this.buildCoursesFromEvents();
      
      // Update calendar events with base colors
      api.getEvents().forEach(ev => {
        const evBase = (ev.title || '').replace(/\s*\(.*\)/, '').trim();
        const course = this.courses.find(c => c.name === evBase);
        
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
    };
    
    // dynamically import the component class and create modal
    const mod = await import('./course-settings.component');
    const CourseSettingsComponent = mod.CourseSettingsComponent;

    const modal = await this.modalCtrl.create({
      component: CourseSettingsComponent,
      componentProps: { 
        courses: coursesToShow,
        onColorChange: onColorChange,
        onDaltonismToggle: onDaltonismToggle,
        onResetColors: onResetColors,
        daltonismMode: this.daltonismMode,
        courseColorKeys: this.courseColorKeys,
        customCourseColors: this.customCourseColors,
        colors: this.colors,
        colorsDaltonism: this.colorsDaltonism,
        getContrastTextColor: getContrastTextColor
      }
    });

    await modal.present();
    const res = await modal.onWillDismiss();
    if (res && res.data && res.data.courses) {
      const updated: Array<any> = res.data.courses;
      // Handle daltonism mode from modal
      if (res.data.daltonismMode !== undefined) {
        this.daltonismMode = res.data.daltonismMode;
      }
      // apply colors to this.courses and to allEvents + calendar
      updated.forEach(u => {
        const prev = this.courses.find(c => c.name === u.name);
        if (prev) {
          prev.colorFill = u.colorFill;
          prev.textColor = u.textColor;
          prev.isCustomColor = u.isCustomColor;
        }
      });

      // update the master allEvents and calendar events
      if (this.calendarComponent) {
        const api = this.calendarComponent.getApi();
        // update allEvents
        this.allEvents = this.allEvents.map(ev => {
          const base = (ev.title || '').replace(/\s*\(.*\)/, '').trim();
          const newCourse = updated.find(u => u.name === base);
          if (newCourse) {
            return { ...ev, backgroundColor: newCourse.colorFill };
          }
          return ev;
        });

        // update currently rendered events
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

  // Construit `this.courses` depuis les events du calendrier.
  buildCoursesFromEvents() {
    const evts: any[] = (this.calendarOptions && (this.calendarOptions as any).events) || [];
    // keep a copy of original events with baseName
    this.allEvents = evts.map(ev => ({ ...ev, baseName: (ev.title || '').replace(/\s*\(.*\)/, '').trim() }));
    const map = new Map<string, { name: string; colorFill: string; colorBorder?: string; textColor?: string; checked: boolean }>();

    evts.forEach(ev => {
      if (!ev || !ev.title) return;
      const baseName = ev.title.replace(/\s*\(.*\)/, '').trim();
      if (!baseName) return;
      if (!map.has(baseName)) {
        const colorBorder = ev.borderColor || ev.extendedProps?.borderColor || this.colors.blue.border;
        // Use the event's background color for the checkbox fill so it matches the calendar event
        const colorFill = ev.backgroundColor || ev.background || ev.extendedProps?.backgroundColor || colorBorder || this.colors.blue.bg;
        const textColor = getContrastTextColor(colorFill);
        map.set(baseName, { name: baseName, colorFill: colorFill, colorBorder: colorBorder, textColor: textColor, checked: true });
        
        // Déterminer et stocker la clé de couleur originale (blue, green, yellow, etc.)
        let colorKey = 'blue';
        const colorPalette = this.colors as any;
        for (const [key, colorObj] of Object.entries(colorPalette)) {
          if ((colorObj as any).bg === colorFill) {
            colorKey = key;
            break;
          }
        }
        this.courseColorKeys.set(baseName, colorKey);
      }
    });

    this.courses = Array.from(map.values());
  }

  // Appelé quand l'utilisateur (dé)selectionne un cours dans la liste
  onCourseToggle(course: { name: string; colorFill: string; colorBorder?: string; checked: boolean }) {
    if (!this.calendarComponent) return;
    const api = this.calendarComponent.getApi();

    // Si décoché => supprimer les events du calendrier qui ont le même baseName
    if (!course.checked) {
      const events = api.getEvents();
      events.forEach(ev => {
        const evBase = (ev.title || '').replace(/\s*\(.*\)/, '').trim();
        if (evBase === course.name) {
          ev.remove();
        }
      });
      return;
    }

    // Si coché => (ré)ajouter les events originaux correspondants
    const toAdd = this.allEvents.filter(e => e.baseName === course.name);
    toAdd.forEach(e => {
      // avoid duplicates: check existing events
      const exists = api.getEvents().some(ev => ev.start?.toISOString() === new Date(e.start).toISOString() && ev.title === e.title);
      if (!exists) {
        // Obtenir les bonnes couleurs selon le mode daltonisme actuel
        const colorKey = this.courseColorKeys.get(course.name) || 'blue';
        const palette = this.getColorPaletteForCourse(course.name, colorKey);
        
        api.addEvent({
          title: e.title,
          start: e.start,
          end: e.end,
          extendedProps: e.extendedProps,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          textColor: palette.text
        });
      }
    });
  }

  // Reconstruit `this.courses` pour la plage visible (start..end)
  rebuildCoursesForVisibleRange(start: Date, end: Date) {
    const s = start instanceof Date ? start : new Date(start as any);
    const e = end instanceof Date ? end : new Date(end as any);

    const evts = (this.allEvents || []).filter(ev => {
      try {
        const evStart = new Date(ev.start);
        return evStart >= s && evStart < e;
      } catch (err) {
        return false;
      }
    });

    const map = new Map<string, { name: string; colorFill: string; colorBorder?: string; textColor?: string; checked: boolean }>();

    evts.forEach(ev => {
      if (!ev || !ev.title) return;
      const baseName = (ev.title || '').replace(/\s*\(.*\)/, '').trim();
      if (!baseName) return;
      if (!map.has(baseName)) {
        const colorBorder = ev.borderColor || ev.extendedProps?.borderColor || this.colors.blue.border;
        const colorFill = ev.backgroundColor || ev.background || ev.extendedProps?.backgroundColor || colorBorder || this.colors.blue.bg;
        const textColor = getContrastTextColor(colorFill);
        // preserve previous checked state if present, otherwise default to true
        const prev = this.courses.find(c => c.name === baseName);
        const checked = prev ? prev.checked : true;
        map.set(baseName, { name: baseName, colorFill: colorFill, colorBorder: colorBorder, textColor: textColor, checked });
      }
    });

    this.courses = Array.from(map.values());
  }

  goToday() {
    if (this.calendarComponent) {
      // set the picker value to today so both controls are synchronized
      this.selectedDate = new Date().toISOString();
      // navigate the calendar to today
      try {
        this.calendarComponent.getApi().today();
      } catch (err) {
        // fallback: go to date explicitly
        this.calendarComponent.getApi().gotoDate(new Date());
      }
    }
  }

  changeDate(event: any) {
    const selectedDate = event.detail.value;
    // keep the bound picker value in sync
    this.selectedDate = selectedDate;
    if (this.calendarComponent) {
      this.calendarComponent.getApi().gotoDate(selectedDate);
    }
  }
}