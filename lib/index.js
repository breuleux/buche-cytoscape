
let cytoscape = require('cytoscape');
let dagre = require('cytoscape-dagre');


cytoscape.use(dagre);


class CytoscapeChannel extends Buche.Channel {
    dispatch_element() {
        
    }
}


class CytoscapeElement extends Buche.BucheElement {

    setupEnd() {
        this.cy = cytoscape(this.options);
        // Cytoscape will fail to properly paint canvas inside panes that
        // have display:none. Thankfully, Buche's tabs emit the 'display'
        // event on panes when they are activated, so we just go up the whole
        // hierarchy and set event listeners for 'display'. When triggered,
        // we repaint using cy.resize(). Seems to work well enough.
        let parent = this.parentNode;
        while (parent) {
            parent.addEventListener('display', e => this.cy.resize())
            parent = parent.parentNode || parent.host;
        }
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
                d = JSON.parse(child.textContent);
                options = Object.assign(options, d);
                break;
            case 'ELEMENT':
                // console.log(child.textContent);
                d = JSON.parse(child.textContent);
                // console.log(d);
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
    components: {
        'cytoscape-graph': CytoscapeElement
    }
}
