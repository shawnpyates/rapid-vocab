import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma-client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    await prisma.pair.createMany({ data: JSON.parse(req.body) })
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
