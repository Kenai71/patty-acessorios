export default function ConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Sair sem salvar?</h3>
        <p className="text-sm text-gray-600 mb-6">Você tem alterações não salvas. Deseja realmente fechar?</p>
        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Sim, sair
          </button>
        </div>
      </div>
    </div>
  );
}