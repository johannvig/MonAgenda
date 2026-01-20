import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-teacher-panel',
  standalone: false,
  templateUrl: './teacher-panel.component.html',
  styleUrls: ['./teacher-panel.component.scss']
})
export class TeacherPanelComponent {
  @Input() selectedTeacher: string | null = null;
  @Input() teacherQuery = '';
  @Input() filteredTeachers: string[] = [];

  @Output() teacherQueryChange = new EventEmitter<string>();
  @Output() selectTeacher = new EventEmitter<string>();
  @Output() filterTeachers = new EventEmitter<void>();

  onTeacherInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement | null;
    const value = (target as any)?.value ?? this.teacherQuery;
    this.teacherQueryChange.emit(value);
    this.filterTeachers.emit();
  }
}
