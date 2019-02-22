#!/usr/bin/env buche --inspect python

import os, sys, json

here = os.path.dirname(os.path.realpath(__file__))

def buche(**cfg):
    print(json.dumps(cfg))

buche(
    command='plugin',
    name=os.path.join(here, '../lib/index.js'),
)

buche(
    parent="/",
    tag='cytoscape-graph',
    attributes={
        'address': 'graph',
        'width': '1000px',
        'height': '1000px',
    }
)

buche(
    parent='/graph',
    command='configure',
    style=os.path.join(here, 'graph-style.css'),
    layout={'name': 'cola'}
)

conn_list = sys.argv[2:]
if not conn_list:
    conn_list = 'AB BC CA AD DE'.split(' ');

for (a, b) in conn_list:
    buche(
        command='element',
        parent='/graph',
        data={
            'source': a,
            'target': b
        }
    )
