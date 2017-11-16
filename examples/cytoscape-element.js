
function buche(cfg) {
    console.log(JSON.stringify(cfg));
}

// <style>...</style> is the style for the graph. See:
//    http://js.cytoscape.org/#style
// <config>...</config> contains the options. See:
//    http://js.cytoscape.org/#core/initialisation
// <element>...</element> contains an element. See:
//    http://js.cytoscape.org/#notation/elements-json

elem = `
<cytoscape-graph>
    <style>
        node {
            background-color: blue;
            content: data(id);
        }
        edge {
            line-color: green;
            target-arrow-color: green;
            target-arrow-shape: triangle;
            curve-style: bezier;
        }
    </style>
    <config>
    {
        "layout": {"name": "cose"}
    }
    </config>
    <element>{"data": {"id": "A"}}</element>
    <element>{"data": {"id": "B"}}</element>
    <element>{"data": {"id": "C"}}</element>
    <element>{"data": {"id": "D"}}</element>
    <element>{"data": {"id": "E"}}</element>
    <element>{"data": {"source": "A", "target": "B"}}</element>
    <element>{"data": {"source": "B", "target": "C"}}</element>
    <element>{"data": {"source": "C", "target": "A"}}</element>
    <element>{"data": {"source": "A", "target": "D"}}</element>
    <element>{"data": {"source": "D", "target": "E"}}</element>
</cytoscape-graph>
`

buche({
    command: 'require',
    path: '/',
    pluginPath: '../lib/index.js'
});

buche({
    command: 'log',
    path: '/graph',
    format: 'html',
    content: elem
});
