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
        nodes.push({name: item.name, neighborNames: (searchAllNeighbors(item.name)), shortestWay: Infinity, edgeOfThePath: null})
    })
    console.log(nodes)
    console.log(allEdges)
    if(!getNodeByName(toWay)) return null;
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
    if(getNodeByName(toWay).shortestWay === Infinity) return null
    const resultArray = findingTheRightPath(allNodes, fromName, toWay);
    const result = {wayLength: getNodeByName(toWay).shortestWay, path: resultArray};
    console.log(result)
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
    return neighborNodes;
};

function getNeighborNodes(fromName, nodes, edges) {
    let neighborNodes = [];
    getNeighborEdges(fromName, nodes, edges).forEach((neighborEdges) => {
        nodes.forEach(((neighbor) => {
            if(neighbor.name === neighborEdges.to) neighborNodes.push(neighbor);
        }));
    });
    return neighborNodes;
}


function updateCost(neighborEdges, aNode, neighborNodes){
    let nextNodes = [];
    neighborNodes.forEach((noda) => {
        let informationAboutTheNewEdge = getLengthFromTo(aNode, noda, neighborEdges);
        let newMount = aNode.shortestWay + informationAboutTheNewEdge.pathLength
        if(noda.shortestWay > newMount ) {
            noda.shortestWay = newMount;
            noda.edgeOfThePath = {from: informationAboutTheNewEdge.from, to: informationAboutTheNewEdge.to};
            nextNodes.push({ ...noda });
        }
    })
    return nextNodes;
};

function getLengthFromTo(fromNode, toNode, neighborEdges) {
    let edgeOfThePath;
    neighborEdges.forEach((edge) => {
        if(edge.from == fromNode.name && edge.to == toNode.name){
            edgeOfThePath = {from: edge.from, to: edge.to, pathLength: edge.way}
        };
    });
    return edgeOfThePath;
}

function getNodeByName(name) {
    let findNoda;
    nodes.forEach((noda) => {
        if(noda.name === name) findNoda = noda
    })
    return findNoda
}


function getLowestNode(allNodes, visitedNodesNames){
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

function findingTheRightPath(allNoda, from, to) {
    let arrNameOfNode = [];
    let activeTo = to;
    arrNameOfNode.unshift(...to)
    while(activeTo !== from){
        allNoda.forEach(item => {
            if(!item.edgeOfThePath) return
            if(item.edgeOfThePath.to === activeTo){
                activeTo = item.edgeOfThePath.from;
                arrNameOfNode.unshift(...activeTo)
            };
        });
    };
    return arrNameOfNode
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






const rectangleElement = document.querySelector("#rectangle");
var rectanglePerem = 40;
rectangleElement.addEventListener("click", clickRectangleShowHandler);
let rectangleDotsPaint = [];



function clickRectangleShowHandler(eventRentagle){
	var newElement = document.createElement("div");
	newElement.className = "visual-element";
	newElement.style = `top: ${eventRentagle.layerY}px; left: ${eventRentagle.layerX}px`;
	rectangleElement.appendChild(newElement);
	rectanglePerem++;
	const dot = {top: eventRentagle.layerY, left: eventRentagle.layerX};
	rectangleDotsPaint.push(dot);
	if(rectangleDotsPaint.length >= 2){
		const previousDot = rectangleDotsPaint[rectangleDotsPaint.length - 2];
        console.log(rectangleDotsPaint)
		drawLine(dot, previousDot);
	};
};


function drawLine(a, b){
	var length = Math.sqrt(((a.top - b.top)*(a.top - b.top))+((a.left - b.left)*(a.left - b.left)));
	var lengthTouch = Math.round(length);
	var n = lengthTouch / 10;
	var nTrue = Math.round(n);
	var wTrue = (a.left - b.left) / nTrue;
	var cTrue = (a.top - b.top) / nTrue;
	var topThisPosition = a.top;
	var leftThisPosition = a.left;
	for(x = 0; x < nTrue; x += 1){
		topThisPosition -= cTrue
		leftThisPosition -= wTrue;
		var newElement = document.createElement("div");
		newElement.className = "visual-element";
		newElement.style = `top: ${topThisPosition}px; left: ${leftThisPosition}px`;
		rectangleElement.appendChild(newElement);
	};
};

