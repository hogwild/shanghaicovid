import React from "react";

export function Dropdown (props) {
    const { options, id, selectedValue, onSelectedValueChange } = props;
    return <div id={id}>
        <select  defaultValue={selectedValue} 
            onChange={event => {onSelectedValueChange(event.target.value)}}>
            {options.map( ({value, label}) => {
                return <option key={label} value={value} >
                    {label}
                </option>
            })}
        </select>
    </div>
}