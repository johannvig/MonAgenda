import { Component, ViewChild, OnInit } from '@angular/core'; // Ajout de OnInit
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
export class HomePage implements OnInit { // Implémenter OnInit

  @ViewChild('myCalendar') calendarComponent!: FullCalendarComponent;

  currentWeek: number = 0;
  currentYear: number = 0;

  // 1. LA LISTE COMPLÈTE (Base de données)
  // J'ai sorti les events de calendarOptions pour les mettre ici
  allEvents: any[] = []; 
  
  // 2. LA LISTE AFFICHÉE (Celle liée au HTML)
  currentEvents: any[] = [];

  colors = {
    blue:   { bg: '#dbeafe', border: '#3b82f6', text: '#1e3a8a' }, 
    green:  { bg: '#dcfce7', border: '#22c55e', text: '#14532d' }, 
    yellow: { bg: '#fef9c3', border: '#facc15', text: '#854d0e' }, 
    cyan:   { bg: '#cffafe', border: '#06b6d4', text: '#164e63' }, 
    gray:   { bg: '#f3f4f6', border: '#9ca3af', text: '#374151' }  
  };

  courses = [
    // Astuce : "keyword" permet de faire le lien entre le filtre et le titre du cours
    { name: 'Maths', color: 'primary', checked: true, keyword: 'Maths' },
    { name: 'Anglais', color: 'tertiary', checked: true, keyword: 'Anglais' },
    { name: 'Sport', color: 'success', checked: true, keyword: 'Sport' },
    { name: 'IHM', color: 'primary', checked: true, keyword: 'IHM' },
    { name: 'Conception', color: 'danger', checked: true, keyword: 'Conception' },
    { name: 'Compréhension', color: 'secondary', checked: true, keyword: 'Compréhension' },
    { name: 'Lancement', color: 'medium', checked: true, keyword: 'Lancement' },
    { name: 'Archi', color: 'dark', checked: true, keyword: 'Archi' }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: frLocale,
    headerToolbar: false,
    weekends: false,
    initialDate: '2025-11-24', 
    
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    slotDuration: '00:15:00', 
    slotLabelInterval: '01:00', 
    allDaySlot: false,
    nowIndicator: true,

    // Plus de "events: [...]" ici ! Ils sont gérés par [events] dans le HTML.
    
    height: 'auto', 
    expandRows: false,
    displayEventTime: false, 

    slotLabelFormat: { hour: '2-digit', minute: '2-digit', omitZeroMinute: false, meridiem: false },
    dayHeaderFormat: { weekday: 'long', day: 'numeric' },

    datesSet: (dateInfo) => {
      this.currentWeek = getWeek(dateInfo.start, { weekStartsOn: 1 });
      this.currentYear = dateInfo.start.getFullYear();
    },

    eventContent: (arg) => {
      const event = arg.event;
      let myTimeText = '';
      if (event.start && event.end) {
        const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
        myTimeText = `${event.start.toLocaleTimeString('fr-FR', opts)} - ${event.end.toLocaleTimeString('fr-FR', opts)}`;
      }

      const room = event.extendedProps['room'] || '';
      const teacher = event.extendedProps['teacher'] || '';

      let durationMinutes = 0;
      if (event.start && event.end) {
        durationMinutes = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
      }

      let detailsHtml = '';
      if (durationMinutes <= 60) {
        if(room && teacher) detailsHtml = `<div class="text-ellipsis">${room} - ${teacher}</div>`;
        else detailsHtml = `<div class="text-ellipsis">${room}${teacher}</div>`;
      } else {
        detailsHtml = `<div>${room}</div><div style="opacity: 0.8">${teacher}</div>`;
      }

      return {
        html: `
          <div class="custom-event-content">
            <div class="event-title">${event.title}</div>
            <div class="event-details">${detailsHtml}</div>
            <div class="event-time">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${myTimeText}
            </div>
          </div>`
      };
    }
  };

  constructor(private alertCtrl: AlertController) {
    // 3. INITIALISATION DES DONNÉES
    this.initEvents();
  }

  ngOnInit() {
    // Au démarrage, on affiche tout
    this.currentEvents = [...this.allEvents];
  }

  // Fonction de filtrage
  updateEvents() {
    // 1. Récupérer les mots-clés des filtres cochés
    const activeKeywords = this.courses
      .filter(c => c.checked)
      .map(c => c.keyword);

    // 2. Filtrer la liste complète
    this.currentEvents = this.allEvents.filter(event => {
      // On regarde si le titre du cours contient un des mots-clés actifs
      return activeKeywords.some(keyword => event.title.includes(keyword));
    });
  }

