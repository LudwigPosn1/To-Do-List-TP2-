import { Routes } from '@angular/router';
import { StatsPage } from './stats-page';
import { TasksPage } from './tasks-page';

export const routes: Routes = [
  { path: '', component: TasksPage, title: 'Mes tâches' },
  { path: 'stats', component: StatsPage, title: 'Statistiques' },
  { path: '**', redirectTo: '' },
];
