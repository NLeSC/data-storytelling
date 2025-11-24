<script lang="ts">import { T } from '@threlte/core';
let { perspective } = $props();
</script>

{#if perspective}
  <T.PerspectiveCamera
    makeDefault
    position={[1, 2, 3]}
  />
{:else}
  <T.OrthographicCamera
    makeDefault
    position={[4, 5, 6]}
  />
{/if}
