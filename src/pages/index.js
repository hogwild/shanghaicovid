import React from "react";
import { Treemap } from "../components/treemap";
import { Dropdown } from "../components/dropdown";
import { Tooltip } from "../components/tooltip";
import { csv, timeParse } from "d3";

const csvUrl ="https://gist.githubusercontent.com/hogwild/974e35dfe244a0809d68d901cd870a68/raw/81ab820643a697813c29989cf05557cde79d5fe8/Covid-19%2520Shanghai.csv";

function useData(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        csv(csvPath).then(data => {
            // const parseTime = timeParse('%m/%d/%y')
            // console.log(parseTime("04/05/2022"));
            data.forEach(d => {
                // d.date = d["Date"];
                d.symptomatic = +d.symptomatic;
                d.asymptomatic = +d.asymptomatic;
                // d.infections = {"symptomtatic": d.symptomtatic, "asymptomtatic": d.asymptomtatic};
            });
            setData(data);
        });
    }, []);
    return dataAll;
}

function CovidShanghai() {
    const WIDTH = 1200;
    const HEIGHT = 600;
    const margin = {left: 50, right: 50, top: 50, bottom: 50};
    const width = WIDTH - margin.left - margin.right;
    const height =  HEIGHT -margin.top - margin.bottom;
    const [firstAttr, setFirstAttr] = React.useState("date");
    const [secondAttr, setSecondAttr] = React.useState("null");
    const [thirdAttr, setThirdAttr] = React.useState("null");
    const [tooltipX, setTooltipX] = React.useState(null);
    const [tooltipY, setTooltipY] = React.useState(null);
    const [selectedNode, setSelectedNode] = React.useState(null);

    const rawData = useData(csvUrl);
    if(!rawData){
        return <p>
            "Loading..."
        </p>
    }
    // console.log(rawData);
    const attributes = [ firstAttr, secondAttr, thirdAttr ].filter( d => d !== "null");
    const options = [{value: "null", label: "None"},{value: "zone", label: "Region"}, 
        {value: "district", label: "District"}, {value: "date", label: "Date"}];
    return <div>
        <h1 style={{fontFamily:"verdana"}}>Shanghai Covid 19 Dataset: 5th - 9th, April</h1>
        <Dropdown options={options} id={"selector1"} selectedValue={firstAttr} onSelectedValueChange={setFirstAttr}/>
        <Dropdown options={options} id={"selector2"} selectedValue={secondAttr} onSelectedValueChange={setSecondAttr}/>
        <Dropdown options={options} id={"selector3"} selectedValue={thirdAttr} onSelectedValueChange={setThirdAttr}/>
        <svg width={WIDTH} height={HEIGHT}>
            <Treemap width={width} height={height} data={rawData} attributes={attributes} selectedNode={selectedNode}
                setSelectedNode={setSelectedNode} setTooltipX={setTooltipX} setTooltipY={setTooltipY}/>
        </svg>
        <Tooltip d={selectedNode} left={tooltipX} top={tooltipY}/>
    </div>
}

export default CovidShanghai;

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <React.StrictMode>
//         <CovidShanghai/>   
//     </React.StrictMode>
// )
// ReactDOM.render( <CovidShanghai/>, document.getElementById('root'));