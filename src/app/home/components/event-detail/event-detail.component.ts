import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
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
