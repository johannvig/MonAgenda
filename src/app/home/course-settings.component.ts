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

  private readonly hexColorRe = /^#[0-9a-fA-F]{6}$/;

  // local copy so changes are not applied until Validate
  localCourses: Array<{
    name: string;
    colorFill: string;
    colorBorder?: string;
    textColor?: string;
    checked: boolean;
    isCustomColor?: boolean;
    pendingColor?: string;
    pendingValid?: boolean;
  }> = [];
  localDaltonismMode: boolean = false;

  constructor(private modalCtrl: ModalController) {
    console.log('[CourseSettings] Constructor called, courses input:', this.courses);
  }

  ngOnInit() {
    console.log('[CourseSettings] ngOnInit called, courses:', this.courses);
    // shallow clone
    this.localCourses = this.courses.map(c => ({
      ...c,
      pendingColor: c.colorFill,
      pendingValid: this.hexColorRe.test(c.colorFill || '')
    }));
    this.localDaltonismMode = this.daltonismMode;
    console.log('[CourseSettings] localCourses after map:', this.localCourses);
  }

  // Called when user changes a color
  updateColor(course: any, newColor: string) {
    const normalized = this.normalizeHexColor(newColor);
    course.pendingColor = normalized || newColor;
    course.pendingValid = !!normalized;

    if (normalized && this.getContrastTextColor) {
      course.textColor = this.getContrastTextColor(normalized);
    }
  }

  applyColor(course: any) {
    const normalized = this.normalizeHexColor(course.pendingColor || '');
    if (!normalized) return;

    course.colorFill = normalized;
    course.pendingColor = normalized;
    course.pendingValid = true;
    course.isCustomColor = true;

    if (this.getContrastTextColor) {
      course.textColor = this.getContrastTextColor(normalized);
    }

    if (this.onColorChange) {
      this.onColorChange(course.name, normalized);
    }
  }

  hasPendingChange(course: any): boolean {
    const normalized = this.normalizeHexColor(course.pendingColor || '');
    if (!normalized) return false;
    return normalized !== course.colorFill;
  }

  getPreviewColor(course: any): string {
    const normalized = this.normalizeHexColor(course.pendingColor || '');
    return normalized || course.colorFill || '#ffffff';
  }

  getPendingColor(course: any): string {
    const normalized = this.normalizeHexColor(course.pendingColor || '');
    return normalized || course.colorFill || '#ffffff';
  }

  private normalizeHexColor(value: string): string | null {
    const trimmed = (value || '').trim();
    if (!trimmed) return null;
    const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    return this.hexColorRe.test(withHash) ? withHash.toLowerCase() : null;
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
    const palette = this.localDaltonismMode ? this.colorsDaltonism : this.colors;

    this.localCourses.forEach(course => {
      const colorKey = this.courseColorKeys!.get(course.name) || 'blue';
      const colorObj = (palette as any)[colorKey];
      
      if (colorObj) {
        course.colorFill = colorObj.bg;
        course.colorBorder = colorObj.border;
        course.textColor = colorObj.text;
        course.isCustomColor = false; // Marquer comme non-personnalisée
        course.pendingColor = course.colorFill;
        course.pendingValid = true;
      }
    });

    // Appeler la callback au parent pour mettre à jour aussi le calendrier
    if (this.onResetColors) {
      this.onResetColors();
    }
  }

  toggleDaltonism(enabled: boolean) {
    this.localDaltonismMode = enabled;

    if (this.onDaltonismToggle) {
      this.onDaltonismToggle(enabled);
    }

    if (!this.courseColorKeys || !this.getContrastTextColor) {
      return;
    }

    const palette = enabled ? this.colorsDaltonism : this.colors;

    this.localCourses.forEach(course => {
      if (course.isCustomColor) {
        return;
      }

      const colorKey = this.courseColorKeys!.get(course.name) || 'blue';
      const colorObj = (palette as any)[colorKey];

      if (colorObj) {
        course.colorFill = colorObj.bg;
        course.colorBorder = colorObj.border;
        course.textColor = colorObj.text;
        course.pendingColor = course.colorFill;
        course.pendingValid = true;
      }
    });
  }

  save() {
    this.modalCtrl.dismiss({ courses: this.localCourses }, 'save');
  }
}
