import { writable } from 'svelte/store';

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  result: string;
};

export type Note = {
  id: string;
  text: string;
  timestamp: string;
};

export type Vehicle = {
  id: string;
  callsign: string;
  tasks: Task[];
  notes: Note[];
};

function createVehiclesStore() {
  const createId = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  const { subscribe, update } = writable<Vehicle[]>([
    {
      id: 'mtf',
      callsign: 'Florian Musterstadt 14/1',
      tasks: [
        {
          id: 'task-mtf-1',
          title: 'Kilometerstand melden',
          description: 'Kilometerstand des MTF durchgeben.',
          completed: false,
          result: ''
        },
        {
          id: 'task-mtf-2',
          title: 'Wort buchstabieren',
          description: 'Buchstabiere das Wort "Einsatz" im Funkalphabet.',
          completed: false,
          result: ''
        }
      ],
      notes: [
        {
          id: 'note-mtf-1',
          text: 'Fahrzeug besetzt und abfahrbereit.',
          timestamp: new Date().toISOString()
        }
      ]
    },
    {
      id: 'hlf',
      callsign: 'Florian Musterstadt 44/1',
      tasks: [
        {
          id: 'task-hlf-1',
          title: 'Wie viele PA-Geräte an Bord?',
          description: 'Anzahl der einsatzbereiten Pressluftatmer durchgeben.',
          completed: false,
          result: ''
        },
        {
          id: 'task-hlf-2',
          title: 'Status mitteilen',
          description: 'Aktuellen Status (z. B. Status 2) melden.',
          completed: false,
          result: ''
        }
      ],
      notes: []
    },
    {
      id: 'tsa',
      callsign: 'Florian Musterstadt 48/1',
      tasks: [
        {
          id: 'task-tsa-1',
          title: 'Geräteliste prüfen',
          description: 'Sind alle Schlauchtragekörbe an Bord?',
          completed: false,
          result: ''
        }
      ],
      notes: []
    }
  ]);

  const addTask = (vehicleId: string, task: Omit<Task, 'id' | 'completed' | 'result'>) => {
    update((vehicles) =>
      vehicles.map((vehicle) =>
        vehicle.id === vehicleId
          ? {
              ...vehicle,
              tasks: [
                ...vehicle.tasks,
                {
                  id: createId(),
                  title: task.title,
                  description: task.description,
                  completed: false,
                  result: ''
                }
              ]
            }
          : vehicle
      )
    );
  };

  const toggleTask = (vehicleId: string, taskId: string) => {
    update((vehicles) =>
      vehicles.map((vehicle) =>
        vehicle.id === vehicleId
          ? {
              ...vehicle,
              tasks: vehicle.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              )
            }
          : vehicle
      )
    );
  };

  const updateTaskResult = (vehicleId: string, taskId: string, result: string) => {
    update((vehicles) =>
      vehicles.map((vehicle) =>
        vehicle.id === vehicleId
          ? {
              ...vehicle,
              tasks: vehicle.tasks.map((task) =>
                task.id === taskId ? { ...task, result } : task
              )
            }
          : vehicle
      )
    );
  };

  const updateCallsign = (vehicleId: string, callsign: string) => {
    update((vehicles) =>
      vehicles.map((vehicle) =>
        vehicle.id === vehicleId
          ? {
              ...vehicle,
              callsign
            }
          : vehicle
      )
    );
  };

  const addNote = (vehicleId: string, text: string) => {
    if (!text.trim()) return;

    update((vehicles) =>
      vehicles.map((vehicle) =>
        vehicle.id === vehicleId
          ? {
              ...vehicle,
              notes: [
                {
                  id: createId(),
                  text: text.trim(),
                  timestamp: new Date().toISOString()
                },
                ...vehicle.notes
              ]
            }
          : vehicle
      )
    );
  };

  return {
    subscribe,
    addTask,
    toggleTask,
    updateTaskResult,
    updateCallsign,
    addNote
  };
}

export const vehiclesStore = createVehiclesStore();
