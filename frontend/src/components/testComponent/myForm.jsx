import React, {useState} from "react";
import {Input} from "@mui/material";
import Button from "@mui/material/Button";

export default function MyForm(){

    const [rows, setRows] = useState([{name: "", family: "", number: "", error: {name: false, family:false, number:false}}]);

    const handleChange = (e, index) => {
        const newRows = [...rows];
        newRows[index][e.target.name] = e.target.value;
        setRows(newRows);
    }

    const addRow = () => {
        setRows([...rows,{name:"",family:"",number:"", error: {name: "", family:"", number:""}}]);
    }

    const deleteRow = (itemIndex) => {
        setRows(rows.filter((row,index) => index !== itemIndex));
    }

    const handleCheck = (index) => {
        console.log(rows[index]["name"]);
        const newRows = [...rows];
        newRows[index]["name"] === "" ? newRows[index]["error"]["name"] = true : newRows[index]["error"]["name"] = false;
        newRows[index]["family"] === "" ? newRows[index]["error"]["family"] = true : newRows[index]["error"]["family"] = false;
        newRows[index]["number"] === "" ? newRows[index]["error"]["number"] = true : newRows[index]["error"]["number"] = false;
        setRows(newRows);
    }

    return (
        <div>
            {
                rows.map((item, index)=>{
                    return (
                        <InputRow key={index} item={item} index={index} handleCheck={handleCheck} handleChange={handleChange} deleteRow={deleteRow} />
                    );
                })
            }
            <Button variant="contained" color="approve" onClick={addRow}>Add Row</Button>
        </div>
    )

}

export const InputRow = ({item, index, handleChange, deleteRow, handleCheck }) => (
    <div className="flex">
        <Input type="text" variant="standard" name="name" value={item.name} onChange={(e)=>handleChange(e, index)} className={"m-1 " + (item.error.name ? "border border-red-500" : "")} />
        <Input type="text" variant="standard" name="family" value={item.family} className={"m-1 " + (item.error.family ? "border border-red-500" : "")} onChange={(e,)=>handleChange(e, index)}/>
        <Input type="text" variant="standard" name="number" value={item.number} className={"m-1 " + (item.error.number ? "border border-red-500" : "")} onChange={(e)=>handleChange(e, index)}/>
        <Button variant="contained" color="success" onClick={() => handleCheck(index)}>Go</Button>
        <Button variant="contained" color="error" onClick={()=>deleteRow(index)}>Delete</Button>
    </div>
)