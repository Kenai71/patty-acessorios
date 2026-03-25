import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

export default function ProductCard({ product, onUpdateStock, onClick, onDelete }) {
  const isOutOfStock = product.estoque <= 0;

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-md relative group">
      
      <div 
        className="relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer mb-4 bg-gray-50"
        onClick={() => onClick(product)}
      >
        <img 
          src={product.imageUrl} 
          alt={product.nome} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
            Fora de Estoque
          </div>
        )}
      </div>

      <div className="w-full text-center mb-4 cursor-pointer px-2" onClick={() => onClick(product)}>
        <h3 className="font-bold text-gray-900 truncate">{product.nome}</h3>
        <p className="text-sm font-medium text-gray-600">
          {product.codigo} • {product.tipo || 'Sem tipo'} {product.material ? `(${product.material})` : ''}
        </p>
      </div>

      {/* Container inferior refeito para caber Preço, Estoque e Lixeira */}
      <div className="flex items-center justify-center w-full mt-auto relative min-h-[36px]">
        
        {/* Preço (Canto Inferior Esquerdo) */}
        <div className="absolute left-0 bottom-1 font-bold text-green-600 text-base">
          R$ {product.preco || '0,00'}
        </div>

        {/* Controle de Estoque (Centro) */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
          <button 
            onClick={() => onUpdateStock(product.id, product.estoque - 1)}
            className="p-1 hover:bg-white rounded-full transition-colors text-gray-700"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-bold text-gray-900 w-5 text-center text-sm">{product.estoque}</span>
          <button 
            onClick={() => onUpdateStock(product.id, product.estoque + 1)}
            className="p-1 hover:bg-white rounded-full transition-colors text-gray-700"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Botão de Excluir (Canto Inferior Direito) */}
        <button 
          onClick={() => onDelete(product)}
          className="absolute right-0 bottom-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Excluir produto"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}