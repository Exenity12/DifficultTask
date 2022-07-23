let rawArray = [
    {x: 0, y: 0, name: "A"},
    {x: 8, y: 8, name: "B"},
    {x: 0, y: 3, name: "C"},
    {x: 2, y: 2, name: "D"},
];

var visitedWay = [];
var allEdges = [];
var nodes = [];

function getWay(fromName, toWay) {
    allEdges = iteratingOverPaths(rawArray)
    rawArray.forEach((item) => {
        nodes.push({name: item.name, neighborNames: (searchAllNeighbors(item.name)), shortestWay: Infinity})
    })
    console.log(nodes)
    console.log(allEdges)
    let activeNode = getNodeByName(fromName);
    activeNode.shortestWay = 0;
    let allNodes = [ ...nodes];
    while (visitedWay.length !== rawArray.length) {
        const neighborEdges = getNeighborEdges(activeNode.name, allNodes, allEdges);
        const neighborNodes = getNeighborNodes(activeNode.name, allNodes, allEdges);
        const nextUpdatedNodes = updateCost(neighborEdges, activeNode, neighborNodes);
        allNodes = getUpdatedAllNodes(nextUpdatedNodes, allNodes);
        visitedWay.push(activeNode.name);
        activeNode = getLowestNode(nodes, visitedWay);
    };
    console.log('nodes > ', allNodes);
};

function getUpdatedAllNodes(nextNodes, nodes) {
    return nodes.map((node) => {
        return nextNodes.find(n => n.name === node.name)
            || node;
    });
};

function getNeighborEdges(fromName, nodes, edges){
    let index = nodes.findIndex((item) => item.name == fromName);
    let neighborNodes = edges.filter((item) => {
        return item.from === fromName
            && nodes[index].neighborNames.filter((n) => n === item.to).length;
    });
    neighborNodes.sort((a, b) => a.way - b.way);
    // console.log(neighborNodes)
    return neighborNodes;
};

function getNeighborNodes(fromName, nodes, edges) {
    let neighborNodes = [];
    getNeighborEdges(fromName, nodes, edges).forEach((neighborEdges) => {
        nodes.forEach(((neighbor) => {
            if(neighbor.name === neighborEdges.to) neighborNodes.push(neighbor);
        }));
    });
    // console.log(neighborNodes)
    return neighborNodes;
}


function updateCost(neighborEdges, aNode, neighborNodes){
// обновление стоимости
    let nextNodes = [];
    neighborNodes.forEach((noda) => {
        let newMount = aNode.shortestWay + getLengthFromTo(aNode, noda, neighborEdges);
        if(noda.shortestWay > newMount ) {
            noda.shortestWay = newMount;
            nextNodes.push({ ...noda });
        }
    })
    return nextNodes;
};

function getLengthFromTo(fromNode, toNode, neighborEdges) {
    let pathLength;
    neighborEdges.forEach((edge) => {
        if(edge.from == fromNode.name && edge.to == toNode.name){
            pathLength = edge.way;
        };
    });
    return pathLength;
}

function getNodeByName(name) {
    let findNoda;
    nodes.forEach((noda) => {
        if(noda.name === name) findNoda = noda
    })
    return findNoda
}


function getLowestNode(allNodes, visitedNodesNames){
    // console.log(visitedNodesNames)
    let findLowestNode;
    allNodes.sort((a, b) => a.shortestWay - b.shortestWay);
    let x = 0;
    while(x < allNodes.length){
        visitedNodesNames.forEach((allVisit) => {
            if(allVisit == allNodes[x].name) x++;
            return;
        })
        findLowestNode = allNodes[x]
        break;
    }
    return findLowestNode;
}
























function iteratingOverPaths(array){
    arr = [];
    let odin = 0;
    while(odin < array.length){
        let dva = 0;
        while(dva < array.length){
            if(odin !== dva){
                let pathWay = searcHypotenuse(array[odin].x, array[odin].y, array[dva].x, array[dva].y)
                if(pathWay){
                    arr.push({way: pathWay, from: array[odin].name, to: array[dva].name})
                };
            };
            dva++;
        };
    odin++;
    };
    return arr;
};

function searchAllNeighbors(from) {
    let neighbors = [];
    let arrLocalWay = []
    let dva = 0;
    while(dva < allEdges.length){
        if(allEdges[dva].from == from){
            arrLocalWay.push(allEdges[dva])
        }
        dva++;
    };
    arrLocalWay.forEach((item) => {
        neighbors.push(item.to)
    })
    return neighbors
};

searcHypotenuse = (firstX, firstY, secondX, secondY) => { 
    let x = secondX - firstX;
    let y = secondY - firstY;
    let resultInQuad = x * x + y * y;
    let result = Math.sqrt(resultInQuad);
    if(result > 10) return
    return result;
}



getWay("A")






