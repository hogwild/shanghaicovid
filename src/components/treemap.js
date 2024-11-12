import React from "react";
import { treemap, hierarchy, treemapSquarify, treemapBinary, treemapSliceDice, scaleOrdinal, schemeDark2 } from "d3";
import { buildTree } from "./util";

export function Treemap(props) {

    const { width, height, data, attributes, selectedNode, setSelectedNode, setTooltipX, setTooltipY } = props;
    // console.log(data.map(d => d.Symptomtatic + d.Asymptomtatic).reduce((sum, d) => sum+d, 0));
    // console.log(groups(data, d => d.date));
    let root = {name: "Infections", children: buildTree(data, attributes),
            infections: data.map(d => d.symptomtatic + d.asymptomtatic).reduce((sum, d) => sum+d, 0)};
    root = hierarchy(root)
        .sum(d => {
            // console.log(d.children ? 0 : d.value);
            return d.children ? 0 : d.infections;
        });

    const tree = treemap().tile(treemapSquarify).size([width, height]).padding(2)
    .round(true)(root).sort((a, b) => b.infections - a.infections);
    
    // console.log(tree);
    const parents = tree.leaves().map( d => d.parent.data.name);
    const parentsCategories = parents.filter( (d, idx) => parents.indexOf(d) === idx );
    const color = (node) => { 
        // console.log(node);
        let colormap = scaleOrdinal(schemeDark2).domain(parentsCategories);
        return selectedNode && node.x0 === selectedNode.x0 && node.y0 === selectedNode.y0 ? "red": colormap(node.parent.data.name);
    };
    const mouseOver = (d) => {
        setSelectedNode(d);
        setTooltipX(d.x1+ 20);
        setTooltipY(d.y0 + 100);
    }

    const mouseOut = () => {
        setSelectedNode(null);
        setTooltipX(null);
        setTooltipY(null);
    }
    const firstLayer = tree.descendants()[0].children;
    const fontSize = (d) => Math.round((d.x1-d.x0)*0.1) + "px";
    return <g>
        {tree.leaves().map( (d, idx) => {
            {/* console.log(d); */}
            return <g key={idx+"treemap"} transform={`translate(${d.x0}, ${d.y0})`} 
                    onMouseOver={() => mouseOver(d)} onMouseOut={mouseOut}>
                <rect width={d.x1-d.x0} height={d.y1-d.y0} stroke={"none"} 
                    fill={color(d)} opacity={0.8}/>
                <TreeMapText d={d} />
            </g>
        })}
        {firstLayer.map( (d, idx) => {
            return <g key={idx+"outerline"} transform={`translate(${d.x0}, ${d.y0})`}>
                <rect width={d.x1-d.x0} height={d.y1-d.y0} stroke={"black"} fill={"none"}/>
                <text style={{fontSize:"2em"}} x={ (d.x1-d.x0)/2 } y={ (d.y1-d.y0)/2 } textAnchor={"middle"} opacity={0.3} 
                transform={`rotate(${(d.x1-d.x0)>(d.y1-d.y0)? 0: 90}, ${(d.x1-d.x0)/2}, ${(d.y1-d.y0)/2})`}>
                    {d.data.name}
                    </text>
            </g>
        })}
    </g>
}

function TreeMapText(props) {
    const { d } = props;
    // console.log(d);
    const divStyle = {
        position: "absolute",
        textAlign: "left",
        width: "120px",
        height: "120px",
        font: "12px sans-serif",
        border: "0px",
        opacity: "0.5"
    };
    return <foreignObject width={d.x1-d.x0} height={d.y1-d.y0}>
        <div style={divStyle}>
            <p>{d.data.name}</p>
        </div>
        </foreignObject>
}