
let cytoscape = require('cytoscape');
let dagre = require('cytoscape-dagre');
let cola = require('cytoscape-cola');
let {existsSync, readFileSync} = require('fs');


cytoscape.use(dagre);
cytoscape.use(cola);


function setup(container, options) {
    options.container = container;
    if (typeof(options.style) === 'string' && existsSync(options.style)) {
        options.style = readFileSync(options.style, 'utf8');
    }
    if (!options.layout) {
        options.layout = {name: "cola"};
    }
    let cy = cytoscape(options);
    // Cytoscape will fail to properly paint canvas inside panes that
    // have display:none. Thankfully, Buche's tabs emit the 'display'
    // event on panes when they are activated, so we just go up the whole
    // hierarchy and set event listeners for 'display'. When triggered,
    // we repaint using cy.resize(). Seems to work well enough.
    let parent = container;
    while (parent) {
        parent.addEventListener('display', e => cy.resize())
        parent = parent.parentNode || parent.host;
    }
    return cy;
}


class CytoscapeChannel extends Buche.Channel {
    setup() {
        this.config = Object.assign({}, this.options.options || {});
        this.cy = setup(this.element, this.config);
        this.nodes = {};
    }

    makeElement() {
        let d = document.createElement('div');
        d.classList.add('cytoscape-channel');
        d.style.width = "100%";
        d.style.height = "100%";
        return d;
    }

    dispatch_element(message) {
        let elem = message.options || {};
        for (let field of ['data']) {
            if (message[field]) {
                elem[field] = message[field];
            }
        }
        elem.data = elem.data || {};
        for (let field of ['source', 'target', 'id']) {
            if (message[field]) {
                elem.data[field] = message[field];
            }
        }
        let src = elem.data.source;
        let targ = elem.data.target;
        if (src && targ) {
            if (!this.nodes[src]) {
                this.cy.add({data: {id: src}});
                this.nodes[src] = true;
            }
            if (!this.nodes[targ]) {
                this.cy.add({data: {id: targ}});
                this.nodes[targ] = true;
            }
        }
        else {
            this.nodes[elem.data.id] = true;
        }
        this.cy.add(elem);
        this.cy.resize();
        this.cy.layout(this.config.layout).run();
    }
}


class CytoscapeElement extends Buche.BucheElement {

    setupEnd() {
        this.cy = setup(this, this.options);
    }

    template(children) {

        this.style.position = "relative";

        let options = {
            container: this,
            boxSelectionEnabled: true,
            autounselectify: false,
            elements: [],
            style: "",
            layout: {name: this.getAttribute('layout') || 'cose'}
        };

        for (let child of children) {
            let tag = child.tagName;
            let d = null;
            switch (tag) {
            case 'STYLE':
                options.style += child.textContent;
                break;
            case 'OPTIONS':
            case 'CONFIG':
                d = JSON.parse(child.textContent);
                options = Object.assign(options, d);
                break;
            case 'ELEMENT':
                d = JSON.parse(child.textContent);
                options.elements.push(d);
                break;
            }
        }

        this.options = options;

        return [];
    }

    addItem(item) {
        this.cy.add(item);
    }

    css() {
        return {
            "cytoscape-graph": {
                position: "relative",
                display: "block",
                border: "1px solid green",
                width: "500px",
                height: "500px"
            }
        }
    }
}


module.exports = {
    isBuchePlugin: true,
    channels: {
        'cytoscape': CytoscapeChannel
    },
    components: {
        'cytoscape-graph': CytoscapeElement
    }
}
