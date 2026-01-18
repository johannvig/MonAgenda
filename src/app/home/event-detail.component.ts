import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <div class="custom-modal-card">

      <div class="header-strip" [style.background-color]="color"></div>

      <div class="card-content">

        <div class="card-header">
          <div class="title">{{ eventTitle }}</div>
          <button class="close-icon" type="button" (click)="close()" aria-label="Fermer la fiche">
            <ion-icon name="close" aria-hidden="true"></ion-icon>
          </button>
        </div>

        <div class="separator"></div>

        <div class="info-row" *ngIf="dateFormatted">
          <span class="label">DATE</span>
          <span class="data">{{ dateFormatted }}</span>
        </div>

        <div class="info-row" *ngIf="teacher">
          <span class="label">PROFESSEUR</span>
          <button class="teacher-link" type="button" (click)="openTeacherSchedule()">
            {{ teacher }}
          </button>
        </div>


        <div class="info-row" *ngIf="room">
          <span class="label">LIEU</span>
          <span class="data">{{ room }}</span>
        </div>

        <div class="info-row" *ngIf="organism">
          <span class="label">CLASSE</span>
          <span class="data">{{ organism }}</span>
        </div>

        <div class="separator-light"></div>

        <ion-accordion-group class="detail-accordion">
          <ion-accordion value="color">
            <ion-item slot="header" lines="none">
              <ion-label>Couleur</ion-label>
            </ion-item>
            <div slot="content" class="accordion-content">
              <div class="color-control">
                <input
                  class="color-input"
                  type="color"
                  [value]="selectedColor"
                  (input)="onColorInput($event)"
                  aria-label="Choisir une couleur"
                />
                <ion-button class="color-reset" fill="clear" size="small" (click)="resetColor()" aria-label="Réinitialiser la couleur">
                  <ion-icon name="refresh-circle-outline" aria-hidden="true"></ion-icon>
                </ion-button>
              </div>
              <div class="color-actions">
                <ion-button size="small" color="primary" (click)="requestCourseApply()" [disabled]="!hasColorChange">
                  Appliquer à ce cours
                </ion-button>
                <ion-button size="small" color="primary" (click)="requestSameCourseApply()" [disabled]="!hasColorChange">
                  Appliquer à tous les cours
                </ion-button>
              </div>
            </div>
          </ion-accordion>

          <ion-card class="confirm-card" *ngIf="showCourseConfirm">
          <ion-card-content>
            <div class="confirm-text">Voulez-vous vraiment changer la couleur de ce cours&nbsp;?</div>
            <div class="confirm-actions">
              <ion-button size="small" color="primary" (click)="confirmCourseApply()">Oui</ion-button>
              <ion-button size="small" fill="clear" (click)="cancelCourseApply()">Annuler</ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card class="confirm-card" *ngIf="showSameCourseConfirm">
          <ion-card-content>
            <div class="confirm-text">Voulez-vous vraiment changer la couleur de tous les cours du m\u00eame intitul\u00e9&nbsp;?</div>
            <div class="confirm-actions">
              <ion-button size="small" color="primary" (click)="confirmSameCourseApply()">Oui</ion-button>
              <ion-button size="small" fill="clear" (click)="cancelCourseApply()">Annuler</ion-button>
            </div>
          </ion-card-content>
        </ion-card>
        </ion-accordion-group>

        <div class="note-section">
          <span class="label">NOTE</span>
          <ion-textarea
            class="note-input"
            [value]="noteValue"
            (ionInput)="onNoteInput($event)"
            autoGrow="true"
            placeholder="Ajouter une note..."
            aria-label="Ajouter une note">
          </ion-textarea>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* LA CARTE ELLE-MÊME */
    .custom-modal-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      width: 100%;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      position: relative;
    }

    .header-strip {
      height: 6px;
      width: 100%;
    }

    .card-content {
      padding: 20px;
      text-align: center;
    }

    /* HEADER */
    .card-header {
      display: flex;
      justify-content: center; /* Centre le titre */
      align-items: flex-start;
      margin-bottom: 15px;
      position: relative;
    }

    .title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #1f2937;
      max-width: 85%;
      line-height: 1.2;
    }

    .close-icon {
      appearance: none;
      -webkit-appearance: none;
      border: none;
      background: transparent;
      position: absolute;
      right: -10px;
      top: -10px;
      color: #9ca3af;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 5px;
    }

    /* SEPARATEURS */
    .separator {
      height: 1px;
      background: #e5e7eb;
      width: 40%;
      margin: 0 auto 15px auto;
    }

    .separator-light {
      height: 1px;
      background: #f3f4f6;
      width: 100%;
      margin: 15px 0;
    }

    /* INFO ROWS */
    .info-row {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }

    .label {
      font-size: 0.65rem;
      font-weight: 700;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    .data {
      font-size: 0.95rem;
      font-weight: 600;
      color: #111827;
    }

    .note-highlight {
      color: #d97706;
      font-style: italic;
    }

    .color-row {
      margin-bottom: 0;
    }

    .color-control {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .detail-accordion {
      margin-top: 8px;
    }

    .accordion-content {
      padding: 10px 12px 12px;
      box-sizing: border-box;
    }

    .detail-accordion ion-accordion {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      background: #f8fafc;
    }

    .detail-accordion ion-accordion + ion-accordion {
      margin-top: 10px;
    }

    .detail-accordion ion-item {
      --background: #eef2ff;
      --color: #1e3a8a;
      --min-height: 40px;
      font-weight: 700;
    }

    .detail-accordion ion-item::part(native) {
      border: none;
    }

    .detail-accordion ion-accordion::part(content) {
      background: #ffffff;
      overflow: hidden;
    }

    .color-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      margin-top: 10px;
    }

    .color-actions ion-button {
      width: 100%;
      min-width: 0;
    }

    .note-input {
      margin-top: 6px;
      --background: #f9fafb;
      --color: #111827;
      --padding-start: 10px;
      --padding-end: 10px;
      --padding-top: 8px;
      --padding-bottom: 8px;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      font-size: 0.9rem;
      text-align: left;
      width: 100%;
      max-height: 120px;
      overflow: auto;
    }

    .note-input::part(textarea) {
      max-height: 120px;
      overflow: auto;
    }

    .note-section {
      margin-top: 12px;
      text-align: left;
    }

    .color-input {
      width: 42px;
      height: 32px;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
    }

    .color-reset {
      --color: #1f2937;
      --padding-start: 2px;
      --padding-end: 2px;
      height: 32px;
    }

    .confirm-card {
      margin-top: 12px;
      border-radius: 12px;
      box-shadow: none;
      border: 1px solid #e5e7eb;
      text-align: center;
    }

    .confirm-card ion-card-content {
      background: #f9fafb;
    }

    .confirm-text {
      font-size: 0.95rem;
      font-weight: 700;
      color: #111827;
      line-height: 1.3;
      margin-bottom: 10px;
    }

    .confirm-actions {
      display: flex;
      justify-content: center;
      gap: 8px;
    }


.teacher-link{
      background-color:transparent;
      font-size: 0.95rem;
      font-weight: 600;
      color:#111827;
    }

    .teacher-link:focus-visible,
    .close-icon:focus-visible {
      outline: 2px solid #1e40af;
      outline-offset: 2px;
      border-radius: 4px;
    }

  `]
})
export class EventDetailComponent implements OnInit {
  @Input() eventTitle: string = '';
  @Input() dateFormatted: string = '';
  @Input() teacher: string = '';
  @Input() room: string = '';
  @Input() organism: string = '';
  @Input() note: string = '';
  @Input() color: string = '';
  @Input() onNoteChange?: (note: string) => void;

  selectedColor: string = '#ffffff';
  noteValue: string = '';
  hasColorChange = false;
  showCourseConfirm = false;
  showSameCourseConfirm = false;
  private noteDebounce: any;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.selectedColor = this.color || '#ffffff';
    this.noteValue = this.note || '';
  }

openTeacherSchedule() {
  if (!this.teacher) return;
  this.modalCtrl.dismiss({
    action: 'teacher_schedule',
    teacher: this.teacher
  });
}

  onColorInput(event: Event) {
    const target = event.target as HTMLInputElement | null;
    const value = target?.value || '';
    if (!value) return;
    this.selectedColor = value;
    this.hasColorChange = value !== this.color;
    this.showCourseConfirm = false;
    this.showSameCourseConfirm = false;
  }

  onNoteInput(event: Event) {
    const value = (event as CustomEvent).detail?.value ?? '';
    this.noteValue = value;
    if (this.noteDebounce) {
      clearTimeout(this.noteDebounce);
    }
    this.noteDebounce = setTimeout(() => {
      if (this.onNoteChange) {
        this.onNoteChange(this.noteValue);
      }
    }, 300);
  }

  requestCourseApply() {
    if (!this.hasColorChange) return;
    this.showCourseConfirm = true;
    this.showSameCourseConfirm = false;
  }

  requestSameCourseApply() {
    if (!this.hasColorChange) return;
    this.showSameCourseConfirm = true;
    this.showCourseConfirm = false;
  }

  cancelCourseApply() {
    this.showCourseConfirm = false;
    this.showSameCourseConfirm = false;
  }

  confirmCourseApply() {
    if (!this.hasColorChange) return;
    this.modalCtrl.dismiss({
      action: 'color_change_course',
      color: this.selectedColor
    });
  }

  confirmSameCourseApply() {
    if (!this.hasColorChange) return;
    this.modalCtrl.dismiss({
      action: 'color_change_same_course',
      color: this.selectedColor
    });
  }

  resetColor() {
    this.modalCtrl.dismiss({
      action: 'color_reset'
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
