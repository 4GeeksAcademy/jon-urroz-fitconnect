import React from "react";
import Select from "react-select";

const options = [
    { value: "08:00", label: "08:00" },
    { value: "09:00", label: "09:00" },
    { value: "10:00", label: "10:00" },
    { value: "11:00", label: "11:00" },
    { value: "12:00", label: "12:00" },
    { value: "13:00", label: "13:00" },
    { value: "14:00", label: "14:00" },
    { value: "15:00", label: "15:00" },
    { value: "16:00", label: "16:00" },
    { value: "17:00", label: "17:00" },
    { value: "18:00", label: "18:00" }
];

const customStyles = {
    control: (provided) => ({
        ...provided,
        borderColor: "#319795",
        background: "#e6f7f6",
        color: "#319795",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 16,
        boxShadow: "none"
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected || state.isFocused ? "#319795" : "#e6f7f6",
        color: state.isSelected || state.isFocused ? "#fff" : "#319795",
        fontWeight: 600,
        fontSize: 16
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "#319795",
        fontWeight: 700
    })
};

export default function HourSelect({ value, onChange }) {
    return (
        <Select
            options={options}
            value={options.find(opt => opt.value === value)}
            onChange={opt => onChange(opt.value)}
            placeholder="Elige una hora..."
            styles={customStyles}
            isSearchable={false}
            menuPlacement="top"
        />
    );
}
