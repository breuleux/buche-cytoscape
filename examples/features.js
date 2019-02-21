#!/usr/bin/env buche --inspect node

function buche(cfg) {
    console.log(JSON.stringify(cfg));
}

buche({
    command: 'plugin',
    name: `${__dirname}/../lib/index.js`,
});


// You can add generic custom styling this way, e.g. to style the tooltips
buche({
    command: 'resource',
    content: `<link type="text/css"
                    rel="stylesheet"
                    href="${__dirname}/style.css"/>`,
});


buche({
    parent: "/",
    content: "<h2>Graph 1</h2><p>Click on nodes and arrows.</p>",
});


// You can make a graph in a single command as follows. There should be a
// single script tag containing the JSON configuration. It is important
// that the script type is "buche/configure", and the contents valid JSON.

// The available configuration options are documented here:
// http://js.cytoscape.org/#getting-started/specifying-basic-options
// plus tooltipTheme and the tooltip field in data.

buche({
    parent: "/",
    content:`
    <cytoscape-graph width="1000px" height="500px">
        <script type="buche/configure">
        {
            "style": "${__dirname}/graph-style.css",
            "layout": {"name": "cola"},
            "tooltipTheme": "blueberry",
            "elements": [
                {"data": {"id": "A", "label": "👊", "tooltip": "Rock"},
                 "classes": "labeled"},
                {"data": {"id": "B", "label": "✋", "tooltip": "Paper"},
                 "classes": "labeled"},
                {"data": {"id": "C", "label": "✌", "tooltip": "Scissors"},
                 "classes": "labeled"},
                {"data": {"source": "A", "target": "C",
                          "tooltip": "<b>Rock</b> beats <b>Scissors</b>"}},
                {"data": {"source": "B", "target": "A",
                          "tooltip": "<b>Paper</b> beats <b>Rock</b>"}},
                {"data": {"source": "C", "target": "B",
                          "tooltip": "<b>Scissors</b> beats <b>Paper</b>"}}
            ]
        }
        </script>
    </cytoscape-graph>`
});


buche({
    parent: "/",
    content: "<h2>Graph 2</h2>",
});


// You can use JSON instead of <cytoscape-graph>. Notice the address attribute.
buche({
    parent: "/",
    tag: 'cytoscape-graph',
    attributes: {
        address: 'graph',
        width: '1000px',
        height: '500px',
    }
});


// To configure using a different command, it is necessary to use the address
// of the graph we want to configure.
buche({
    parent: "/graph",
    command: "configure",
    style: `${__dirname}/graph-style.css`,
});


function gen() {
    return String(Math.floor(Math.random() * 100));
}


// Edges can be added incrementally. Source/target must refer to node ids.
// If no node exists with a given id, it will be created automatically.
for (let i = 0; i < 100; i++) {
    buche({
        parent: '/graph',
        command: 'element',
        data: {
            source: gen(),
            target: gen()
        }
    });
}
