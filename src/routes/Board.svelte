<script lang="ts">
    import NodeVisual from "./Node.svelte";
    import MazeBlockVisual from "./MazeBlock.svelte";
    import { node } from "./NodeClass";

    export let WIDTH = 32;
    export let HEIGHT = 32;

    export let showA = false;
    export let showB = false;

    let canvasWidth = 500;
    $: canvasWidth = 500 * (WIDTH / HEIGHT)
    $: console.log("Width: ", canvasWidth);

    export let data: node[][] = createBoard(WIDTH, HEIGHT);
    $: data = createBoard(WIDTH, HEIGHT);


    export function assignNeighbours(d: node[][], w: number, h:number){
        for(let x = 0; x < w; x++){
            let row = d[x];
            for(let y = 0; y < h; y++){
                let n = d[x][y];

                if(x > 0){
                    n.nLeft = d[x-1][y];
                    n.neighbours.push(d[x-1][y]);
                }
                if(y > 0){
                    n.nUp = d[x][y-1];
                    n.neighbours.push(d[x][y-1]);
                }

                if(x < d.length - 1){
                    n.nRight = d[x+1][y];
                    n.neighbours.push(d[x+1][y]);
                }
                if(y < row.length - 1){
                    n.nDown = d[x][y+1];
                    n.neighbours.push(d[x][y+1]);
                }
            }
        }
    }

    export function createBoard(w: number, h:number){
        let newData = [];
        for(let x = 0; x < w; x++){
            let row = [];
            for(let y = 0; y < h; y++){
                let n = new node(x, y);
                row.push( n );
            }
            newData.push(row);
        }
        assignNeighbours(newData, w, h);
        return newData;
    }

    function chooseNeighbour(n: node){
        let candidates: node[] = [];
        for(let i in n.neighbours){
            if( !(n.neighbours[i].visited) ){
                candidates.push( n.neighbours[i] );
            }
        }
        if(candidates.length > 0){
            return candidates[Math.floor(Math.random() * candidates.length)];
        }
    }
    export let started = false;
    export let stack: node[] = [data[0][0]];
    export let stackLen = 0;
    export function forward(){
        if(!started){
            started = true;
            stack = [data[0][0]];
        }
        if(stack.length > 0){
            let firstElement = stack.slice(-1).pop();
            firstElement.visited = true; // kind of pointless failsafe
            let next = chooseNeighbour(firstElement);
            if(next){
                firstElement.connections.push(next);
                firstElement.idconnections.push(next.id);
                next.connections.push(firstElement);
                next.idconnections.push(firstElement.id);
                stack.push(next);
            }
            else{
                stack.pop();
            }



            stack = stack;
            data = data;
            if(showB){
                final = assembleMaze(WIDTH, HEIGHT);
            }
        }
        else{
            console.log("Stack empty!")
            if(!final){
                console.log("Assembling maze...");
                final = assembleMaze(WIDTH, HEIGHT);
            }
        }
        stackLen = stack.length;
    }
    export let final: boolean[][];
    function createMaze(w: number, h:number){
        let newMaze = [];
        for(let x = 0; x < w; x++){
            let row = [];
            for(let y = 0; y < h; y++){
                let n = false;
                row.push( n );
            }
            newMaze.push(row);
        }
        return newMaze;
    }
    export function assembleMaze(w: number, h:number){
        let mazew = (w*2)-1;
        let mazeh = (h*2)-1;
        let maze: boolean[][] = createMaze(mazeh, mazew); // Flip the coordinates, as this is a more logical way to look at them irl

        for(let x = 0; x < w; x++){
            let row = data[x];
            for(let y = 0; y < h; y++){
                let datablock = data[x][y];
                let mazex = x*2;
                let mazey = y*2;

                maze[mazey][mazex] = true;

                let hasConnectionRight = false;
                if(datablock.nRight){
                    hasConnectionRight = datablock.connections.includes(datablock.nRight);
                    maze[mazey][mazex + 1] = hasConnectionRight;
                }
                let hasConnectionDown = false;
                if(datablock.nDown){
                    hasConnectionDown = datablock.connections.includes(datablock.nDown);
                    maze[mazey + 1][mazex] = hasConnectionDown;
                }

            }
        }
        return maze;
    }
    $: console.log("Stack: ", stack);
    //$: console.log("Board: ", data)
</script>


<main>
    {#if showA}
        <div class="dots">
            {#each data as row}
                {#each row as n}
                    <NodeVisual bind:myNode={n} bind:stack={stack} />
                {/each}
                <br />
            {/each}
        </div>
        <br />
    {/if}
    {#if showB}
        <div class="maze" style="width:{canvasWidth}px !important;">
            {#if final}
                {#each final as row}
                    <div class="mazerow">
                    {#each row as n}
                        <MazeBlockVisual bind:value={n} />
                    {/each}
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
</main>

<style>
    .mazerow{
        flex: 1;
        display: flex;
        flex-direction: row;
    }
    .maze{
        /* transform: rotate(-90deg); */
        width: 500px;
        height: 500px;

        display: flex;
        flex-direction: column;
        background: gray;
        padding: 2px;
    }
    main{
    }
</style>