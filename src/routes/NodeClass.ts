class node{
    x: number
    y: number
    connections: Array<node>
    idconnections: number[]
    visited: boolean
    // Neighbours
    nUp: node
    nRight: node
    nDown: node
    nLeft: node
    neighbours: Array<node>
    id: number
    // 
    distance: number
    // 
    constructor(nodex: number, nodey: number){
        this.x = nodex;
        this.y = nodey;
        this.connections = [];
        this.idconnections = [];
        this.visited = false;
        this.neighbours = [];
        this.id = this.x * 1000 + this.y;
    }
}

export {node};