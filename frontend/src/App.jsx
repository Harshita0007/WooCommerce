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
            setError(null);
            const data = await getProducts();

            // Ensure data is an array
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                console.error('❌ Products data is not an array:', data);
                setProducts([]);
                setError('Received invalid data format from server');
            }
        } catch (err) {
            setError(err.message || 'Failed to load products. Please try again.');
            console.error('❌ Load products error:', err);
            setProducts([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleSegmentResult = (result) => {
        // Validate result data
        if (result && Array.isArray(result.data)) {
            setFilteredProducts(result);
        } else {
            console.error('❌ Invalid segment result:', result);
            setError('Received invalid segment result');
        }
    };

    const handleReset = () => {
        setFilteredProducts(null);
        setError(null);
    };

    // Safely get products to display
    const displayProducts = filteredProducts !== null
        ? (Array.isArray(filteredProducts.data) ? filteredProducts.data : [])
        : (Array.isArray(products) ? products : []);

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
                        <div className="flex justify-between items-start">
                            <p className="text-red-800">{error}</p>
                            <button
                                onClick={() => {
                                    setError(null);
                                    loadProducts();
                                }}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <ProductList
                        products={displayProducts}
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