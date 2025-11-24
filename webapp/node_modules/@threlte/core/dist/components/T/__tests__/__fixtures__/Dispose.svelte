<script lang="ts">import { T, useDisposal, useTask } from '@threlte/core';
let { is } = $props();
const { dispose } = useDisposal();
// This simulates the default animation loop calling dispose
useTask(() => dispose());
</script>

<T.Mesh>
  <T {is} />
</T.Mesh>
