import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { CourseItem } from '../../models/calendar.models';

@Component({
  selector: 'app-student-panel',
  standalone: false,
  templateUrl: './student-panel.component.html',
  styleUrls: ['./student-panel.component.scss']
})
export class StudentPanelComponent {
  @Input() courses: CourseItem[] = [];

  @Output() openSettings = new EventEmitter<void>();
  @Output() checkAll = new EventEmitter<void>();
  @Output() uncheckAll = new EventEmitter<void>();
  @Output() courseToggle = new EventEmitter<CourseItem>();

  toggleCourseFromItem(event: Event, course: CourseItem) {
    const target = event.target as HTMLElement | null;
    if (target?.closest('ion-checkbox')) return;
    course.checked = !course.checked;
    this.courseToggle.emit(course);
  }
}
