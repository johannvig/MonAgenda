import { Component, ViewChild} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { AlertController } from '@ionic/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { getWeek } from 'date-fns';

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

  // Définition des palettes de couleurs
  colors = {
    blue:   { bg: '#dbeafe', border: '#3b82f6', text: '#1e3a8a' }, 
    green:  { bg: '#dcfce7', border: '#22c55e', text: '#14532d' }, 
    yellow: { bg: '#fef9c3', border: '#facc15', text: '#854d0e' }, 
    cyan:   { bg: '#cffafe', border: '#06b6d4', text: '#164e63' }, 
    gray:   { bg: '#f3f4f6', border: '#9ca3af', text: '#374151' }  
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

  courses = [
    { name: 'Maths', color: 'primary', checked: true },
    { name: 'Anglais', color: 'tertiary', checked: true },
    { name: 'Sport', color: 'success', checked: true },
    { name: 'IHM', color: 'warning', checked: true },
    { name: 'Conception', color: 'danger', checked: true }
  ];

  constructor(private alertCtrl: AlertController) {}

  goToday() {
    if (this.calendarComponent) {
      this.calendarComponent.getApi().today();
    }
  }

  async openSettings() {
    const alert = await this.alertCtrl.create({
      header: 'Personnaliser les cours',
      inputs: [
        { name: 'daltonisme', type: 'checkbox', label: 'Mode Daltonisme', value: 'daltonisme', checked: true },
        { name: 'sombre', type: 'checkbox', label: 'Mode Sombre', value: 'dark' }
      ],
      buttons: ['Annuler', 'Sauvegarder']
    });
    await alert.present();
  }

  changeDate(event: any) {
    const selectedDate = event.detail.value; 
    if (this.calendarComponent) {
      this.calendarComponent.getApi().gotoDate(selectedDate);
    }
  }
}