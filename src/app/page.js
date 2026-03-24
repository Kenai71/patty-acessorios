"use client";
import { useState, useEffect, useRef } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

  // Carregar produtos do Firebase
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const q = query(collection(db, "produtos"));
    const querySnapshot = await getDocs(q);
    const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsData);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Nova verificação de duplicidade mais segura
    const imageRef = ref(storage, `produtos/${file.name}`);
    try {
      await getDownloadURL(imageRef);
      // Se não der erro, a imagem existe
      alert(`O arquivo ${file.name} já existe no estoque! Altere o nome da imagem ou escolha outra.`);
      e.target.value = ''; // Limpa o input
      return;
    } catch (error) {
      // Se der erro, a imagem não existe, podemos prosseguir
    }

    setSelectedImage(file);
    setEditingProduct({ nome: '', codigo: '', tipo: '', notaFiscal: '', dataEntrada: '', dataSaida: '', estoque: 1 });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (selectedImage) {
        // Upload da nova imagem
        const imageRef = ref(storage, `produtos/${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);
        const imageUrl = await getDownloadURL(imageRef);
        
        await addDoc(collection(db, "produtos"), { ...productData, imageUrl, estoque: 1 });
      } else if (productData.id) {
        // Atualizar produto existente
        const productRef = doc(db, "produtos", productData.id);
        await updateDoc(productRef, productData);
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

  // Lógica de Filtragem
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (activeCategory === "Em Estoque") matchesCategory = p.estoque > 0;
    else if (activeCategory === "Fora de Estoque") matchesCategory = p.estoque === 0;
    else if (activeCategory !== "Todas") matchesCategory = p.tipo.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header e Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Estoque Patty Acessórios</h1>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar nome ou código..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow-sm whitespace-nowrap"
            >
              <Upload size={20} /> Nova Peça
            </button>
            <input 
              type="file" accept="image/*" ref={fileInputRef} className="hidden" 
              onChange={handleImageSelect}
            />
          </div>
        </div>

        {/* Categorias */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === cat 
                ? 'bg-gray-800 text-white border-gray-800' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onUpdateStock={updateStock}
              onClick={(prod) => { setEditingProduct(prod); setIsModalOpen(true); }}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              Nenhuma peça encontrada com estes filtros.
            </div>
          )}
        </div>

        {/* Modal */}
        <ProductModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setSelectedImage(null); }} 
          onSave={handleSaveProduct}
          initialData={editingProduct}
        />
      </div>
    </div>
  );
}