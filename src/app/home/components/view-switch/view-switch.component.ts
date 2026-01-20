import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-view-switch',
  standalone: false,
  templateUrl: './view-switch.component.html',
  styleUrls: ['./view-switch.component.scss']
})
export class ViewSwitchComponent {
  @Input() viewMode: 'student' | 'room' | 'teacher' = 'student';
  @Output() viewModeChange = new EventEmitter<'student' | 'room' | 'teacher'>();
  @Input() selectedDate = '';
  @Output() dateChange = new EventEmitter<any>();

  onSegmentChange(event: CustomEvent) {
    this.viewModeChange.emit(event.detail.value as 'student' | 'room' | 'teacher');
  }
}
