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
    let showHead = true;
    let stack;
    let delay = 10;
    $: if(stackLen == 0 && timer){
        clearInterval(timer);
        timer=undefined;
        b.forward();
    }

    let boardID = {};
    let visitedCells = 0;
</script>

<main style={theme ? "background:black;color:white;" : ""}>
    <div class="layout">
        <h1>mazeGen<button class="themebtn" on:click={()=>{theme = !theme}}>{theme ? "☀" : "☾"}</button></h1>
        <h3>made by <a href="https://jonnelafin.github.io">jonnelafin</a></h3>
        <p>If you have no idea what to do with any of these controls, just press "Start" and you will get a nice maze.</p>
        <div class="base-input">Width:  <input type="number" bind:value={w}/></div>
        <div class="base-input">Height: <input type="number" bind:value={h}/></div>
        <br />
        <details>
            <summary>Advanced</summary>
            <hr />
            Show raw: <input type="checkbox" bind:checked={showRaw} /><br />
            Show final: <input type="checkbox" bind:checked={showFinal} /><br />
            Show stack: <input type="checkbox" bind:checked={showStack} /><br />
            <!-- Show stack head: <input type="checkbox" bind:checked={showHead} /><br /> -->
            Delay: <input type="number" bind:value={delay}/><br />
            <button on:click={ ()=>{final = b.assembleMaze(w, h)} } >Rerender maze</button>
            <button on:click={ ()=>{final = undefined} } >Clear render</button><br /><br />
            <button on:click={ ()=>{ b.forward() } }>Advance a Step</button><br />
            <hr />
        </details>
        <div class="main-buttons">
            {#if !started}
                <button on:click={ ()=>{ timer = setInterval( ()=>{b.forward()}, delay) } }>Start</button>
            {/if}
            {#if started}
                <button on:click={ ()=>{ boardID = {}; started = false; final = undefined;stackLen = 1;visitedCells = 0; if(!timer){timer = setInterval( ()=>{b.forward()}, delay)} } }>Restart</button>
            {/if}
            <button on:click={ ()=>{ if(timer){clearInterval(timer)} } }>Stop</button>
            <button on:click={()=>{ boardID = {}; if(timer){clearInterval(timer);timer=undefined;} started = false; final = undefined;stackLen = 1;visitedCells = 0;}}>Reset</button>
            <p class="stacklen">Stack length: {stackLen}</p>
        </div>
        <br />
        {#key boardID}
            <Board bind:this={b} bind:stack={stack} bind:final={final} bind:WIDTH={w} bind:HEIGHT={h} bind:stackLen={stackLen} bind:started={started} bind:showA={showRaw} bind:showB={showFinal} bind:visitedCells={visitedCells} />
        {/key}
        {#if showStack}
            <StackVisual bind:stack={stack} />
        {/if}
        <progress value={(visitedCells+1)/(w*h)} />
        <br />
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
        width: 550px;
        margin: 0 auto;
    }
    .themebtn{
        float: right;
    }
    .base-input{
        display: inline-block;
        font-family: monospace;
        white-space: break-spaces;
    }
    .main-buttons{

    }
    .stacklen{
        float: right;
    }
    progress{
        width: 100%;
    }
    @media (max-width: 1000px) {
        .layout{
            width: 100%;
            margin: 0 0;
        }
    }
</style>