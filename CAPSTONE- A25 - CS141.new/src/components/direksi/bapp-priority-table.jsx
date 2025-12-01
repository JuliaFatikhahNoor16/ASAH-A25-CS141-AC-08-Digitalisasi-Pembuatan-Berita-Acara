import React from 'react';

const BappPriorityTable = ({ data = [], onReview }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl p-12 text-center text-gray-500 shadow">
                <p>Tidak ada BAPP yang menunggu persetujuan</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">No BAPP</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Projek</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nilai</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Deadline</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.noBapp}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.projek}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.nilai}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.deadline}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => onReview(item)}
                                        className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Review
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BappPriorityTable;