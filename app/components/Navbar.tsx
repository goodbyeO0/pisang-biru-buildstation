"use client";
import { useEffect, useMemo, useState, ReactNode } from "react";
import { NextPage } from "next";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import {
    WalletModalProvider,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import * as web3 from "@solana/web3.js";
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter
} from "@solana/wallet-adapter-wallets";
import WalletBalance from "./WalletBalance"; // Import WalletBalance component

interface NavbarProps {
    children: ReactNode;
}

const Navbar: NextPage<NavbarProps> = ({ children }) => {
    const [isMounted, setIsMounted] = useState(false);
    const endpoint = web3.clusterApiUrl("devnet");
    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter()
    ], []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null; // or a loading spinner
    }

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center shadow-lg">
                        <div className="text-white text-2xl font-bold">
                            My DApp
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-white rounded-lg p-4 shadow-md flex items-center space-x-4">
                                <WalletBalance />
                                <WalletMultiButton className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out" />
                            </div>
                        </div>
                    </nav>
                    <main className="p-4 bg-gray-100 min-h-screen">
                        {children}
                    </main>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default Navbar;
