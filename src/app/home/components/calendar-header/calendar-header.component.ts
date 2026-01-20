import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-calendar-header',
  standalone: false,
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss']
})
export class CalendarHeaderComponent {
  @Input() currentWeek = 0;
  @Output() prevWeek = new EventEmitter<void>();
  @Output() nextWeek = new EventEmitter<void>();
  @Output() goToday = new EventEmitter<void>();
}
