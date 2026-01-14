import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-settings',
  templateUrl: 'course-settings.component.html',
  styleUrls: ['course-settings.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class CourseSettingsComponent implements OnInit {
  @Input() courses: Array<{ name: string; colorFill: string; colorBorder?: string; textColor?: string; checked: boolean; isCustomColor?: boolean }> = [];
  @Input() onColorChange?: (courseName: string, newColor: string) => void;
  @Input() onDaltonismToggle?: (enabled: boolean) => void;
  @Input() onResetColors?: () => void;
  @Input() daltonismMode: boolean = false;
  @Input() courseColorKeys?: Map<string, string> = new Map();
  @Input() customCourseColors?: Map<string, string> = new Map();
  @Input() colors: any = {};
  @Input() colorsDaltonism: any = {};
  @Input() getContrastTextColor?: (hex: string) => string;

  // local copy so changes are not applied until Save
  localCourses: Array<{ name: string; colorFill: string; colorBorder?: string; textColor?: string; checked: boolean; isCustomColor?: boolean }> = [];

  constructor(private modalCtrl: ModalController) {
    console.log('[CourseSettings] Constructor called, courses input:', this.courses);
  }

  ngOnInit() {
    console.log('[CourseSettings] ngOnInit called, courses:', this.courses);
    // shallow clone
    this.localCourses = this.courses.map(c => ({ ...c }));
    console.log('[CourseSettings] localCourses after map:', this.localCourses);
  }

  // Called when user changes a color
  updateColor(course: any, newColor: string) {
    course.colorFill = newColor;
    course.isCustomColor = true; // Marquer comme personnalisée
    
    // Calculer et mettre à jour la couleur de texte basée sur la luminance
    if (this.getContrastTextColor) {
      course.textColor = this.getContrastTextColor(newColor);
    }
    
    // Call the callback to update calendar in real-time
    if (this.onColorChange) {
      this.onColorChange(course.name, newColor);
    }
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // Réinitialise toutes les couleurs à la palette de base
  resetColors() {
    if (!this.courseColorKeys || !this.colors || !this.getContrastTextColor) {
      return;
    }

    const getContrastTextColor = this.getContrastTextColor;

    this.localCourses.forEach(course => {
      const colorKey = this.courseColorKeys!.get(course.name) || 'blue';
      const colorObj = (this.colors as any)[colorKey];
      
      if (colorObj) {
        course.colorFill = colorObj.bg;
        course.colorBorder = colorObj.border;
        course.textColor = colorObj.text;
        course.isCustomColor = false; // Marquer comme non-personnalisée
      }
    });

    // Appeler la callback au parent pour mettre à jour aussi le calendrier
    if (this.onResetColors) {
      this.onResetColors();
    }
  }

  save() {
    this.modalCtrl.dismiss({ courses: this.localCourses }, 'save');
  }
}
