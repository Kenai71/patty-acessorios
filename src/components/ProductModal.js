import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function ProductModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    nome: '', codigo: '', tipo: '', notaFiscal: '', dataEntrada: '', dataSaida: ''
  });
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCloseAttempt = () => {
    // Verifica se os dados foram alterados para mostrar o aviso
    if (JSON.stringify(formData) !== JSON.stringify(initialData)) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const InputField = ({ label, name, type = "text" }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type} name={name} value={formData[name]} onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50" onClick={handleCloseAttempt}>
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
          <h2 className="text-xl font-bold mb-4 text-gray-800">{initialData?.id ? 'Editar Peça' : 'Nova Peça'}</h2>
          
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <InputField label="Nome" name="nome" />
            <InputField label="Código" name="codigo" />
            <InputField label="Tipo" name="tipo" />
            <InputField label="Nota Fiscal" name="notaFiscal" />
            <InputField label="Data de Chegada" name="dataEntrada" type="date" />
            <InputField label="Data de Saída" name="dataSaida" type="date" />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button onClick={handleCloseAttempt} className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
            <button onClick={() => onSave(formData)} className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Salvar
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal isOpen={showConfirm} onConfirm={() => { setShowConfirm(false); onClose(); }} onCancel={() => setShowConfirm(false)} />
    </>
  );
}