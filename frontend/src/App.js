import React, { useState } from 'react';
import axios from 'axios'; 

const App = () => {
    const [depositOption, setDepositOption] = useState(0); // 0 for ETH, 1 for ERC20
    const [amount, setAmount] = useState('');
    const [response, setResponse] = useState('');

    const handleDeposit = async () => {
        try {
            const data = {
                depositOption: depositOption,
                amount: amount,
            };

            const res = await axios.post('http://localhost:5000/deposit', data);
            setResponse(`Success! Transaction Hash: ${res.data.txHash}`);

           
        } catch (error) {
            console.error('Error making deposit:', error);
            setResponse(`Error: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div>
            <h2>Deposit to TransferToken Contract</h2>
            <div>
                <label>Deposit Option:</label>
                <select
                    value={depositOption}
                    onChange={(e) => setDepositOption(Number(e.target.value))}
                >
                    <option value={0}>ETH</option>
                    <option value={1}>USDT</option>
                </select>
            </div>
            <div>
                <label>Amount:</label>
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                />
            </div>
            <button onClick={handleDeposit}>Deposit</button>
            {response && <p>{response}</p>}
        </div>
    );
};

export default App;
