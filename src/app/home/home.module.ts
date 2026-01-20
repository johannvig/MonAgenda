import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular'; // <--- Import
import { HomeHeaderComponent } from './components/home-header/home-header.component';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { ViewSwitchComponent } from './components/view-switch/view-switch.component';
import { StudentPanelComponent } from './components/student-panel/student-panel.component';
import { RoomPanelComponent } from './components/room-panel/room-panel.component';
import { TeacherPanelComponent } from './components/teacher-panel/teacher-panel.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    FullCalendarModule // <--- Ajout
  ],
  declarations: [
    HomePage,
    HomeHeaderComponent,
    CalendarHeaderComponent,
    ViewSwitchComponent,
    StudentPanelComponent,
    RoomPanelComponent,
    TeacherPanelComponent
  ]
})
export class HomePageModule {}