  // --- VOS ÉVÉNEMENTS DÉPLACÉS ICI ---
  initEvents() {
    this.allEvents = [
      // LUNDI
      { title: 'Sport (APSA)', start: '2025-11-24T08:00:00', end: '2025-11-24T10:00:00', extendedProps: { room: 'Gymnase', teacher: 'M. LEGRAND' }, backgroundColor: this.colors.cyan.bg, borderColor: this.colors.cyan.border, textColor: this.colors.cyan.text },
      { title: 'Maths (Cours)', start: '2025-11-24T11:00:00', end: '2025-11-24T12:15:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. VIGNEAU' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },
      { title: 'Conception Log.', start: '2025-11-24T13:30:00', end: '2025-11-24T14:45:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. CHENE' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },
      { title: 'Conception Log.', start: '2025-11-24T15:00:00', end: '2025-11-24T16:15:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. CHENE' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },
      { title: 'Conception Log.', start: '2025-11-24T16:30:00', end: '2025-11-24T17:45:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. CHENE' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },

      // MARDI
      { title: 'Maths (EVAL)', start: '2025-11-25T08:00:00', end: '2025-11-25T09:15:00', extendedProps: { room: 'NA-G. Charpak', teacher: 'Mme. VIGNEAU' }, backgroundColor: this.colors.green.bg, borderColor: this.colors.green.border, textColor: this.colors.green.text },
      { title: 'Maths (EVAL)', start: '2025-11-25T09:30:00', end: '2025-11-25T10:45:00', extendedProps: { room: 'NA-G. Charpak', teacher: 'Mme. VIGNEAU' }, backgroundColor: this.colors.green.bg, borderColor: this.colors.green.border, textColor: this.colors.green.text },
      { title: 'Anglais', start: '2025-11-25T11:00:00', end: '2025-11-25T12:15:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. WILSON' }, backgroundColor: this.colors.yellow.bg, borderColor: this.colors.yellow.border, textColor: this.colors.yellow.text },
      { title: 'Compréhension Ent.', start: '2025-11-25T13:30:00', end: '2025-11-25T14:45:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. DUMAS' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },
      { title: 'Compréhension Ent.', start: '2025-11-25T15:00:00', end: '2025-11-25T16:15:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. DUMAS' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },
      { title: 'Compréhension Ent.', start: '2025-11-25T16:30:00', end: '2025-11-25T17:45:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. DUMAS' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },

      // MERCREDI
      { title: 'IHM', start: '2025-11-26T08:00:00', end: '2025-11-26T09:15:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. ROCHE' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },
      { title: 'IHM', start: '2025-11-26T09:30:00', end: '2025-11-26T10:45:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. ROCHE' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },
      { title: 'IHM', start: '2025-11-26T11:00:00', end: '2025-11-26T12:15:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. ROCHE' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },
      { title: 'Lancement Comm.', start: '2025-11-26T13:30:00', end: '2025-11-26T16:15:00', extendedProps: { room: 'NA-J142 / J147', teacher: 'Mme. FABRE' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },

      // JEUDI
      { title: 'Maths Discrètes', start: '2025-11-27T08:00:00', end: '2025-11-27T09:15:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. PERRIN' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },
      { title: 'Maths Discrètes', start: '2025-11-27T09:30:00', end: '2025-11-27T10:45:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. PERRIN' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },
      { title: 'Maths Discrètes', start: '2025-11-27T11:00:00', end: '2025-11-27T12:15:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. PERRIN' }, backgroundColor: this.colors.blue.bg, borderColor: this.colors.blue.border, textColor: this.colors.blue.text },

      // VENDREDI
      { title: 'Anglais', start: '2025-11-28T08:00:00', end: '2025-11-28T09:15:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. WILSON' }, backgroundColor: this.colors.yellow.bg, borderColor: this.colors.yellow.border, textColor: this.colors.yellow.text },
      { title: 'Anglais', start: '2025-11-28T09:30:00', end: '2025-11-28T10:45:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'Mme. WILSON' }, backgroundColor: this.colors.yellow.bg, borderColor: this.colors.yellow.border, textColor: this.colors.yellow.text },
      { title: 'Archi Distribuée', start: '2025-11-28T13:30:00', end: '2025-11-28T14:45:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. TORRES' }, backgroundColor: this.colors.gray.bg, borderColor: this.colors.gray.border, textColor: this.colors.gray.text },
      { title: 'Archi Distribuée', start: '2025-11-28T15:00:00', end: '2025-11-28T16:15:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. TORRES' }, backgroundColor: this.colors.gray.bg, borderColor: this.colors.gray.border, textColor: this.colors.gray.text },
      { title: 'Archi Distribuée', start: '2025-11-28T16:30:00', end: '2025-11-28T17:45:00', extendedProps: { room: 'NA-J147 (V-40)', teacher: 'M. TORRES' }, backgroundColor: this.colors.gray.bg, borderColor: this.colors.gray.border, textColor: this.colors.gray.text }
    ];
  }

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