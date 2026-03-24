import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductCard({ product, onUpdateStock, onClick }) {
  const isOutOfStock = product.estoque <= 0;

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
      
      {/* Imagem com Hover Animation e Tag de Estoque */}
      <div 
        className="relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer group mb-4 bg-gray-50"
        onClick={() => onClick(product)}
      >
        <img 
          src={product.imageUrl} 
          alt={product.nome} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
            Fora de Estoque
          </div>
        )}
      </div>

      <div className="w-full text-center mb-4 cursor-pointer" onClick={() => onClick(product)}>
        <h3 className="font-bold text-gray-800 truncate">{product.nome}</h3>
        <p className="text-sm text-gray-500">{product.codigo} • {product.tipo}</p>
      </div>

      {/* Contador Externo de Estoque */}
      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
        <button 
          onClick={() => onUpdateStock(product.id, product.estoque - 1)}
          className="p-1 hover:bg-white rounded-full transition-colors text-gray-600"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-semibold text-gray-800 w-6 text-center">{product.estoque}</span>
        <button 
          onClick={() => onUpdateStock(product.id, product.estoque + 1)}
          className="p-1 hover:bg-white rounded-full transition-colors text-gray-600"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}