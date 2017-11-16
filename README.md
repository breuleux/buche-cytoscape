
# buche-cytoscape

Buche plugin for the [cytoscape](http://js.cytoscape.org) graph library.

Provides the `cytoscape-graph` component and the `cytoscape` channel type.


## Use

First you must output the following `buche` command:

```json
{"command":"require","path":"/","pluginName":"cytoscape"}
```

Buche will prompt you to install the plugin if it is not available, although you can install it manually with `buche --install cytoscape`.


## `cytoscape` channel

The `cytoscape` channel lets you define a graph and add nodes and edges in real time.


### Create the channel

```json
{"command":"open","path":"/graph","type":"cytoscape","options":{"style":"<style or path>","layout":{"name":"cola"}, ...}}
```

For the possible `options`, see: http://js.cytoscape.org/#core/initialisation

The style can be given as a string, as a path to a css file, or as a JSON structure as described in cytoscape's documentation. See: http://js.cytoscape.org/#style

Then you can use the `element` command to add nodes and edges. There is a simple and basic way to do it, and a more full-featured one.

### Add a node

This create a node with id `A`:

```json
{"command":"element","path":"/graph","id":"A"}
```

### Add an edge

This creates an edge between nodes `A` and `B`, but note that both must exist before the edge can be defined.

```json
{"command":"element","path":"/graph","source":"A","target":"B"}
```

### Full featured

You can give an `options` object with more customization. Available options: http://js.cytoscape.org/#notation/elements-json

```json
{"command":"element","path":"/graph",{"options": {"data": {"source":"A","target":"B"}},"classes":"abc"}}
```

## `cytoscape-graph` component

Defines a self-contained graph in a single tag.

Children of the `cytoscape-graph` tag must be:

* `<style>...</style>`, a the style for the graph. See: http://js.cytoscape.org/#style
* `<config>...</config>` contains the options. See: http://js.cytoscape.org/#core/initialisation
* `<element>...</element>` defines a graph element. See:    http://js.cytoscape.org/#notation/elements-json

```html
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
```


