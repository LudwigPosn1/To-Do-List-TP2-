import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskForm } from './task-form';
import { Task, TaskFilter } from './task';
import { TaskService } from './task.service';

type TaskSort = 'date' | 'title';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [FormsModule, TaskForm],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.css',
})
export class TasksPage {
  private readonly taskService = inject(TaskService);

  readonly tasks = this.taskService.tasks;
  readonly persistenceError = this.taskService.persistenceError;
  readonly filter = signal<TaskFilter>('all');
  readonly search = signal('');
  readonly sort = signal<TaskSort>('date');
  readonly editingId = signal<string | null>(null);
  readonly editingTask = computed(
    () => this.tasks().find(task => task.id === this.editingId()) ?? null,
  );

  readonly visibleTasks = computed(() => {
    const search = this.search().trim().toLocaleLowerCase();
    const filter = this.filter();
    const sort = this.sort();

    return this.tasks()
      .filter(task => filter === 'all' || task.status === filter)
      .filter(
        task =>
          !search ||
          task.title.toLocaleLowerCase().includes(search) ||
          task.description.toLocaleLowerCase().includes(search),
      )
      .sort((left, right) => {
        if (sort === 'title') {
          return left.title.localeCompare(right.title, 'fr');
        }
        // Les tâches sans échéance restent en bas, puis le titre départage les dates égales.
        return (
          (left.dueDate ?? '9999-12-31').localeCompare(
            right.dueDate ?? '9999-12-31',
          ) || left.title.localeCompare(right.title, 'fr')
        );
      });
  });

  saveTask(draft: { title: string; description: string; dueDate?: string }): void {
    const id = this.editingId();
    if (id) {
      this.taskService.update(id, draft);
      this.editingId.set(null);
      return;
    }
    this.taskService.add(draft);
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  removeTask(task: Task): void {
    if (confirm(`Supprimer la tâche « ${task.title} » ?`)) {
      this.taskService.remove(task.id);
    }
  }

  toggleTask(id: string): void {
    this.taskService.toggle(id);
  }
}
