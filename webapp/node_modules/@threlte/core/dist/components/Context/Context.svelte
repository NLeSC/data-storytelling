<script lang="ts">import { createThrelteContext } from '../../context/createThrelteContext.svelte';
let { children, ...rest } = $props();
createThrelteContext(rest);
</script>

{@render children()}
