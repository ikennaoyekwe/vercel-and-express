import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Input } from "@mui/material";

export default function TodoList() {

    const [todos, setTodos] = useState([{ title: "", description: "", date: "", error:{title: false, description: false, date: false} }]);

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newTodos = [...todos];
        newTodos[index][name] = value;
        setTodos(newTodos);
    };

    const handleAddRow = () => {
        setTodos([...todos, { title: "", description: "", date: "", error: {title: false, description: false, date: false} }]);
    };

    const handleDelete = (index) => {
        setTodos(todos.filter((item, i) => i !== index));
    }

    const checkRow = (e, index, item) => {
        const newTodos = [...todos];
        todos[index].title === "" ? newTodos[index].error.title = true : newTodos[index].error.title = false;
        todos[index].description === "" ? newTodos[index].error.description = true : newTodos[index].error.description = false;
        todos[index].date === "" ? newTodos[index].error.date = true : newTodos[index].error.date = false;
        setTodos(newTodos);
    }

    return (
        <div className="flex justify-center items-center h-screen w-full">
            <div className="flex flex-col gap-4 max-w-xl justify-center items-center p-6 rounded-lg shadow-xl">

                {todos.map((item, index) => (
                    <InputRows key={index} index={index} item={item} checkRow={checkRow} handleDelete={handleDelete} handleChange={handleChange}/>
                ))}

                <div className="flex max-w-xl self-end mt-4">
                    <Button variant="contained" onClick={handleAddRow}>
                        Add Task
                    </Button>
                </div>

                <pre className="mt-4 p-2 rounded text-xs">
                    {JSON.stringify(todos, null, 2)}
                </pre>
            </div>
        </div>
    );
}

const InputRows = ({ handleChange, handleDelete, checkRow, index, item }) => (
    <div className="flex gap-2 mb-2">
        <Input type="text" name="title" value={item.title} onChange={(e) => handleChange(index, e)} placeholder="Task" className={item.error.title ? 'border-2 border-red-500' : ''}/>
        <Input type="text" name="description" value={item.description} onChange={(e) => handleChange(index, e)} placeholder="Description" className={item.error.description ? 'border-2 border-red-500' : ''}/>
        <Input type="date" name="date" value={item.date} onChange={(e) => handleChange(index, e)} className={item.error.date ? 'border-2 border-red-500' : ''} placeholder="Date"/>
        <Button variant="contained" color="error" onClick={() => handleDelete(index)}>Delete</Button>
        <Button variant="contained" color="success" onClick={(e) => checkRow(e, index, item)}>Check</Button>
    </div>
);