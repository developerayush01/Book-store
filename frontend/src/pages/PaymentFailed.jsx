import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-red-500 text-6xl mb-4">✕</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-6">Something went wrong. Please try again.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Try Again
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

export default PaymentFailed;