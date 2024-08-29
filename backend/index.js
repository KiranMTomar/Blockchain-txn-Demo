require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const abi = require('./abi.json');

const app = express();
app.use(express.json());

const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);


const contract = new ethers.Contract(contractAddress, abi, wallet);

app.post('/deposit', async (req, res) => {
    const { depositOption, amount } = req.body;

    if (typeof depositOption !== 'number' || !amount) {
        return res.status(400).json({ error: 'Invalid request parameters' });
    }

    try {
        let tx;
        if (depositOption === 0) {
            tx = await contract.deposit(depositOption, 0, {
                value: ethers.utils.parseEther(amount.toString()),
            });
        } else {
            tx = await contract.deposit(depositOption, ethers.utils.parseUnits(amount.toString(), 18));
        }

        await tx.wait(); 
        res.status(200).json({ success: true, txHash: tx.hash });
    } catch (error) {
        console.error('Deposit failed:', error);
        res.status(500).json({ error: 'Deposit failed', details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
