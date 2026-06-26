import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const transactionId = searchParams.get("transactionId");

    return (
        <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-sm w-full">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-3xl">✓</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h1>
                <p className="text-gray-500 text-sm mb-6">Your order has been placed successfully.</p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg transition text-sm"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;