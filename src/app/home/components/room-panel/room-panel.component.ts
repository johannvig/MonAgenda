import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-room-panel',
  standalone: false,
  templateUrl: './room-panel.component.html',
  styleUrls: ['./room-panel.component.scss']
})
export class RoomPanelComponent {
  @Input() selectedRoom: string | null = null;
  @Input() roomQuery = '';
  @Input() filteredRooms: string[] = [];

  @Output() roomQueryChange = new EventEmitter<string>();
  @Output() selectRoom = new EventEmitter<string>();
  @Output() filterRooms = new EventEmitter<void>();

  onRoomInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement | null;
    const value = (target as any)?.value ?? this.roomQuery;
    this.roomQueryChange.emit(value);
    this.filterRooms.emit();
  }
}
