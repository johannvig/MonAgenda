import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-home-header',
  standalone: false,
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent {
  @Output() toggleDaltonism = new EventEmitter<void>();
  @Output() openSettings = new EventEmitter<void>();
  @Output() showNotifications = new EventEmitter<void>();
}
