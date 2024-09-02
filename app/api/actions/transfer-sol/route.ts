/**
 * Solana Actions Example
 */

import {
    ActionPostResponse,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
    createActionHeaders,
    ActionError,
} from "@solana/actions";

import {
    clusterApiUrl,
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";

import { DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "./const";

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: Request) => {
    try {
        const requestUrl = new URL(req.url); // the url of the current request
        console.log(`requestUrl: ${requestUrl}`)
        const { toPubkey } = validatedQueryParams(requestUrl);
        console.log(`validatedQueryParams: ${JSON.stringify(validatedQueryParams(requestUrl))}`)
        // validatedQueryParams: {"amount":1,"toPubkey":"nick6zJc6HpW3kfBm4xS2dmbuVRyb5F3AnUvj5ymzR5"}

        const baseHref = new URL(
            `/api/actions/transfer-sol?to=${toPubkey.toBase58()}`,
            requestUrl.origin,
        ).toString();
        console.log(baseHref)
        // http://localhost:3000/api/actions/transfer-sol?to=3oGRxuPz1Q1ergQ1WvvTtMQthdPAM5pZ9mjEJMSA7xmy

        const payload: ActionGetResponse = {
            type: "action",
            title: "Actions Example - Transfer Native SOL",
            icon: new URL("/gambar_izhan.jpg", requestUrl.origin).toString(),
            description: "Tuition halFLight",
            label: "Transfer", // this value will be ignored since `links.actions` exists
            links: {
                actions: [
                    {
                        label: "Send 0.5 SOL", // button text
                        href: `${baseHref}&amount=${"0.5"}&contactInfo={contactInfo}`, // this href will have a text input
                        parameters: [
                            {
                                name: "contactInfo", // parameter name in the `href` above
                                label: "contact info", // placeholder of the text input
                                required: true,
                            },
                        ],
                    },
                ],
            },
        };

        return Response.json(payload, {
            headers,
        });
    } catch (err) {
        console.log(err);
        let actionError: ActionError = { message: "An unknown error occurred" };
        if (typeof err == "string") actionError.message = err;
        return Response.json(actionError, {
            status: 400,
            headers,
        });
    }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
    try {
        const requestUrl = new URL(req.url);
        console.log(`requestUrl: ${requestUrl}`)
        const { amount, toPubkey, contactInfo } = validatedQueryParams(requestUrl);
        console.log(contactInfo)

        const body: ActionPostRequest = await req.json();
        console.log(`body: ${JSON.stringify(body)}`)

        // validate the client provided input
        let account: PublicKey;
        try {
            account = new PublicKey(body.account);
            console.log(`body.account: ${account}`)
        } catch (err) {
            throw 'Invalid "account" provided';
        }

        const connection = new Connection(
            process.env.SOLANA_RPC! || clusterApiUrl("devnet"),
        );

        // ensure the receiving account will be rent exempt
        const minimumBalance = await connection.getMinimumBalanceForRentExemption(
            0, // note: simple accounts that just store native SOL have `0` bytes of data
        );
        if (amount * LAMPORTS_PER_SOL < minimumBalance) {
            throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
        }

        // create an instruction to transfer native SOL from one wallet to another
        const transferSolInstruction = SystemProgram.transfer({
            fromPubkey: account,
            toPubkey: toPubkey,
            lamports: amount * LAMPORTS_PER_SOL,
        });

        // get the latest blockhash amd block height
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        console.log(`getLatestBlockhash: ${JSON.stringify(await connection.getLatestBlockhash())}`)

        // create a legacy transaction
        const transaction = new Transaction({
            feePayer: account,
            blockhash,
            lastValidBlockHeight,
        }).add(transferSolInstruction);

        // versioned transactions are also supported
        // const transaction = new VersionedTransaction(
        //   new TransactionMessage({
        //     payerKey: account,
        //     recentBlockhash: blockhash,
        //     instructions: [transferSolInstruction],
        //   }).compileToV0Message(),
        //   // note: you can also use `compileToLegacyMessage`
        // );

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
                message: `Send ${amount} SOL to ${toPubkey.toBase58()}`,
            },
            // note: no additional signers are needed
            // signers: [],
        });

        return Response.json(payload, {
            headers,
        });
    } catch (err) {
        console.log(err);
        let actionError: ActionError = { message: "An unknown error occurred" };
        if (typeof err == "string") actionError.message = err;
        return Response.json(actionError, {
            status: 400,
            headers,
        });
    }
};

function validatedQueryParams(requestUrl: URL) {
    let toPubkey: PublicKey = DEFAULT_SOL_ADDRESS;
    let amount: number = DEFAULT_SOL_AMOUNT;
    let contactInfo: String = ""

    try {
        if (requestUrl.searchParams.get("to")) {
            toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
        }
    } catch (err) {
        throw "Invalid input query parameter: to";
    }

    try {
        if (requestUrl.searchParams.get("amount")) {
            amount = parseFloat(requestUrl.searchParams.get("amount")!);
        }

        if (amount <= 0) throw "amount is too small";
    } catch (err) {
        throw "Invalid input query parameter: amount";
    }

    try {
        if (requestUrl.searchParams.get("contactInfo")) {
            contactInfo = (requestUrl.searchParams.get("contactInfo")!);
        }

    } catch (err) {
        throw "Invalid input query parameter: contactInfo";
    }

    return {
        amount,
        toPubkey,
        contactInfo
    };
}