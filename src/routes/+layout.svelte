<script lang="ts">
  import '../app.postcss';
</script>

<svelte:head>
  <title>JF Funkübung</title>
</svelte:head>

<div class="min-h-screen bg-surface text-gray-100">
  <header class="border-b border-accentMuted bg-panel/80 backdrop-blur sticky top-0 z-50">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <a href="/" class="text-lg font-semibold tracking-wide text-white">Leitstelle</a>
      <nav class="flex gap-4 text-sm">
        <a href="/" class="text-gray-300 hover:text-white">Übersicht</a>
      </nav>
    </div>
  </header>
  <main class="mx-auto max-w-6xl px-4 py-8">
    <slot />
  </main>
</div>
