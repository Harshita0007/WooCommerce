import React from 'react';

const ProductCard = ({ product }) => {
    const getStockStatusColor = (status) => {
        switch (status) {
            case 'instock':
                return 'bg-green-100 text-green-800';
            case 'outofstock':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                </h3>

                <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                        ${parseFloat(product.price).toFixed(2)}
                    </span>
                    {product.on_sale && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            ON SALE
                        </span>
                    )}
                </div>

                <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product.stock_status)}`}>
                        {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {product.stock_quantity !== null && (
                        <span className="ml-2 text-sm text-gray-600">
                            Qty: {product.stock_quantity}
                        </span>
                    )}
                </div>

                {product.category && (
                    <div className="mb-2">
                        <span className="text-sm text-gray-600">
                            <span className="font-medium">Category:</span> {product.category}
                        </span>
                    </div>
                )}

                {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {product.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                            >
                                {tag}
                            </span>
                        ))}
                        {product.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                                +{product.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">ID: {product.id}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;