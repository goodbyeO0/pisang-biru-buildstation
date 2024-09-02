"use client";
import { useEffect, useState } from "react";
import {
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

const WalletBalance = () => {
    const [balance, setBalance] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!connection || !isMounted) {
            return;
        }

        if (!publicKey) {
            setBalance(0); // Reset balance when wallet is disconnected
            return;
        }

        const subscriptionId = connection.onAccountChange(
            publicKey,
            updatedAccountInfo => {
                setBalance(updatedAccountInfo.lamports / web3.LAMPORTS_PER_SOL);
            },
            { commitment: "confirmed" }
        );

        connection.getAccountInfo(publicKey).then(info => {
            setBalance(info!.lamports / web3.LAMPORTS_PER_SOL);
        });

        return () => {
            connection.removeAccountChangeListener(subscriptionId);
        };
    }, [connection, publicKey, isMounted]);

    if (!isMounted) {
        return null; // or a loading spinner
    }

    return (
        <div className="text-center">
            <p className="text-gray-800 font-semibold">Balance: {balance.toFixed(2)} SOL</p>
        </div>
    );
};

export default WalletBalance;