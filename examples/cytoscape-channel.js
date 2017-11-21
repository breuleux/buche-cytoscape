#!/usr/bin/env buche --inspect node

function buche(cfg) {
    console.log(JSON.stringify(cfg));
}

buche({
    command: 'require',
    path: '/',
    pluginPath: `${__dirname}/../lib/index.js`
});

buche({
    command: 'open',
    path: '/graph',
    type: 'cytoscape',
    options: {
        style: `${__dirname}/graph-style.css`,
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

for (let [from, to] of connections) {
    buche({
        command: 'element',
        path: '/graph',
        source: from,
        target: to
    });
}
