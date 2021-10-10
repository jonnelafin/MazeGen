<script lang="ts">
    import Board from "./Board.svelte";
    import StackVisual from "./Stack.svelte";

    let theme: boolean = false;

    let timer;
    let b;
    let final;
    let w = 8;
    let h = 8;
    let stackLen = 1;
    let started = false;
    let showRaw = false;
    let showFinal = true;
    let showStack = false;
    let stack;
    let delay = 10;
    $: if(stackLen == 0 && timer){
        clearInterval(timer);
        timer=undefined;
        b.forward();
    }

    let boardID = {};
</script>

<main style={theme ? "background:black;color:white;" : ""}>
    <div class="layout">
        <h1>mazeGen<button class="themebtn" on:click={()=>{theme = !theme}}>{theme ? "☀" : "☾"}</button></h1>
        <h3>made by <a href="https://jonnelafin.github.io">jonnelafin</a></h3>
        <p>If you have no idea what to do with all of these controls, just press "Start".</p>
        Width: <input type="number" bind:value={w}/>
        Height: <input type="number" bind:value={h}/>
        <br />
        Show raw: <input type="checkbox" bind:checked={showRaw} />
        Show final: <input type="checkbox" bind:checked={showFinal} />
        Show stack: <input type="checkbox" bind:checked={showStack} />
        <br />
        <button on:click={ ()=>{ b.forward() } }>Step</button>
        Delay: <input type="number" bind:value={delay}/>
        <button on:click={ ()=>{ timer = setInterval( ()=>{b.forward()}, delay) } }>Start</button>
        <button on:click={ ()=>{ if(timer){clearInterval(timer)} } }>Stop</button>
        <button on:click={()=>{ boardID = {}; if(timer){clearInterval(timer);timer=undefined;} started = false; final = undefined;stackLen = 1;}}>Reset</button>
        <br />
        {#key boardID}
            <Board bind:this={b} bind:stack={stack} bind:final={final} bind:WIDTH={w} bind:HEIGHT={h} bind:stackLen={stackLen} bind:started={started} bind:showA={showRaw} bind:showB={showFinal} />
        {/key}
        Stack length: {stackLen} 
        {#if showStack}
            <StackVisual bind:stack={stack} />
        {/if}
        <br />
        <button on:click={ ()=>{final = b.assembleMaze(w, h)} } >Rerender maze</button>
        <button on:click={ ()=>{final = undefined} } >Clear render</button>
    </div>
</main>

<style>
    :global(html, body, #svelte){
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
    main{
        font-family: Arial, Helvetica, sans-serif;
        width: 100%;
        padding: 1em 0;
        height: calc(100% - 2em);
    }
    .layout{
        width: 50%;
        margin: 0 auto;
    }
    .themebtn{
        float: right;
    }
    @media (max-width: 1000px) {
        .layout{
            width: 100%;
            margin: 0 0;
        }
    }
</style>