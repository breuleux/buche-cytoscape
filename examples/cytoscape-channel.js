
function buche(cfg) {
    console.log(JSON.stringify(cfg));
}

buche({
    command: 'require',
    path: '/',
    pluginPath: '../lib/index.js'
});

buche({
    command: 'open',
    path: '/graph',
    type: 'cytoscape',
    options: {
        style: "./graph-style.css",
        layout: {
            name: 'cola'
        }
    }
});

let connList = process.argv.slice(2);
if (connList.length == 0) {
    connList = 'AB BC CA AD DE'.split(' ');
}

let connections = connList.map(pair => pair.split(''));
let nodes = new Set(connList.join(''));

for (let node of nodes) {
    buche({
        command: 'element',
        path: '/graph',
        id: node
    });
}

for (let [from, to] of connections) {
    buche({
        command: 'element',
        path: '/graph',
        source: from,
        target: to
    });
}
