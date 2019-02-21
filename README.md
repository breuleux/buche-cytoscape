
# buche-cytoscape

Buche plugin for the [cytoscape](http://js.cytoscape.org) graph library.

Provides the `cytoscape-graph` component.


## Use

First you must output the following `buche` command:

```json
{"command":"plugin","name":"cytoscape"}
```

Buche will prompt you to install the plugin if it is not available, although you can install it manually with `buche --install cytoscape`.


## `<cytoscape-graph>` component

The component is instantiated in HTML as follows:

```html
<cytoscape-graph width="1000px" height="500px">
    <script type="buche/configure">
    {
        "style": "<style or path to style>",
        "layout": {"name": "cola"},
        "elements": [
            {"data": {"id": "A"},
            {"data": {"id": "B"},
            {"data": {"id": "C"},
            {"data": {"source": "A", "target": "C"}},
            {"data": {"source": "B", "target": "A"}},
            {"data": {"source": "C", "target": "B"}}
        ]
    }
    </script>
</cytoscape-graph>`
```

* [Configuration options](http://js.cytoscape.org/#getting-started/specifying-basic-options)
* [Element options](http://js.cytoscape.org/#notation/elements-json)
* [Styling nodes and edges](http://js.cytoscape.org/#style)


### `configure` command

If this is more convenient to you, you can leave out the configuration in `<cytoscape-graph>`, and use a separate command to configure it. For example (using node.js):

```javascript
function buche(cfg) {
    console.log(JSON.stringify(cfg));
}

buche({
    parent: "/",
    tag: 'cytoscape-graph',
    attributes: {
        address: 'graph',
        width: '1000px',
        height: '1000px',
    }
})

buche({
    parent: "/graph",
    command: "configure",
    style: `${__dirname}/graph-style.css`,
    layout: {name: "cola"},
    elements: [
        {"data": {"id": "A"},
        {"data": {"id": "B"},
        {"data": {"id": "C"},
        {"data": {"source": "A", "target": "C"}},
        {"data": {"source": "B", "target": "A"}},
        {"data": {"source": "C", "target": "B"}}
    ]
})
```

The `<cytoscape-graph>` must have an `address` attribute in order for this to work, and the command must be directed to that address (see `parent` above).


### `element` command

Nodes and edges can be added incrementally using the `element` command. For example, to add node `D` and edge `A-D`:

```javascript
buche({
    parent: '/graph',
    command: 'element',
    data: {
        id: "D"
    }
});

buche({
    parent: '/graph',
    command: 'element',
    data: {
        source: "A",
        target: "D"
    }
});
```

It is allowed to omit the declaration of the nodes, since they will be created automatically if edges refer to them. You will need to declare the nodes, however, if you want to give them labels that differ from their id, or tooltips, or custom styles.

Documentation for element creation is [here](http://js.cytoscape.org/#notation/elements-json).


### Tooltips

Tooltips can be easily associated to any node or edge by setting the element's `data.tooltip` to some arbitrary HTML expression. See `examples/features.js`.
