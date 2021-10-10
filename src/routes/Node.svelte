<script lang="ts">
    import type { node } from "./NodeClass";

    export let stack: node[] = [];
    export let myNode: node;

    let dict = {
        "0000" : "█",
        "0001" : ">",
        "0010" : "^",
        "0100" : "<",
        "1000" : "v",

        "0011" : "╗",
        "0110" : "╔",
        "1100" : "╚",
        "1001" : "╝",

        "0101" : "═",
        "1010" : "║",

        "0111" : "╦",
        "1011" : "╣",
        "1101" : "╩",
        "1110" : "╠",

        "1111" : "╬"
    }
    function getSymbol(n: node){
        let rule_U = ( n.nUp && n.idconnections.includes(n.nUp.id) ) ? "1" : "0";
        let rule_R = ( n.nRight && n.idconnections.includes(n.nRight.id) ) ? "1" : "0";
        let rule_D = ( n.nDown && n.idconnections.includes(n.nDown.id) ) ? "1" : "0";
        let rule_L = ( n.nLeft && n.idconnections.includes(n.nLeft.id) ) ? "1" : "0";
        return dict[ rule_U + rule_R + rule_D + rule_L ];
    }
</script>

<main>
    {#if myNode}
        { (stack.length > 0 && stack.slice(-1).pop() == myNode) ? "■" : (myNode.connections.length == 0 ? "." : myNode.connections.length ) }
    {/if}
    {#if !(myNode)}
        ?
    {/if}
</main>

<style>
    main{
        display: inline;
        font-family: monospace;
    }
</style>