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
          <span class="label">ORGANISME</span>
          <span class="data">{{ organism }}</span>
        </div>

        <div class="separator-light"></div>

        <div class="info-row color-row">
          <span class="label">COULEUR</span>
          <div class="color-control">
            <input
              class="color-input"
              type="color"
              [value]="selectedColor"
              (input)="onColorInput($event)"
              aria-label="Choisir une couleur"
            />
            <button class="color-apply" type="button" (click)="applyColor()" [disabled]="!hasColorChange">
              Appliquer
            </button>
          </div>
        </div>

        <ng-container *ngIf="note">
          <div class="separator-light"></div>
          <div class="info-row">
            <span class="label">NOTE</span>
            <span class="data note-highlight">{{ note }}</span>
          </div>
        </ng-container>

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

    .color-input {
      width: 42px;
      height: 32px;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
    }

    .color-apply {
      border: none;
      border-radius: 999px;
      padding: 6px 14px;
      font-size: 0.85rem;
      font-weight: 700;
      background: #111827;
      color: #ffffff;
      cursor: pointer;
    }

    .color-apply:disabled {
      opacity: 0.4;
      cursor: default;
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

  selectedColor: string = '#ffffff';
  hasColorChange = false;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.selectedColor = this.color || '#ffffff';
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
  }

  applyColor() {
    if (!this.hasColorChange) return;
    this.modalCtrl.dismiss({
      action: 'color_change',
      color: this.selectedColor
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
