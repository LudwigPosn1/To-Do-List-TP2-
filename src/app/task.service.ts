import { afterNextRender, Injectable, signal } from '@angular/core';
import { Task, TaskDraft, TaskStatus } from './task';

const STORAGE_KEY = 'tp2-tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  readonly tasks = signal<Task[]>([]);
  readonly persistenceError = signal<string | null>(null);

  constructor() {
    // Le navigateur est le seul endroit où localStorage existe.
    // Charger après le premier rendu évite un écart entre le HTML SSR et l'hydratation.
    afterNextRender(() => this.load());
  }

  add(draft: TaskDraft): void {
    const task: Task = {
      ...draft,
      id: crypto.randomUUID(),
      status: 'todo',
    };
    this.commit([...this.tasks(), task]);
  }

  update(id: string, draft: TaskDraft): void {
    this.commit(
      this.tasks().map(task =>
        task.id === id ? { ...task, ...draft } : task,
      ),
    );
  }

  toggle(id: string): void {
    this.commit(
      this.tasks().map(task =>
        task.id === id
          ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
          : task,
      ),
    );
  }

  remove(id: string): void {
    this.commit(this.tasks().filter(task => task.id !== id));
  }

  private load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null) {
        return;
      }

      const parsed: unknown = JSON.parse(stored);
      if (!isTaskList(parsed)) {
        this.persistenceError.set(
          'Les tâches enregistrées sont illisibles. Supprime les données du site pour repartir de zéro.',
        );
        return;
      }
      this.tasks.set(parsed);
    } catch (error) {
      console.error('Impossible de lire les tâches enregistrées.', error);
      this.persistenceError.set(
        'Impossible de lire les tâches enregistrées dans ce navigateur.',
      );
    }
  }

  private commit(nextTasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
      this.tasks.set(nextTasks);
      this.persistenceError.set(null);
    } catch (error) {
      console.error('Impossible d’enregistrer les tâches.', error);
      this.persistenceError.set(
        'La modification n’a pas été enregistrée. Vérifie les paramètres de stockage du navigateur.',
      );
    }
  }
}

function isTaskList(value: unknown): value is Task[] {
  return (
    Array.isArray(value) &&
    value.every(
      (entry: unknown) =>
        typeof entry === 'object' &&
        entry !== null &&
        'id' in entry &&
        typeof entry.id === 'string' &&
        'title' in entry &&
        typeof entry.title === 'string' &&
        'description' in entry &&
        typeof entry.description === 'string' &&
        'status' in entry &&
        isTaskStatus(entry.status) &&
        (!('dueDate' in entry) ||
          entry.dueDate === undefined ||
          typeof entry.dueDate === 'string'),
    )
  );
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === 'todo' || value === 'done';
}
