import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('adds, toggles, edits, removes, and persists tasks', () => {
    const service = TestBed.inject(TaskService);

    service.add({
      title: 'Réviser Angular',
      description: 'Relire les notes',
      dueDate: '2099-10-13',
    });
    const task = service.tasks()[0];
    expect(task.status).toBe('todo');

    service.toggle(task.id);
    expect(service.tasks()[0].status).toBe('done');

    service.update(task.id, {
      title: 'Réviser TypeScript',
      description: 'Faire les exercices',
    });
    expect(service.tasks()[0].title).toBe('Réviser TypeScript');
    expect(service.tasks()[0].status).toBe('done');

    expect(JSON.parse(localStorage.getItem('tp2-tasks') ?? '[]')).toHaveLength(1);
    service.remove(task.id);
    expect(service.tasks()).toEqual([]);
    expect(JSON.parse(localStorage.getItem('tp2-tasks') ?? '[]')).toEqual([]);
  });
});
