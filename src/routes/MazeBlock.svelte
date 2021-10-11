<script lang="ts">
    import type { node } from "./NodeClass";
    export let value: boolean;
    export let originalNode: node;
    export let maxStackLen;

    export let colorDepth: boolean;
    export let color: string;
    export let wallColor: string;
    let distance = 0;
    $: if(originalNode){
        distance = originalNode.distance
    }
    let fv = 0;
    $: fv = (distance/maxStackLen)
</script>

<main style="background:{value ? ( colorDepth ? ("rgb(" + fv*255 + "," + 0 + "," + 255 + ")") : color ) : wallColor};">
    <!-- {value ? "#" : "."} -->
</main>

<style>
    main{
        flex: 1;
        font-family: monospace;
        background: #1c1c1c;
        transition: transform 1s, filter 1s;
    }
</style>