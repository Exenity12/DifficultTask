var rawArray = "";

var visitedWay = [];
var allEdges = [];
var nodes = [];

function getWay(fromName, toWay) {
    allEdges = iteratingOverPaths(rawArray);
    rawArray.forEach((item) => {
        nodes.push({name: item.name, neighborNames: (searchAllNeighbors(item.name)), shortestWay: Infinity, edgeOfThePath: null})
    });
    if(!getNodeByName(toWay)) return null;
    let activeNode = getNodeByName(fromName);
    activeNode.shortestWay = 0;
    let allNodes = [ ...nodes];
    console.log(allNodes)
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
    let t = 1;
    while(t < result.path.length){
        console.log("id_" + result.path[t - 1] + "_" + result.path[t])
        if(result.path[t - 1] < result.path[t]) {
            document.getElementById("id_" + result.path[t - 1] + "_" + result.path[t]).childNodes.forEach(item => {
                item.style.background = "black"
            })
        } else if (result.path[t - 1] > result.path[t]){
            document.getElementById("id_" + result.path[t] + "_" + result.path[t - 1]).childNodes.forEach(item => {
                item.style.background = "black"
            });
        };
        t++;
    }
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
    arrNameOfNode.unshift(to)
    while(activeTo !== from){
        allNoda.forEach(item => {
            if(!item.edgeOfThePath) return
            if(item.edgeOfThePath.to === activeTo){
                activeTo = item.edgeOfThePath.from;
                arrNameOfNode.unshift(activeTo)
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
    if(result > 200) return
    return result;
}


const numberNeibor = document.querySelector("#numberNeibor");
const rectangleElement = document.querySelector("#rectangle");
var rectanglePerem = 40;
rectangleElement.addEventListener("click", clickRectangleShowHandler);
let rectangleDotsPaint = [];

let clonEdges = [];
var countNumber = 0;
let localAllEdges = [];
let numberClick = 0;

function clickRectangleShowHandler(eventRentagle){
    let numbreNeighborEdges = document.createElement("div");
    numbreNeighborEdges.className = "visual-element-neighbor";
    numbreNeighborEdges.innerHTML = numberClick
    numbreNeighborEdges.style = `top: ${eventRentagle.layerY + 200}px; left: ${eventRentagle.layerX + 300}px`;
    numberNeibor.appendChild(numbreNeighborEdges);
    numberClick++;
    let arrayEldenEdge = [];
	rectanglePerem++;
	const dot = {top: eventRentagle.layerY, left: eventRentagle.layerX};
	rectangleDotsPaint.push(dot);
    rawArray = transformationArray(rectangleDotsPaint);
    let neighborTouch = [];
    let arrTouch = [];
    localAllEdges.forEach(item => {
        arrayEldenEdge.push(item);
    });
    localAllEdges = iteratingOverPaths(rawArray);
    rawArray.forEach((item) => {
        arrTouch.push({name: item.name, neighborNames: (searchAllNeighbors(item.name)), shortestWay: Infinity, edgeOfThePath: null})
    });
    neighborTouch = arrTouch;
    clonEdges = [];
    localAllEdges.forEach(item => {
        clonEdges.push(item);
    });
    findTheDifferences(deleteClone(localAllEdges), deleteClone(arrayEldenEdge)).forEach((edge) => {
        drawLine(findByName(rawArray, edge.from), findByName(rawArray, edge.to), edge.from, edge.to);
    })
};

function findTheDifferences(a, b){
    let arr = [];
    let x = 0;
    while(x < a.length){
        let y = 0;
        let nonIsClone = true
        while(y < b.length){
            if(Math.floor(a[x].way) === Math.floor(b[y].way)) {
                nonIsClone = false
            }
            y++;
        };
        if(nonIsClone) arr.push(a[x])
        x++;
        };
    return arr;
};

function findByName(array, name){
    let item;
    array.forEach(noda => {
        if(noda.name === name) item = noda;
    });
    return item;
};

function deleteClone(array){
    let arr;
    array.forEach((item, index) => {
        let x = 0;
        while(x < array.length){
            if(index !== x){
                if(array[x].way == item.way){
                    array.splice(x, 1);
                    return;
                };
            };
            x++;
        };
    });
    arr = array;
    return arr;
};

function transformationArray(array){
    let x = 0;
    let arr = [];
    while(x < array.length){
        arr.push({x: rectangleDotsPaint[x].left, y: rectangleDotsPaint[x].top, name: x},)
        x++;
    };
    return arr;
};

function drawLine(a, b, from, to){
	var length = Math.sqrt(((a.y - b.y)*(a.y - b.y))+((a.x - b.x)*(a.x - b.x)));
	var lengthTouch = Math.round(length);
	var n = lengthTouch / 10;
	var nTrue = Math.round(n);
	var wTrue = (a.x - b.x) / nTrue;
	var cTrue = (a.y - b.y) / nTrue;
	var topThisPosition = a.y;
	var leftThisPosition = a.x;
    var newEdge = document.createElement("div");
    newEdge.id = "id_" + from + "_" + to
	for(x = 0; x < nTrue; x += 1){
		topThisPosition -= cTrue
		leftThisPosition -= wTrue;
		var newElement = document.createElement("div");
		newElement.className = "visual-element";
		newElement.style = `top: ${topThisPosition}px; left: ${leftThisPosition}px`;
		newEdge.appendChild(newElement);
	};
    rectangleElement.appendChild(newEdge);
};