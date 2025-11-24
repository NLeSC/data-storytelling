<script lang="ts">import { T } from '@threlte/core';
let { is, onRefCreate } = $props();
let ref = $state.raw();
$effect.pre(() => {
    onRefCreate(ref);
});
</script>

<T
  {is}
  bind:ref
/>
