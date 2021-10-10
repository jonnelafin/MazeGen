<script lang="ts">
    import type { node } from "./NodeClass";
    export let stack: node[] = [];
</script>
<main>
    <table>
        <tr>
            <th>Stack</th>
        </tr>
        {#each stack as s}
            <tr>
                <td>{s.id}</td>
            </tr>
        {/each}
    </table>
</main>

<style>
    table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 5em;
    }

    td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even) {
        background-color: #dddddd;
    }
</style>