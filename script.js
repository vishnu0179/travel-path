onload = function() {

    const container = document.getElementById('container')
    const genNew = document.getElementById('gen-graph')

    const options = {
        edges : {
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf015',
                size: 40,
                color: '#991133',
            }
        }

    };

    const network = new vis.Network(container)
    network.setOptions(options)

    function createData() {

        const cities = ['Delhi', 'Mumbai', 'Gujarat', 'Chennai', 'Goa', 'Kanpur', 'Jammu', 'Hyderabad', 'Bangalore', 'Gangtok', 'Meghalaya'];

        const V = Math.floor(Math.random() * cities.length) + 3;
        let vertices =[]

        for(let i=0;i<V&&i<cities.length;i++)
        {
            vertices.push({id:i, label: cities[i]})
        }

        let edges = [];
        for(let i=1;i<V;i++){
            let neigh = Math.floor(Math.random()*i);
            edges.push({from: i, to: neigh, color: 'orange',label: String(Math.floor(Math.random()*70)+30)});
        }

        const data = {
            nodes: vertices,
            edges: edges
        };

        return data;
    }

    genNew.onclick = function () {
        let data = createData()
        network.setData(data);
    }

    genNew.click()
}

function createGraph(V,E) {
    // V-Number of vertices
    // E-set of edges in graph

    //Edge {vertice1, vertice2, weight_of_edge}

    let adjacency_list = [];

    for(let i=0;i<V;i++)
    {
        adjacency_list.push([]);
    }

    for(let i=0;i<E.length;i++)
    {
        adjacency_list[E[i][0]].push([E[i][1], E[i][2]])
        adjacency_list[E[i][1]].push([E[i][0], E[i][2]])
    }

    return adjacency_list;
}



function djikstra(graph, V, src) {
    let visited =  Array(V).fill(0);
    let dist = [];
    
    for(let i =0;i<V;i++)
    {
        dist.push([1000,-1]);
    }

    dist[src][0] = 0;

    for(let i=0;i<V-1;i++) {

        let min = -1;
        for(let j=0;j<V;j++) {
            if(visited[j]===0) {
                if(min == -1) {
                    min = j;
                }
                else if( dist[j][0]<dist[min][0]) {
                    min = j;
                }
            }
        }
        visited[min] = 1

        for(let j=0;j<graph[min].length;j++) {
            let edge = graph[min][j];
            if(visited[edge[0]]===0 && dist[edge[0]][0]>dist[min][0]+edge[1]){
                dist[edge[0]][0] = dist[min][0] + edge[1]
                dist[edge[0]][1] = min
            }
        }
    }
    return dist;
}

let src = 0;
let V = 9;
let E = [[0,1,4], [0,7,8], [1,7,11], [1,2,8], [7,8,7], [6,7,1], [2,8,2],
    [6,8,6], [5,6,2], [2,5,4], [2,3,7], [3,5,14], [3,4,9], [4,5,10]];

let graph = createGraph(V,E);
let distances = djikstra(graph,V,0);
console.log(distances);

let plane = 0;
let p1=-1, p2=-1;
for(let pos in data['edges']){
    let edge = data['edges'][pos];
    if(edge['type']===1){
        let to = edge['to']-1;
        let from = edge['from']-1;
        let wght = parseInt(edge['label']);
        if(dist1[to][0]+wght+dist2[from][0] < mn_dist){
            plane = wght;
            p1 = to;
            p2 = from;
            mn_dist = dist1[to][0]+wght+dist2[from][0];
        }
        if(dist2[to][0]+wght+dist1[from][0] < mn_dist){
            plane = wght;
            p2 = to;
            p1 = from;
            mn_dist = dist2[to][0]+wght+dist1[from][0];
        }
    }
}