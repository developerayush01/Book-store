import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

function MySales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axiosInstance.get("/api/orders/my-sales");
      setSales(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + (sale.totalPrice || sale.price || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#F7F3EC] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e293b]">
            My Sales
          </h1>
          <p className="mt-2 text-[#374151]">
            View books you've sold and their order details.
          </p>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500">Total Sales</p>
            <h2 className="text-3xl font-bold text-[#92400e] mt-2">
              {sales.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500">Revenue</p>
            <h2 className="text-3xl font-bold text-[#92400e] mt-2">
              Rs. {totalRevenue}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500">Completed Orders</p>
            <h2 className="text-3xl font-bold text-[#92400e] mt-2">
              {sales.length}
            </h2>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-[#1e293b]">
              Sales History
            </h2>
          </div>

          {loading ? (
            <div className="py-10 text-center text-[#374151]">
              Loading...
            </div>
          ) : sales.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-6xl mb-4">📚</div>

              <h3 className="text-2xl font-semibold text-[#1e293b]">
                No Sales Yet
              </h3>

              <p className="text-[#374151] mt-2">
                Once someone buys your books, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#1e293b] text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Book</th>
                    <th className="px-6 py-3 text-left">Buyer</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {sales.map((sale) => (
                    <tr
                      key={sale._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        {sale.book?.title || "Unknown Book"}
                      </td>

                      <td className="px-6 py-4">
                        {sale.buyer?.name || "Unknown Buyer"}
                      </td>

                      <td className="px-6 py-4">
                        Rs. {sale.totalPrice || sale.price}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {sale.status || "Completed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MySales;
