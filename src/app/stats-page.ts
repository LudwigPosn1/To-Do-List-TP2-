import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskService } from './task.service';

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './stats-page.html',
  styleUrl: './stats-page.css',
})
export class StatsPage {
  private readonly taskService = inject(TaskService);
  readonly total = computed(() => this.taskService.tasks().length);
  readonly completed = computed(
    () => this.taskService.tasks().filter(task => task.status === 'done').length,
  );
  readonly remaining = computed(() => this.total() - this.completed());
  readonly percentage = computed(() =>
    this.total() === 0
      ? 0
      : Math.round((this.completed() / this.total()) * 100),
  );
}
