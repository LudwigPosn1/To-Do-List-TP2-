import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Task, TaskDraft } from './task';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  readonly task = input<Task | null>(null);
  readonly saved = output<TaskDraft>();
  readonly cancelled = output<void>();

  title = '';
  description = '';
  dueDate = '';
  titleTouched = false;
  dueDateTouched = false;
  readonly today = getLocalDate();

  constructor() {
    // Quand la tâche à modifier change, le formulaire reprend ses valeurs.
    effect(() => {
      const task = this.task();
      this.title = task?.title ?? '';
      this.description = task?.description ?? '';
      this.dueDate = task?.dueDate ?? '';
      this.titleTouched = false;
      this.dueDateTouched = false;
    });
  }

  get titleIsValid(): boolean {
    return this.title.trim().length >= 3;
  }

  get dueDateIsInvalid(): boolean {
    return this.dueDate !== '' && this.dueDate < this.today;
  }

  submit(): void {
    if (!this.titleIsValid || this.dueDateIsInvalid) {
      return;
    }

    this.saved.emit({
      title: this.title.trim(),
      description: this.description.trim(),
      dueDate: this.dueDate || undefined,
    });

    if (!this.task()) {
      this.title = '';
      this.description = '';
      this.dueDate = '';
    }
    this.titleTouched = false;
    this.dueDateTouched = false;
  }
}

function getLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
