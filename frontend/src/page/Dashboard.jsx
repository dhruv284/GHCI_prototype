import React from "react";

const Dashboard = () => {
  // Dummy data for demonstration
  const accountDetails = {
    name: "Rahul Bind",
    email: "rahul@example.com",
    accountNumber: "1234567890",
    ifsc: "BANK000123",
    balance: 12500.75
  };

  const paymentHistory = [
    { id: 1, date: "2025-11-10", type: "Credit", amount: 5000, desc: "Salary" },
    { id: 2, date: "2025-11-12", type: "Debit", amount: 1500, desc: "Groceries" },
    { id: 3, date: "2025-11-15", type: "Debit", amount: 2000, desc: "Electricity Bill" },
    { id: 4, date: "2025-11-17", type: "Credit", amount: 300, desc: "Refund" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">💰 Dashboard</h1>

      {/* Account Summary */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-medium text-gray-800">{accountDetails.name}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium text-gray-800">{accountDetails.email}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-500 text-sm">Account No.</p>
            <p className="font-medium text-gray-800">{accountDetails.accountNumber}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-500 text-sm">Balance</p>
            <p className="font-bold text-gray-900 text-lg">₹{accountDetails.balance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-right">Amount</th>
                <th className="py-2 px-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((tx) => (
                <tr key={tx.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4 text-gray-700">{tx.date}</td>
                  <td className={`py-2 px-4 font-semibold ${tx.type === "Credit" ? "text-green-600" : "text-red-600"}`}>{tx.type}</td>
                  <td className="py-2 px-4 text-right text-gray-800">₹{tx.amount.toLocaleString()}</td>
                  <td className="py-2 px-4 text-gray-600">{tx.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
