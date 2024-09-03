"use client"
import React, { useEffect, useState } from 'react';

type Transaction = {
    transaction: string;
    to: string;
    from: string;
    amount: number;
    contactInfo: string;
};

const Page: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('/api/actions/transaction-data');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setTransactions(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 7)}...${address.slice(-7)}`;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-center mb-6 text-purple-600">Transactions</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <tr>
                            <th className="px-4 py-2 border-b text-center">Transaction Hash</th>
                            <th className="px-4 py-2 border-b text-center">To</th>
                            <th className="px-4 py-2 border-b text-center">From</th>
                            <th className="px-4 py-2 border-b text-center">Amount (SOL)</th>
                            <th className="px-4 py-2 border-b text-center">Contact Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b text-center">{shortenAddress(transaction.transaction)}</td>
                                <td className="px-4 py-2 border-b text-center">{shortenAddress(transaction.to)}</td>
                                <td className="px-4 py-2 border-b text-center">{shortenAddress(transaction.from)}</td>
                                <td className="px-4 py-2 border-b text-center">{transaction.amount}</td>
                                <td className="px-4 py-2 border-b text-center">{transaction.contactInfo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Page;