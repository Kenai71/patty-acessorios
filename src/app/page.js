"use client";
import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore'; // Importamos o deleteDoc
import { Search, Upload } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const CATEGORIES = ["Todas", "Corrente", "Pulseira", "Ouro", "Prata", "Banhado", "Biju", "Em Estoque", "Fora de Estoque"];

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Estados para exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const q = query(collection(db, "produtos"));
    const querySnapshot = await getDocs(q);
    const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsData);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    // Inicia zerado para forçar a pessoa a escolher o tipo e o material
    setEditingProduct({ nome: '', codigo: '', tipo: '', material: '', notaFiscal: '', dataEntrada: '', dataSaida: '', estoque: 1 });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      let finalImageUrl = productData.imageUrl || "";

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        
        const IMGBB_API_KEY = "99a173a61a12187a49385e180e12ccbc"; 
        
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: formData,
        });
        
        const imgbbData = await res.json();
        if (imgbbData.success) {
           finalImageUrl = imgbbData.data.url;
        } else {
           alert("Erro ao fazer upload da imagem.");
           return;
        }
      }
      
      if (productData.id) {
        const productRef = doc(db, "produtos", productData.id);
        await updateDoc(productRef, { ...productData, imageUrl: finalImageUrl });
      } else {
        await addDoc(collection(db, "produtos"), { ...productData, imageUrl: finalImageUrl, estoque: 1 });
      }
      
      setIsModalOpen(false);
      setSelectedImage(null);
      setEditingProduct(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
      fetchProducts();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar o produto.");
    }
  };

  const updateStock = async (id, newStock) => {
    if (newStock < 0) newStock = 0;
    const productRef = doc(db, "produtos", id);
    await updateDoc(productRef, { estoque: newStock });
    setProducts(products.map(p => p.id === id ? { ...p, estoque: newStock } : p));
  };

  // Funções de Exclusão
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteDoc(doc(db, "produtos", productToDelete.id));
        setProducts(products.filter(p => p.id !== productToDelete.id));
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o produto.");
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = p.nome?.toLowerCase().includes(searchLower) || 
                          p.codigo?.toLowerCase().includes(searchLower);
    
    let matchesCategory = true;
    if (activeCategory === "Em Estoque") matchesCategory = p.estoque > 0;
    else if (activeCategory === "Fora de Estoque") matchesCategory = p.estoque === 0;
    else if (["Corrente", "Pulseira"].includes(activeCategory)) matchesCategory = p.tipo?.toLowerCase() === activeCategory.toLowerCase();
    else if (["Ouro", "Prata", "Banhado", "Biju"].includes(activeCategory)) matchesCategory = p.material?.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Estoque Patty Acessórios</h1>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar nome ou código..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 shadow-sm text-gray-900 font-medium placeholder-gray-500 bg-white"
              />
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-sm whitespace-nowrap font-semibold"
            >
              <Upload size={20} /> Nova Peça
            </button>
            <input 
              type="file" accept="image/*" ref={fileInputRef} className="hidden" 
              onChange={handleImageSelect}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === cat 
                ? 'bg-gray-800 text-white border-gray-800' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onUpdateStock={updateStock}
              onClick={(prod) => { setEditingProduct(prod); setIsModalOpen(true); }}
              onDelete={handleDeleteClick} // Passamos a função da lixeirinha aqui!
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-gray-600 font-medium py-12">
              Nenhuma peça encontrada com estes filtros.
            </div>
          )}
        </div>

        <ProductModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setSelectedImage(null); }} 
          onSave={handleSaveProduct}
          initialData={editingProduct}
        />

        {/* Modal de Confirmação de Exclusão */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Excluir Peça?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Tem certeza que deseja excluir <b>{productToDelete?.nome}</b>? Esta ação não pode ser desfeita e o produto será apagado do banco de dados.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)} 
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Sim, excluir
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}