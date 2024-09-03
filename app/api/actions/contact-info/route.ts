import { getToPubkey, getAmount, getContactInfo, getAccount, getMostRecentTransactionHash } from "../transfer-sol/route";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { promises as fs } from 'fs';
import path from 'path';

export const GET = async (req: Request) => {
    const toPubkey = getToPubkey();
    const amount = getAmount();
    const contactInfo = getContactInfo();
    const mostRecentTransactionHash = getMostRecentTransactionHash();
    const account = getAccount();

    console.log(toPubkey.toBase58(), amount, contactInfo, mostRecentTransactionHash);

    // Fetch transactions that happened after the most recent transaction hash
    let latestTransaction = await fetchLatestTransactionAfterHash(toPubkey, mostRecentTransactionHash);

    // Check if the latest transaction matches the most recent transaction hash
    if (latestTransaction === mostRecentTransactionHash) {
        latestTransaction = "waitForConfirmation";
    }

    // If the latest transaction exists and is not "waitForConfirmation", write to a JSON file
    if (latestTransaction && latestTransaction !== "waitForConfirmation" && getMostRecentTransactionHash() != null) {
        const transactionData = {
            transaction: latestTransaction,
            to: toPubkey.toBase58(),
            from: account?.toBase58(),
            amount,
            contactInfo
        };

        // Use an absolute path based on the current working directory
        const filePath = path.resolve(process.cwd(), 'app/api/actions/contact-info/transaction.json');

        // Read the existing transactions from the file
        let transactions = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            transactions = JSON.parse(fileContent);

            // Ensure transactions is an array
            if (!Array.isArray(transactions)) {
                transactions = [];
            }
        } catch (error) {
            if (error) {
                throw error; // Rethrow if the error is not "file not found"
            }
        }

        // Check if the latest transaction hash already exists in the transactions
        const transactionExists = transactions.some((tx: { transaction: string; }) => tx.transaction === latestTransaction);

        // Prepend the new transaction data if it does not already exist
        if (!transactionExists) {
            transactions = [transactionData, ...transactions];

            // Write the updated transactions back to the file
            await fs.writeFile(filePath, JSON.stringify(transactions, null, 2));

            // Log a message indicating the file creation
            console.log(`Transaction data has been written to ${filePath}`);
        }
    }

    return Response.json({ transaction: latestTransaction, to: toPubkey, from: account, amount, contactInfo });
};

const fetchLatestTransactionAfterHash = async (toPubkey: PublicKey, lastTransactionHash: string | null) => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const confirmedSignatures = await connection.getSignaturesForAddress(toPubkey);

    // Find the index of the last transaction hash
    const lastTransactionIndex = confirmedSignatures.findIndex(signatureInfo => signatureInfo.signature === lastTransactionHash);

    // Filter transactions that happened after the specified transaction hash
    const filteredTransactions = confirmedSignatures.slice(0, lastTransactionIndex);

    // Get the latest transaction from the filtered transactions
    const latestTransaction = filteredTransactions.length > 0 ? filteredTransactions[0] : null;

    return latestTransaction?.signature;
};