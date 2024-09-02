"use client";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, Idl, Program, setProvider, web3 } from "@coral-xyz/anchor";
import idl from "../../idl/tutor_management_program.json"; // Update with your IDL file
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";

function AddTutorInfo() {
    const [program, setProgram] = useState<Program<Idl> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const [formData, setFormData] = useState({
        tutorId: "",
        name: "",
        subjectSpecialization: "",
        hourlyRate: "",
        experienceYears: "",
        rating: "",
        phoneNumber: "",
        email: "",
        profileLink: "",
    });

    useEffect(() => {
        if (wallet) {
            const provider = new AnchorProvider(connection, wallet, {});
            setProvider(provider);

            const program = new Program(idl as Idl);
            setProgram(program);
        }
    }, [wallet, connection]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!program || !wallet) {
            console.error("Program or wallet is not initialized");
            return;
        }

        setLoading(true);
        setError(null);
        setTransactionSignature(null);

        const tutorInfoAccount = web3.Keypair.generate();

        try {
            const sig = await program.methods
                .addTutorInfo(
                    formData.tutorId,
                    formData.name,
                    formData.subjectSpecialization.split(","),
                    parseInt(formData.hourlyRate),
                    parseInt(formData.experienceYears),
                    parseInt(formData.rating),
                    formData.phoneNumber,
                    formData.email,
                    formData.profileLink
                )
                .accounts({
                    tutorInfo: tutorInfoAccount.publicKey,
                    admin: wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                })
                .signers([tutorInfoAccount])
                .rpc();

            setTransactionSignature(sig);
        } catch (error: any) {
            setError("Error adding tutor info: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Add Tutor Info</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="tutorId"
                    placeholder="Tutor ID"
                    value={formData.tutorId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="text"
                    name="subjectSpecialization"
                    placeholder="Subject Specialization (comma separated)"
                    value={formData.subjectSpecialization}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="number"
                    name="hourlyRate"
                    placeholder="Hourly Rate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="number"
                    name="experienceYears"
                    placeholder="Experience Years"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="number"
                    name="rating"
                    placeholder="Rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="text"
                    name="profileLink"
                    placeholder="Profile Link"
                    value={formData.profileLink}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
            {loading && <p className="text-center mt-4">Transaction is processing...</p>}
            {error && <p className="text-center mt-4 text-red-500">{error}</p>}
            {transactionSignature && (
                <p className="text-center mt-4">
                    Transaction successful! View it on{" "}
                    <a
                        href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        Solana Explorer
                    </a>.
                </p>
            )}
        </div>
    );
}

export default AddTutorInfo;