import React from "react";


export function Tooltip(props) {
    const {d, left, top} = props;
    //console.log(d);
    if (left === null) {
        return <div></div>;
    } else {
        const divStyle = {
            position: "absolute",
            textAlign: "left",
            width: "180px",
            height: "150px",
            font: "16px verdana",
            background: "orange",
            border: "2px outset black",
            // borderRadius: "8px",
            pointerEvents: "none",
            left: `${left}px`,
            top: `${top}px`
        };
        return <div style={divStyle} >
            <p>{d.ancestors().reverse().slice(1).map((d, idx) => d.data.name)
                .join("\n")+"\ninfected:"+d.data.infections+"\nsymtomtatic:"+d.data.symptomatic+"\nasymtomtatic:"+d.data.asymptomatic}</p>
            </div>
    };  
}