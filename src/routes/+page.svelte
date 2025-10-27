<script lang="ts">
  import { derived } from 'svelte/store';
  import { vehiclesStore } from '$lib/stores';

  let selectedVehicleId: string = 'mtf';
  let newTaskTitle = '';
  let newTaskDescription = '';

  const vehicles = vehiclesStore;

  const openTasks = derived(vehiclesStore, ($vehicles) =>
    $vehicles.flatMap((vehicle) =>
      vehicle.tasks
        .filter((task) => !task.completed)
        .map((task) => ({
          ...task,
          vehicleId: vehicle.id,
          vehicleCallsign: vehicle.callsign
        }))
    )
  );

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;

    vehiclesStore.addTask(selectedVehicleId, {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim()
    });

    newTaskTitle = '';
    newTaskDescription = '';
  };
</script>

<section class="space-y-10">
  <div class="grid gap-6 md:grid-cols-3">
    <div class="md:col-span-2 space-y-4">
      <h1 class="text-3xl font-semibold text-white">Leitstelle</h1>
      <p class="text-gray-400">
        Überblick über alle Fahrzeuge der Jugendfeuerwehr und ihre aktuellen Funkaufgaben.
      </p>
      <div class="grid gap-4 md:grid-cols-3">
        {#each $vehicles as vehicle (vehicle.id)}
          <a
            class="block rounded-lg border border-accentMuted bg-panel p-4 shadow transition hover:-translate-y-1 hover:border-accent"
            href={`/fahrzeuge/${vehicle.id}`}
          >
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-lg font-semibold text-white">{vehicle.callsign}</h2>
                <p class="text-sm text-gray-400">{vehicle.tasks.filter((task) => !task.completed).length} offene Aufgabe(n)</p>
              </div>
              <span class="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                {vehicle.tasks.length} Aufgaben
              </span>
            </div>
            <div class="mt-3 space-y-2 text-sm text-gray-300">
              {#each vehicle.tasks.slice(0, 3) as task (task.id)}
                <div class="flex items-center gap-2">
                  <div class={`h-2 w-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-accent'}`}></div>
                  <span class="truncate">{task.title}</span>
                </div>
              {/each}
              {#if vehicle.tasks.length === 0}
                <p class="italic text-gray-500">Keine Aufgaben eingetragen.</p>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    </div>
    <aside class="space-y-6 rounded-lg border border-accentMuted bg-panel p-5 shadow">
      <div>
        <h2 class="text-xl font-semibold text-white">Neue Aufgabe</h2>
        <p class="text-sm text-gray-400">Erstelle eine Funkaufgabe für ein Fahrzeug.</p>
      </div>
      <form
        class="space-y-4"
        on:submit|preventDefault={handleCreateTask}
      >
        <label class="block text-sm font-medium text-gray-300">Fahrzeug</label>
        <select
          bind:value={selectedVehicleId}
          class="w-full rounded-md border border-accentMuted bg-surface/80 text-gray-100 focus:border-accent focus:ring-accent"
        >
          {#each $vehicles as vehicle (vehicle.id)}
            <option value={vehicle.id}>{vehicle.callsign}</option>
          {/each}
        </select>
        <div>
          <label class="block text-sm font-medium text-gray-300">Titel</label>
          <input
            bind:value={newTaskTitle}
            class="mt-1 w-full rounded-md border border-accentMuted bg-surface/80 text-gray-100 focus:border-accent focus:ring-accent"
            placeholder="Aufgabentitel"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300">Beschreibung</label>
          <textarea
            bind:value={newTaskDescription}
            class="mt-1 w-full rounded-md border border-accentMuted bg-surface/80 text-gray-100 focus:border-accent focus:ring-accent"
            rows="3"
            placeholder="Beschreibung oder Funktext"
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full rounded-md bg-accent py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-accentMuted"
        >
          Aufgabe erstellen
        </button>
      </form>
    </aside>
  </div>

  <section class="rounded-lg border border-accentMuted bg-panel p-6 shadow">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-white">Offene Aufgaben</h2>
      <span class="text-sm text-gray-400">{$openTasks.length} Aufgaben insgesamt</span>
    </div>
    <div class="mt-4 grid gap-4 md:grid-cols-2">
      {#if $openTasks.length === 0}
        <p class="col-span-2 text-gray-500">Alle Aufgaben erledigt – gute Arbeit!</p>
      {:else}
        {#each $openTasks as task (task.id)}
          <div class="rounded-md border border-accentMuted bg-surface/80 p-4">
            <div class="flex items-center justify-between text-sm text-gray-400">
              <span class="font-semibold text-accent">{task.vehicleCallsign}</span>
              <a
                class="text-xs uppercase tracking-wide text-gray-400 hover:text-white"
                href={`/fahrzeuge/${task.vehicleId}`}
                >Details</a
              >
            </div>
            <h3 class="mt-2 text-lg font-semibold text-white">{task.title}</h3>
            {#if task.description}
              <p class="text-sm text-gray-300">{task.description}</p>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </section>
</section>
