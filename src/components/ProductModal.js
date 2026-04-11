import { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';
import { X } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    nome: '', codigo: '', preco: '', tipo: '', material: '', notaFiscal: '', dataEntrada: '', dataSaida: ''
  });
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        preco: initialData.preco || '',
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

  const inputClasses = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white text-gray-900 font-medium transition-all duration-200";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5 ml-1";

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleCloseAttempt}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-full" onClick={e => e.stopPropagation()}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800">
              {initialData?.id ? '✏️ Editar Peça' : '✨ Nova Peça'}
            </h2>
            <button 
              onClick={handleCloseAttempt}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="sm:col-span-2">
                <label className={labelClasses}>Nome da Peça</label>
                <input type="text" name="nome" placeholder="Ex: Colar de Ouro 18k" value={formData.nome} onChange={handleChange} className={inputClasses} />
              </div>

              <div>
                <label className={labelClasses}>Código</label>
                <input type="text" name="codigo" placeholder="Ex: COL-123" value={formData.codigo} onChange={handleChange} className={inputClasses} />
              </div>

              <div>
                <label className={labelClasses}>Preço (R$)</label>
                <input type="text" name="preco" placeholder="Ex: 49,90" value={formData.preco} onChange={handleChange} className={inputClasses} />
              </div>

              <div>
                <label className={labelClasses}>Tipo</label>
                <select 
                  name="tipo" 
                  value={formData.tipo} 
                  onChange={handleChange} 
                  className={`${inputClasses} cursor-pointer ${formData.tipo === '' ? 'text-gray-500' : 'text-gray-900'}`}
                >
                  <option value="" disabled>Selecione um tipo</option>
                  <option value="Corrente" className="text-gray-900">Corrente</option>
                  <option value="Pulseira" className="text-gray-900">Pulseira</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Material</label>
                <select 
                  name="material" 
                  value={formData.material} 
                  onChange={handleChange} 
                  className={`${inputClasses} cursor-pointer ${formData.material === '' ? 'text-gray-500' : 'text-gray-900'}`}
                >
                  <option value="" disabled>Selecione o material</option>
                  <option value="Ouro" className="text-gray-900">Ouro</option>
                  <option value="Prata" className="text-gray-900">Prata</option>
                  <option value="Banhado" className="text-gray-900">Banhado</option>
                  <option value="Biju" className="text-gray-900">Biju</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClasses}>Nota Fiscal</label>
                <input type="text" name="notaFiscal" placeholder="Número da NF (Opcional)" value={formData.notaFiscal} onChange={handleChange} className={inputClasses} />
              </div>

              <div>
                <label className={labelClasses}>Data de Entrada</label>
                <input type="date" name="dataEntrada" value={formData.dataEntrada} onChange={handleChange} className={`${inputClasses} cursor-pointer`} />
              </div>

              <div>
                <label className={labelClasses}>Data de Saída</label>
                <input type="date" name="dataSaida" value={formData.dataSaida} onChange={handleChange} className={`${inputClasses} cursor-pointer`} />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3 shrink-0">
            <button onClick={handleCloseAttempt} className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold">
              Cancelar
            </button>
            <button 
              onClick={() => onSave(formData)} 
              disabled={!formData.tipo || !formData.material}
              className="px-6 py-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all font-semibold disabled:bg-blue-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center"
            >
              Salvar Peça
            </button>
          </div>

        </div>
      </div>
      <ConfirmModal isOpen={showConfirm} onConfirm={() => { setShowConfirm(false); onClose(); }} onCancel={() => setShowConfirm(false)} />
    </>
  );
}