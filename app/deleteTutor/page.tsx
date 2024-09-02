"use client";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, Idl, Program, setProvider, web3 } from "@coral-xyz/anchor";
import idl from "../../target/idl/tutor_management_program.json"; // Update with your IDL file
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { TutorManagementProgram } from "../../target/types/tutor_management_program"; // Import the IDL types

function DeleteTutorInfo() {
    const [program, setProgram] = useState<Program<Idl> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const [tutorId, setTutorId] = useState("");

    useEffect(() => {
        if (wallet) {
            const provider = new AnchorProvider(connection, wallet, {});
            setProvider(provider);

            const program = new Program(idl as Idl);
            setProgram(program);
        }
    }, [wallet, connection]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTutorId(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!program || !wallet) {
            console.error("Program or wallet is not initialized");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        // Derive the PDA for the tutor info account
        const [tutorInfoPda] = await PublicKey.findProgramAddress(
            [Buffer.from(tutorId), wallet.publicKey.toBuffer()],
            program.programId
        );

        try {
            // Delete the tutor info account from the blockchain
            const tx = await program.methods
                .deleteTutorInfo(tutorId)
                .accounts({
                    tutorInfo: tutorInfoPda,
                    admin: wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            setSuccess(`Tutor info deleted successfully.`);
        } catch (error: any) {
            setError("Error deleting tutor info: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Delete Tutor Info</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="tutorId"
                    placeholder="Tutor ID"
                    value={tutorId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                >
                    {loading ? "Deleting..." : "Delete Tutor Info"}
                </button>
            </form>
            {loading && <p className="text-center mt-4">Deleting tutor info...</p>}
            {error && <p className="text-center mt-4 text-red-500">{error}</p>}
            {success && (
                <p className="text-center mt-4 text-green-500">
                    {success} <br />
                    <a
                        href={`https://explorer.solana.com/tx/${success.split(": ")[1]}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        View on Solana Explorer
                    </a>
                </p>
            )}
        </div>
    );
}

export default DeleteTutorInfo;