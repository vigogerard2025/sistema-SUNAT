// pages/api/invoices.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

interface Invoice {
  id: number;
  ruc: string;
  tipo_doc: string;
  serie: string;
  numero: string;
  fecha_generacion: string;
  estado: string;
  observaciones?: string;
  created_at: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM invoices ORDER BY id DESC');
      res.status(200).json(result.rows as Invoice[]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener facturas' });
    }
  } else if (req.method === 'POST') {
    const { ruc, tipo_doc, serie, numero, estado, observaciones } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO invoices (ruc, tipo_doc, serie, numero, estado, observaciones) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [ruc, tipo_doc, serie, numero, estado, observaciones]
      );
      res.status(201).json(result.rows[0] as Invoice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear factura' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
