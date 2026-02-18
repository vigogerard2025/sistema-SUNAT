'use client';

import useSWR from 'swr';
import { useState } from 'react';

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

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Facturas() {
  const { data: invoices, error, mutate } = useSWR<Invoice[]>('/api/invoices', fetcher);
  const [form, setForm] = useState({
    ruc: '',
    tipo_doc: '',
    serie: '',
    numero: '',
    estado: '',
    observaciones: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ ruc: '', tipo_doc: '', serie: '', numero: '', estado: '', observaciones: '' });
    mutate(); // refresca la lista
  };

  if (error) return <div className="text-red-500">Error al cargar</div>;
  if (!invoices) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Facturas</h1>

      <form onSubmit={handleSubmit} className="mb-6 grid gap-2 max-w-md">
        <input name="ruc" value={form.ruc} onChange={handleChange} placeholder="RUC" className="border p-2 rounded" required />
        <input name="tipo_doc" value={form.tipo_doc} onChange={handleChange} placeholder="Tipo Documento" className="border p-2 rounded" required />
        <input name="serie" value={form.serie} onChange={handleChange} placeholder="Serie" className="border p-2 rounded" required />
        <input name="numero" value={form.numero} onChange={handleChange} placeholder="Número" className="border p-2 rounded" required />
        <input name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" className="border p-2 rounded" required />
        <textarea name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Observaciones" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Agregar Factura</button>
      </form>

      <ul>
        {invoices.map((inv) => (
          <li key={inv.id} className="border p-2 mb-2 rounded shadow-sm">
            <span className="font-semibold">{inv.serie}-{inv.numero}</span> | {inv.ruc} | {inv.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
