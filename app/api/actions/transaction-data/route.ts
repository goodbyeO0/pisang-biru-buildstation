import { promises as fs } from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const filePath = path.resolve(process.cwd(), 'app/api/actions/contact-info/transaction.json');

export const GET = async (req: Request) => {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const transactions = JSON.parse(fileContent);
        return Response.json(transactions);
    } catch (error) {
        Response.json({ error: 'Failed to read transactions' });
    }
};