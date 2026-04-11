import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

export default function ProductCard({ product, onUpdateStock, onClick, onDelete }) {
  const isOutOfStock = product.estoque <= 0;

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-md relative group h-full">
      
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

      <div className="flex flex-col items-center w-full mt-auto pt-4 border-t border-gray-50 gap-3">
        <div className="font-extrabold text-green-600 text-lg w-full text-center bg-green-50/50 py-1 rounded-lg">
          R$ {product.preco || '0,00'}
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="w-9"></div> {/* Spacer para manter o estoque perfeitamente centralizado */}
          
          <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
            <button 
              onClick={() => onUpdateStock(product.id, product.estoque - 1)}
              className="p-1 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-700"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-bold text-gray-900 w-6 text-center text-sm">{product.estoque}</span>
            <button 
              onClick={() => onUpdateStock(product.id, product.estoque + 1)}
              className="p-1 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-700"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button 
            onClick={() => onDelete(product)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center w-9"
            title="Excluir produto"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}