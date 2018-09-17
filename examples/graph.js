#!/usr/bin/env buche --inspect node

function buche(cfg) {
    console.log(JSON.stringify(cfg));
}

buche({
    command: 'plugin',
    name: `${__dirname}/../lib/index.js`,
});


// buche({
//     parent: "/",
//     children: '<cytoscape-graph width="1000px" address="graph"></cytoscape-graph>'
// })


buche({
    parent: "/",
    tag: 'cytoscape-graph',
    attributes: {
        address: 'graph',
        width: '1000px',
        height: '1000px',
    }
    // children: '<cytoscape-graph width="1000px" address="graph"></cytoscape-graph>'
})


buche({
    parent: "/graph",
    command: "configure",
    style: `${__dirname}/graph-style.css`,
    tooltipTheme: 'banana',
    layout: {
        name: "cola"
    }
})

let connList = process.argv.slice(2);
if (connList.length == 0) {
    connList = 'AB BC CA AD DE'.split(' ');
}

let connections = connList.map(pair => pair.split(''));

for (let [from, to] of connections) {
    buche({
        command: 'element',
        parent: '/graph',
        data: {
            source: from,
            target: to
        }
    });
}
