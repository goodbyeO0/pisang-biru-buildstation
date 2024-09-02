"use client";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, Idl, Program, setProvider, web3 } from "@coral-xyz/anchor";
import idl from "../../target/idl/tutor_management_program.json"; // Update with your IDL file
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";

function ViewTutorInfo() {
    const [program, setProgram] = useState<Program<Idl> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tutorInfo, setTutorInfo] = useState<any | null>(null);
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
        setTutorInfo(null);

        // Derive the PDA for the tutor info account
        const [tutorInfoPda] = await PublicKey.findProgramAddress(
            [Buffer.from(tutorId), wallet.publicKey.toBuffer()],
            program.programId
        );

        try {
            // Fetch the tutor info account from the blockchain
            const account = await program.account.tutorInfo.fetch(tutorInfoPda);
            setTutorInfo(account);
        } catch (error: any) {
            setError("Error fetching tutor info: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">View Tutor Info</h1>
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
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    {loading ? "Fetching..." : "Fetch Tutor Info"}
                </button>
            </form>
            {loading && <p className="text-center mt-4">Fetching tutor info...</p>}
            {error && <p className="text-center mt-4 text-red-500">{error}</p>}
            {tutorInfo && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold">Tutor Info</h2>
                    <p><strong>ID:</strong> {tutorInfo.tutorId}</p>
                    <p><strong>Name:</strong> {tutorInfo.name}</p>
                    <p><strong>Subject Specialization:</strong> {tutorInfo.subjectSpecialization.join(", ")}</p>
                    <p><strong>Hourly Rate:</strong> {tutorInfo.hourlyRate.toNumber()}</p>
                    <p><strong>Experience Years:</strong> {tutorInfo.experienceYears}</p>
                    <p><strong>Rating:</strong> {tutorInfo.rating}</p>
                    <p><strong>Phone Number:</strong> {tutorInfo.phoneNumber}</p>
                    <p><strong>Email:</strong> {tutorInfo.email}</p>
                    <p><strong>Profile Link:</strong> <a href={tutorInfo.profileLink} target="_blank" rel="noopener noreferrer">{tutorInfo.profileLink}</a></p>
                </div>
            )}
        </div>
    );
}

export default ViewTutorInfo;