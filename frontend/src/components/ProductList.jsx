import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, isFiltered, resultInfo }) => {
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-1">
                    {isFiltered ? 'Try adjusting your segment rules' : 'No products available'}
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                    {isFiltered ? 'Filtered Products' : 'All Products'}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({products.length} {products.length === 1 ? 'product' : 'products'})
                    </span>
                </h2>

                {isFiltered && resultInfo && resultInfo.conditions && (
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">{resultInfo.conditions.length}</span> condition(s) applied
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductList;