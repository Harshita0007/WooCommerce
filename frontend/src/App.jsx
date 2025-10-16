import { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import SegmentEditor from './components/SegmentEditor';
import { getProducts } from './services/api';

function App() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Failed to load products. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSegmentResult = (result) => {
        setFilteredProducts(result);
    };

    const handleReset = () => {
        setFilteredProducts(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        WooCommerce Product Manager
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Browse products and create custom segments
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <SegmentEditor
                        onResult={handleSegmentResult}
                        onReset={handleReset}
                    />
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <ProductList
                        products={filteredProducts !== null ? filteredProducts.data : products}
                        isFiltered={filteredProducts !== null}
                        resultInfo={filteredProducts}
                    />
                )}
            </main>

            <footer className="bg-white border-t mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-gray-500 text-sm">
                        WooCommerce Segmentation System • Built with React & Node.js
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;