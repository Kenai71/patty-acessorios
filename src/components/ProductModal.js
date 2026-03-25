import { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';

export default function ProductModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    nome: '', codigo: '', tipo: '', material: '', notaFiscal: '', dataEntrada: '', dataSaida: ''
  });
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tipo: initialData.tipo || '',
        material: initialData.material || '' 
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCloseAttempt = () => {
    if (JSON.stringify(formData) !== JSON.stringify(initialData)) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50" onClick={handleCloseAttempt}>
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
          <h2 className="text-xl font-bold mb-4 text-gray-800">{initialData?.id ? 'Editar Peça' : 'Nova Peça'}</h2>
          
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium bg-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Código</label>
              <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium bg-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo</label>
              <select 
                name="tipo" 
                value={formData.tipo} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer font-medium ${formData.tipo === '' ? 'text-gray-500' : 'text-gray-900'}`}
              >
                <option value="" disabled>Selecione</option>
                <option value="Corrente" className="text-gray-900">Corrente</option>
                <option value="Pulseira" className="text-gray-900">Pulseira</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Material</label>
              <select 
                name="material" 
                value={formData.material} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer font-medium ${formData.material === '' ? 'text-gray-500' : 'text-gray-900'}`}
              >
                <option value="" disabled>Selecione</option>
                <option value="Ouro" className="text-gray-900">Ouro</option>
                <option value="Prata" className="text-gray-900">Prata</option>
                <option value="Banhado" className="text-gray-900">Banhado</option>
                <option value="Biju" className="text-gray-900">Biju</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nota Fiscal</label>
              <input type="text" name="notaFiscal" value={formData.notaFiscal} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium bg-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Chegada</label>
              <input type="date" name="dataEntrada" value={formData.dataEntrada} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium bg-white cursor-pointer" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Saída</label>
              <input type="date" name="dataSaida" value={formData.dataSaida} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium bg-white cursor-pointer" />
            </div>

          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button onClick={handleCloseAttempt} className="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
              Cancelar
            </button>
            <button 
              onClick={() => onSave(formData)} 
              // Impede salvar se tipo ou material estiverem vazios
              disabled={!formData.tipo || !formData.material}
              className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal isOpen={showConfirm} onConfirm={() => { setShowConfirm(false); onClose(); }} onCancel={() => setShowConfirm(false)} />
    </>
  );
}