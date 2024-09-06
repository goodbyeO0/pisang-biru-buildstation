"use client";
import { useEffect, useState, ReactNode } from "react";
import { NextPage } from "next";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import WalletBalance from "./WalletBalance"; // Import WalletBalance component

interface NavbarProps {
    children?: ReactNode;
}

const Navbar: NextPage<NavbarProps> = ({ children }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null; // or a loading spinner
    }

    return (
        <nav className="p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center space-x-4 text-2xl font-bold text-black">
                <h1>EASYPAY</h1>
                <a href="http://localhost:3000/viewTransactionData" className="text-slate-700 no-underline text-sm pl-20">
                    View Transaction
                </a>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="bg-white rounded-lg p-4 shadow-md flex items-center space-x-4">
                    <WalletBalance />
                    <WalletMultiButton className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;