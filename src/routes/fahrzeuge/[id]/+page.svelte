<script lang="ts">
  import { page } from '$app/stores';
  import { vehiclesStore } from '$lib/stores';

  const vehicles = vehiclesStore;

  let callsignDraft = '';
  let currentVehicleId: string | null = null;
  let newTaskTitle = '';
  let newTaskDescription = '';
  let newNoteText = '';

  $: vehicleId = $page.params.id;
  $: vehicle = $vehicles.find((entry) => entry.id === vehicleId);
  $: if (vehicle && vehicle.id !== currentVehicleId) {
    currentVehicleId = vehicle.id;
    callsignDraft = vehicle.callsign;
  }
  $: if (!vehicle) {
    currentVehicleId = null;
    callsignDraft = '';
  }

  const handleUpdateCallsign = () => {
    if (!vehicle) return;
    const sanitized = callsignDraft.trim();
    if (!sanitized) return;
    vehiclesStore.updateCallsign(vehicle.id, sanitized);
  };

  const handleAddTask = () => {
    if (!vehicle || !newTaskTitle.trim()) return;

    vehiclesStore.addTask(vehicle.id, {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim()
    });

    newTaskTitle = '';
    newTaskDescription = '';
  };

  const handleToggleTask = (taskId: string) => {
    if (!vehicle) return;
    vehiclesStore.toggleTask(vehicle.id, taskId);
  };

  const handleResultChange = (taskId: string, result: string) => {
    if (!vehicle) return;
    vehiclesStore.updateTaskResult(vehicle.id, taskId, result);
  };

  const handleAddNote = () => {
    if (!vehicle || !newNoteText.trim()) return;
    vehiclesStore.addNote(vehicle.id, newNoteText);
    newNoteText = '';
  };

  const toCsv = () => {
    if (!vehicle) return '';
    const rows = [
      ['Fahrzeug', vehicle.callsign],
      [],
      ['Aufgaben'],
      ['Titel', 'Beschreibung', 'Erledigt', 'Ergebnis']
    ];
    vehicle.tasks.forEach((task) => {
      rows.push([
        task.title,
        task.description,
        task.completed ? 'Ja' : 'Nein',
        task.result
      ]);
    });
    rows.push([]);
    rows.push(['Notizen']);
    rows.push(['Zeitstempel', 'Text']);
    vehicle.notes.forEach((note) => {
      rows.push([note.timestamp, note.text]);
    });

    return rows
      .map((cols) =>
        cols.map((value) => {
          const normalized = value ?? '';
          return `"${normalized.replace(/"/g, '""')}"`;
        }).join(';')
      )
      .join('\n');
  };

  const downloadCsv = () => {
    const csv = toCsv();
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${vehicle?.callsign ?? 'fahrzeug'}-funkauswertung.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
</script>

{#if !vehicle}
  <div class="rounded-lg border border-accentMuted bg-panel p-8 text-center shadow">
    <h1 class="text-2xl font-semibold text-white">Fahrzeug nicht gefunden</h1>
    <p class="mt-2 text-gray-400">Bitte zur Leitstelle zurückkehren und ein Fahrzeug auswählen.</p>
    <a href="/" class="mt-6 inline-block rounded-md bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-accentMuted">Zur Leitstelle</a>
  </div>
{:else}
  <div class="space-y-10">
    <div class="flex flex-col gap-6 rounded-lg border border-accentMuted bg-panel p-6 shadow md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-white">{vehicle.callsign}</h1>
        <p class="text-sm text-gray-400">Funkübung • Jugendfeuerwehr</p>
      </div>
      <form class="flex flex-col gap-3 md:flex-row md:items-center" on:submit|preventDefault={handleUpdateCallsign}>
        <input
          bind:value={callsignDraft}
          class="w-full rounded-md border border-accentMuted bg-surface/80 px-3 py-2 text-gray-100 focus:border-accent focus:ring-accent"
          placeholder="Funkrufname"
        />
        <button type="submit" class="rounded-md bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-accentMuted">
          Speichern
        </button>
        <button type="button" on:click={downloadCsv} class="rounded-md border border-accent px-4 py-2 text-sm font-semibold uppercase tracking-wide text-accent hover:bg-accent/10">
          CSV exportieren
        </button>
      </form>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      <section class="md:col-span-2 space-y-6">
        <div class="rounded-lg border border-accentMuted bg-surface/70 p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold text-white">Aufgaben</h2>
            <span class="text-sm text-gray-400">{vehicle.tasks.filter((task) => task.completed).length}/{vehicle.tasks.length} erledigt</span>
          </div>
          <div class="mt-4 space-y-4">
            {#if vehicle.tasks.length === 0}
              <p class="text-sm text-gray-500">Noch keine Aufgaben eingetragen.</p>
            {:else}
              {#each vehicle.tasks as task (task.id)}
                <article class="space-y-3 rounded-md border border-accentMuted bg-panel/80 p-4">
                  <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 class="text-lg font-semibold text-white">{task.title}</h3>
                      {#if task.description}
                        <p class="text-sm text-gray-300">{task.description}</p>
                      {/if}
                    </div>
                    <label class="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        on:change={() => handleToggleTask(task.id)}
                        class="h-4 w-4 rounded border-accent bg-surface text-accent focus:ring-accent"
                      />
                      erledigt
                    </label>
                  </div>
                  <div>
                    <label class="text-xs uppercase tracking-wide text-gray-400">Ergebnis / Rückmeldung</label>
                    <textarea
                      class="mt-1 w-full rounded-md border border-accentMuted bg-surface/80 text-sm text-gray-100 focus:border-accent focus:ring-accent"
                      rows="2"
                      value={task.result}
                      on:input={(event) => handleResultChange(task.id, (event.target as HTMLTextAreaElement).value)}
                      placeholder="Ergebnistext eintragen"
                    ></textarea>
                  </div>
                </article>
              {/each}
            {/if}
          </div>
        </div>

        <form class="rounded-lg border border-accentMuted bg-panel/80 p-6 space-y-4" on:submit|preventDefault={handleAddTask}>
          <div>
            <h3 class="text-xl font-semibold text-white">Neue Aufgabe hinzufügen</h3>
            <p class="text-sm text-gray-400">Erstelle eine neue Funkaufgabe für dieses Fahrzeug.</p>
          </div>
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
          <button type="submit" class="rounded-md bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-accentMuted">
            Aufgabe speichern
          </button>
        </form>
      </section>

      <section class="space-y-4 rounded-lg border border-accentMuted bg-surface/70 p-6">
        <div>
          <h2 class="text-2xl font-semibold text-white">Notizen</h2>
          <p class="text-sm text-gray-400">Kurze Statusmeldungen oder besondere Hinweise.</p>
        </div>
        <form class="space-y-3" on:submit|preventDefault={handleAddNote}>
          <textarea
            bind:value={newNoteText}
            class="w-full rounded-md border border-accentMuted bg-panel/80 text-gray-100 focus:border-accent focus:ring-accent"
            rows="3"
            placeholder="Notiz hinzufügen"
          ></textarea>
          <button type="submit" class="w-full rounded-md bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-accentMuted">
            Notiz speichern
          </button>
        </form>
        <div class="space-y-4">
          {#if vehicle.notes.length === 0}
            <p class="text-sm text-gray-500">Noch keine Notizen vorhanden.</p>
          {:else}
            {#each vehicle.notes as note (note.id)}
              <div class="rounded-md border border-accentMuted bg-panel/80 p-4">
                <p class="text-sm text-gray-300">{note.text}</p>
                <p class="mt-2 text-xs uppercase tracking-wide text-gray-500">
                  {new Date(note.timestamp).toLocaleString('de-DE')}
                </p>
              </div>
            {/each}
          {/if}
        </div>
      </section>
    </div>
  </div>
{/if}
