import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-6">Order #{orderId} has been placed.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(`/my-orders`)}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;