onload = function() {

   
    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const genNew = document.getElementById('generate-graph');
    const solve = document.getElementById('solve');
    const temptext = document.getElementById('temptext');
    const temptext2 = document.getElementById('temptext2');
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Gujarat', 'Goa', 'Kanpur', 'Jammu', 'Hyderabad', 'Bangalore', 'Gangtok', 'Meghalaya'];

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

    const network2 = new vis.Network(container2);
    network2.setOptions(options);


    function createData() {

        //const cities = ['Delhi', 'Mumbai', 'Gujarat', 'Chennai', 'Goa', 'Kanpur', 'Jammu', 'Hyderabad', 'Bangalore', 'Gangtok', 'Meghalaya'];

        V = Math.max(Math.floor(Math.random() * cities.length) ,4);
        let vertices =[]

        for(let i=0;i<V&&i<cities.length;i++)
        {
            vertices.push({id:i, label: cities[i]})
        }

        let edges = [];
        for(let i=1;i<V;i++){
            let neigh = Math.floor(Math.random()*i);
            edges.push({type: 0, from: i, to: neigh, color: 'orange',label: String(Math.floor(Math.random()*70)+30)});
        }

        for(let i=0;i<V;i++){

            let n1 = Math.floor(Math.random()*V);
            let n2 = Math.floor(Math.random()*V);
            if(n1!==n2){
                if(n1<n2){
                    let tmp = n1;
                    n1 = n2;
                    n2 = tmp;
                }
                // Seeing if an edge between these two vertices already exists
                // And if it does then of which kind
                let works = 0;
                for(let j=0;j<edges.length;j++){
                    if(edges[j]['from']===n1 && edges[j]['to']===n2) {
                        if(edges[j]['type']===0)
                            works = 1;
                        else
                            works = 2;
                    }
                }

                // Adding edges to the graph
                // If works == 0, you can add bus as well as plane between vertices
                // If works == 1, you can only add plane between them
                if(works <= 1) {
                    if (works === 0 && i < V / 4) {
                        // Adding a bus
                        edges.push({
                            type: 0,
                            from: n1,
                            to: n2,
                            color: 'orange',
                            label: String(Math.floor(Math.random() * 70) + 31)
                        });
                    } else {
                        // Adding a plane
                        edges.push({
                            type: 1,
                            from: n1,
                            to: n2,
                            color: 'green',
                            label: String(Math.floor(Math.random() * 40) + 1)
                        });
                    }
                    i++;
                }
            }
        }

        src = 0;
        dst = V-1

        curr_data = {
            nodes: vertices,
            edges: edges
        };

        return curr_data;
    }

    genNew.onclick = function () {
        createData()
        network.setData(curr_data);
        temptext2.innerText = 'Find least time path from '+cities[src]+' to '+cities[dst];
        temptext.style.display = "inline";
        temptext2.style.display = "inline";
        container2.style.display = "none";
    }

    solve.onclick = function () {
        // Create graph from data and set to display
        temptext.style.display  = "none";
        temptext2.style.display  = "none";
        container2.style.display = "inline";
        network2.setData(solveGraph());
    };

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

    function createGraph(V,E) {
        // V-Number of vertices
        // E-set of edges in graph
    
        //Edge {vertice1, vertice2, weight_of_edge}
    
        let adjacency_list = [];
        
        console.log(E[0])
        for(let i=0;i<V;i++)
        {
            adjacency_list.push([]);
        }
    
        for(let i=0;i<E.length;i++)
        {
            let edge = E[i]
            if(edge['type']===1)
                continue
            adjacency_list[edge['to']].push([edge['from'], parseInt(edge['label'])])
            adjacency_list[edge['from']].push([edge['to'], parseInt(edge['label'])])
        }
    
        return adjacency_list;
    }
    

    function shouldTakePlane(edges, dist1, dist2, mn_dist) {
        let plane = 0;
        let p1=-1, p2=-1;
        for(let pos in edges){
            let edge = edges[pos];
            if(edge['type']===1){
                let to = edge['to'];
                let from = edge['from'];
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
        return {plane, p1, p2};
    }

    function solveGraph() {
        const data = curr_data;
        console.log(data['edges'])
        const graph = createGraph(data['nodes'].length, data['edges']);

        let dist1 = djikstra(graph, V, src)
        let dist2 = djikstra(graph,V,dst)

        let mn_dist = dist1[dst][0];

        let {plane, p1, p2} = shouldTakePlane(data['edges'], dist1, dist2, mn_dist);
        
        let new_edges = []
        if(plane!==0){
            new_edges.push({arrows: { to: { enabled: true}}, from: p1, to: p2, color: 'green',label: String(plane)});
            // Using spread operator to push elements of result of pushEdges to new_edges
            new_edges.push(...pushEdges(dist1, p1, false));
            new_edges.push(...pushEdges(dist2, p2, true));
        } else{
            new_edges.push(...pushEdges(dist1, dst, false));
        }
        const ans_data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return ans_data;
    }

    function pushEdges(dist, curr, reverse) {
        let tmp_edges = [];
        while(dist[curr][0]!==0){
            let fm = dist[curr][1];
            if(reverse)
                tmp_edges.push({arrows: { to: { enabled: true}},from: curr, to: fm, color: 'orange', label: String(dist[curr][0] - dist[fm][0])});
            else
                tmp_edges.push({arrows: { to: { enabled: true}},from: fm, to: curr, color: 'orange', label: String(dist[curr][0] - dist[fm][0])});
            curr = fm;
        }
        return tmp_edges;
    }

    genNew.click()
}





