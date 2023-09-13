import React, { useState, useEffect } from 'react';
import './Home.css';
import IndexedDB from './idb';

// Initialize an IndexedDB instance for managing expenses
export const idb = new IndexedDB('costsdb');

const Home = () => {
    // Set the document title to 'Cost Manager' when the component mounts
    useEffect(() => {
        document.title = 'Cost Manager';
    }, []);

    // Initialize state variables for expense data and form inputs
    const [date, setDate] = useState('');
    const [item, setItem] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Food');
    const [description, setDescription] = useState('');
    const [inputs, setInputs] = useState([]);
    const [error, setError] = useState('');

    // Fetch expenses from IndexedDB when the component mounts
    useEffect(() => {
        idb.getCost().then((expensesFromDB) => {
            setInputs(expensesFromDB);
        });
    }, []);

    // Get the current date and format it as a string
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    const handleAddExpense = async () => {
        if (!date || !item || !price) {
            alert("Please enter all fields.");
            return;
        }
        setError('');

        // Create a new expense object
        const newExpense = {
            id: generateUniqueId(), // Generate a unique integer id
            date,
            item,
            price,
            category,
            description,
        };

        // Add the new expense to IndexedDB
        await idb.addCost(newExpense);
        const updatedInputs = [...inputs, newExpense];
        setInputs(updatedInputs);

        // Clear form inputs after adding an expense
        setDate('');
        setItem('');
        setPrice('');
        setCategory('food');
        setDescription('');
        alert("Cost added successfully");
    };

    // Generate a unique id based on the current timestamp
    const generateUniqueId = () => {
        // Generate a unique integer id
        return Date.now();
    };

    return (
        <div className="Home">
            <h1>Add your expense here</h1>
            <div className="form-container">
                <div className="inputGroup">
                    <label>Category:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Food">Food</option>
                        <option value="Education">Education</option>
                        <option value="Housing">Housing</option>
                        <option value="Health">Health</option>
                        <option value="Travel">Travel</option>
                        <option value="Personal spending">Personal spending</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="inputGroup">
                    <label>Item: </label>
                    <input type="text" value={item} onChange={(e) => setItem(e.target.value)} />
                </div>
                <div className="inputGroup">
                    <label>Price: </label>
                    <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="inputGroup">
                    <label htmlFor="name">Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        autoComplete={'off'}
                        max={todayStr}
                    />
                </div>
                <div className="inputGroup">
                    <label>Description: </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                    ></textarea>
                </div>
                <div className="submit-cost">
                    <button className={"add-cost"} id="plus" onClick={handleAddExpense}>
                        Add cost
                    </button>
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Category</th>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                {inputs.map((input) => (
                    <tr key={input.id}>
                        <td>{input.category}</td>
                        <td>{input.item}</td>
                        <td>{input.price}</td>
                        <td>{input.date}</td>
                        <td>{input.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Home;

