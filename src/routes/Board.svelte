<script lang="ts">
    import NodeVisual from "./Node.svelte";
    import MazeBlockVisual from "./MazeBlock.svelte";
    import { node } from "./NodeClass";

    export let WIDTH = 32;
    export let HEIGHT = 32;

    export let showA = false;
    export let showB = false;
    export let showC = false;

    export let colorDepth: boolean;
    export let color: string;
    export let wallColor: string;

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
    export let visitedCells = 0;
    let maxStackLen = 0;
    export function forward(){
        if(!started){
            started = true;
            stack = [data[0][0]];
            maxStackLen = 0;
            visitedCells = 0;
        }
        if(stack.length > 0){
            let firstElement = stack.slice(-1).pop();
            firstElement.visited = true; // kind of pointless failsafe
            if(!firstElement.distance){
                firstElement.distance = 0;
            }
            let next = chooseNeighbour(firstElement);
            if(next){
                firstElement.connections.push(next);
                firstElement.idconnections.push(next.id);
                next.connections.push(firstElement);
                next.idconnections.push(firstElement.id);
                next.distance = stack.length;
                stack.push(next);
                visitedCells++;
            }
            else{
                stack.pop();
            }



            if(stack.length > maxStackLen){
                maxStackLen = stack.length;
            }
            stack = stack;
            data = data;
            if(showB || showC){
                final = assembleMaze(WIDTH, HEIGHT);
            }
        }
        else{
            console.log("Stack empty!")
            if(!final){
                visitedCells = WIDTH * HEIGHT + 1;
                console.log("Assembling maze...");
                final = assembleMaze(WIDTH, HEIGHT);
            }
        }
        stackLen = stack.length;
    }
    export let final: boolean[][];
    export let finalMap: node[][] = createMaze((HEIGHT*2)-1, (WIDTH*2)-1);
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
        finalMap = createBoard(mazeh, mazew);

        for(let x = 0; x < w; x++){
            let row = data[x];
            for(let y = 0; y < h; y++){
                let datablock = data[x][y];
                let mazex = x*2;
                let mazey = y*2;

                maze[mazey][mazex] = true;
                finalMap[mazey][mazex] = datablock;

                let hasConnectionRight = false;
                if(datablock.nRight){
                    hasConnectionRight = datablock.connections.includes(datablock.nRight);
                    maze[mazey][mazex + 1] = hasConnectionRight;
                    finalMap[mazey][mazex + 1] = datablock;
                }
                let hasConnectionDown = false;
                if(datablock.nDown){
                    hasConnectionDown = datablock.connections.includes(datablock.nDown);
                    maze[mazey + 1][mazex] = hasConnectionDown;
                    finalMap[mazey + 1][mazex] = datablock;
                }

            }
        }
        return maze;
    }
    //$: console.log("Stack: ", stack);
    //$: console.log("Board: ", data)
</script>


<main style="--bwidth:{canvasWidth}px !important;">
    {#if showA}
        <div class="dots">
            {#each data[0] as row, x}
                {#each data as n, y}
                    <NodeVisual bind:myNode={data[y][x]} bind:stack={stack} />
                {/each}
                <br />
            {/each}
        </div>
        <br />
    {/if}
    {#if showB}
        <div class="maze" style="background: {wallColor};">
            {#if final}
                {#each final as row, x}
                    <div class="mazerow">
                    {#each row as n, y}
                        <MazeBlockVisual bind:value={n} originalNode={finalMap[x][y]} maxStackLen={maxStackLen} colorDepth={colorDepth} color={color} wallColor={wallColor} />
                    {/each}
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
    {#if showC}
        <div class="ASCII">
            {#if final}
                {#each final as row, x}
                    {#each row as n, y}
                        {n ? "#" : " "}
                    {/each}
                    <br />
                {/each}
            {/if}
        </div>
    {/if}
</main>

<style>
    main{
        display: flex;
        --bwidth: 500px;
        width: 100%;
        height: 500px;
        justify-content: center;
    }
    .mazerow{
        flex: 1;
        display: flex;
        flex-direction: row;
    }
    .maze{
        flex: 0 0 var(--bwidth);
        /* transform: rotate(-90deg); */
        /* width: 500px;
        height: 500px; */

        display: flex;
        flex-direction: column;
        background: gray;
        background: #1c1c1c;
        padding: 0; /*2px*/
    }
    .dots{
        flex: 0 0 var(--bwidth);
    }
    .ASCII{
        font-family: monospace;
        white-space: pre;
        line-height: 1em;
    }
    @media (max-width: 510px) {
        main{
            transform: scale(0.5);
        }
        /* .maze{
            transform: scale(0.5);
        } */
    }
</style>