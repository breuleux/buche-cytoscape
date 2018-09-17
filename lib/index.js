
let cytoscape = require('cytoscape');
let cypopper = require('cytoscape-popper');
let tippy = require('tippy.js');
let dagre = require('cytoscape-dagre');
let cola = require('cytoscape-cola');
let {existsSync, readFileSync} = require('fs');


class CytoscapeGraph extends BucheElement {
    setup(config, children) {
        this.nodes = {};
        this.innerHTML = "&lt;CytoscapeGraph&gt; waiting for configuration.";
        this.style.position = 'relative';
        this.style.display = 'block';
        this.style.width = config.width || "800px";
        this.style.height = config.height || "500px";
        this.style.border = "1px solid black";
    }

    command_configure(_, options) {
        this.innerHTML = "";
        this._container = document.createElement('div');
        this._container.style = "width: 100%; height: 100%";
        this._appendChild(this._container);
        options.container = this._container;
        options.boxSelectionEnabled = true;
        options.autounselectify = false;
        if (typeof(options.style) === 'string' && existsSync(options.style)) {
            options.style = readFileSync(options.style, 'utf8');
        }
        if (!options.layout) {
            options.layout = {name: "cola"};
        }
        this.options = options
        let cy = cytoscape(options);
        global['cy'] = cy

        // Cytoscape will fail to properly paint canvas inside panes that
        // have display:none. Thankfully, Buche's tabs emit the 'display'
        // event on panes when they are activated, so we just go up the whole
        // hierarchy and set event listeners for 'display'. When triggered,
        // we repaint using cy.resize(). Seems to work well enough.
        let parent = this;
        while (parent) {
            parent.addEventListener('display', _ => cy.resize())
            parent = parent.parentNode || parent.host;
        }
        
        cy.elements().each((node) => this.installTooltip(node));
        this.cy = cy
    }

    command_element(_, elem) {
        if (!elem.data) {
            elem.data = {};
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
        let cyelem = this.cy.add(elem);
        this.installTooltip(cyelem);
        this.cy.resize();
        this.cy.layout(this.options.layout).run();
    }

    installTooltip(node) {
        let data = node.data();
        if (data.tooltip) {
            let ref = node.popperRef();
            let content = document.createElement('div');
            content.innerHTML = data.tooltip;
            let tip = tippy(ref, {
                html: content,
                trigger: 'manual',
                arrow: true,
                theme: this.options.tooltipTheme || 'dark',
            }).tooltips[0];
            node.on('tap', (() => {
                setTimeout(() => tip.show(), 0)
            }));
        }
    }
}


function bucheInstall() {
    cytoscape.use(cypopper);
    cytoscape.use(dagre);
    cytoscape.use(cola);
    customElements.define('cytoscape-graph', CytoscapeGraph);
}


module.exports = {
    'bucheInstall': bucheInstall,
}
