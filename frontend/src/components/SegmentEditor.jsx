import { useState } from 'react';
import { evaluateSegment } from '../services/api';

const SegmentEditor = ({ onResult, onReset }) => {
    const [rules, setRules] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showJson, setShowJson] = useState(false);
    const [jsonResult, setJsonResult] = useState(null);

    const exampleRules = `price > 1000
stock_status = instock
on_sale = true`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rules.trim()) {
            setError('Please enter at least one rule');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const result = await evaluateSegment(rules);
            setJsonResult(result);
            onResult(result);
            setShowJson(true);
        } catch (err) {
            setError(err.message || 'Failed to evaluate segment');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setRules('');
        setError(null);
        setShowJson(false);
        setJsonResult(null);
        onReset();
    };

    const loadExample = () => {
        setRules(exampleRules);
        setError(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Segment Editor</h2>
                <button
                    onClick={loadExample}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Load Example
                </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
                Enter one condition per line. Supported operators: =, !=, &gt;, &lt;, &gt;=, &lt;=, contains
            </p>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rules
                    </label>
                    <textarea
                        value={rules}
                        onChange={(e) => setRules(e.target.value)}
                        placeholder="price > 1000&#10;stock_status = instock&#10;on_sale = true"
                        className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Available fields: price, stock_status, stock_quantity, category, on_sale, title
                    </p>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {loading ? 'Evaluating...' : 'Apply Segment'}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                    >
                        Reset
                    </button>
                </div>
            </form>

            {showJson && jsonResult && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">JSON Result</h3>
                        <button
                            onClick={() => setShowJson(false)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Hide
                        </button>
                    </div>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
                        {JSON.stringify(jsonResult, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default SegmentEditor;