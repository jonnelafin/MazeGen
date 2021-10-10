<script lang="ts">
    export let value: boolean;
</script>

<main style="background:{value ? "blue" : "#1c1c1c"};">
    <!-- {value ? "#" : "."} -->
</main>

<style>
    main{
        flex: 1;
        font-family: monospace;
    }
</style>