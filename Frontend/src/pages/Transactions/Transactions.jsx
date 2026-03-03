// src/pages/Transactions/Transactions.jsx
// import React, { useState } from 'react';
// import { LayoutDashboard, TableProperties } from 'lucide-react';
// import TrendsView from './TrendsView';
// import LedgerView from './LedgerView';

// // --- Shared Mock Data ---
// const mockTransactions = [
//   { id: 'tx_1', date: '2026-02-26', rawString: 'ACH ELECTRONIC CREDIT STRIPE', entity: 'Stripe', category: 'Revenue', amount: 4250.00, confidence: 0.99, status: 'verified' },
//   { id: 'tx_2', date: '2026-02-25', rawString: 'POS DEBIT UBER *TRIP SFO', entity: 'Uber', category: 'Transport', amount: -42.50, confidence: 0.98, status: 'verified' },
//   { id: 'tx_3', date: '2026-02-25', rawString: 'TST* SWEETGREEN #492', entity: 'Sweetgreen', category: 'Meals', amount: -18.24, confidence: 0.88, status: 'verified' },
//   { id: 'tx_4', date: '2026-02-24', rawString: 'RECURRING PAYMENT GITHUB INC', entity: 'GitHub', category: 'SaaS Tools', amount: -48.00, confidence: 0.99, status: 'verified' },
//   { id: 'tx_5', date: '2026-02-23', rawString: 'WIRE TRANSFER FEE INTL', entity: 'Unknown', category: 'Bank Fees', amount: -35.00, confidence: 0.42, status: 'review' },
//   { id: 'tx_6', date: '2026-02-22', rawString: 'AWS EMEA SARL', entity: 'Amazon Web Services', category: 'Cloud Infra', amount: -1420.00, confidence: 0.95, status: 'verified' },
//   { id: 'tx_7', date: '2026-02-21', rawString: 'ACH CREDIT SHOPIFY PAYOUT', entity: 'Shopify', category: 'Revenue', amount: 1840.50, confidence: 0.96, status: 'verified' },
// ];

// export default function Transactions() {
//   // Default view is set to the consumer-friendly 'trends' dashboard
//   const [activeView, setActiveView] = useState('trends'); 

//   return (
//     <div className="space-y-6 pb-10">
      
//       {/* Header & View Toggle */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-extrabold text-white tracking-tight">Transactions</h1>
//           <p className="text-stone-400 mt-1 text-sm">Financial telemetry and ledger auditing.</p>
//         </div>
        
//         {/* Segmented Control */}
//         <div className="flex items-center bg-stone-900 border border-white/10 rounded-lg p-1 shadow-sm">
//           <button
//             onClick={() => setActiveView('trends')}
//             className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
//               activeView === 'trends' 
//                 ? 'bg-stone-800 text-white shadow-sm border border-white/5' 
//                 : 'text-stone-500 hover:text-stone-300'
//             }`}
//           >
//             <LayoutDashboard size={14} /> Insights
//           </button>
//           <button
//             onClick={() => setActiveView('ledger')}
//             className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
//               activeView === 'ledger' 
//                 ? 'bg-stone-800 text-white shadow-sm border border-white/5' 
//                 : 'text-stone-500 hover:text-stone-300'
//             }`}
//           >
//             <TableProperties size={14} /> Audit Ledger
//           </button>
//         </div>
//       </div>

//       {/* View Router */}
//       {activeView === 'trends' ? (
//         <TrendsView data={mockTransactions} />
//       ) : (
//         <LedgerView data={mockTransactions} />
//       )}

//     </div>
//   );
// }








import React, { useState } from 'react';
import { LayoutDashboard, TableProperties } from 'lucide-react';
import TrendsView from './TrendsView';
import LedgerView from './LedgerView';

// --- Shared High-Density Mock Data ---
const mockTransactions = [
  // Feb 26: Heavy Income + Moderate Expense
  { id: 'tx_1', date: '2026-02-26', rawString: 'ACH ELECTRONIC CREDIT STRIPE', entity: 'Stripe', category: 'Revenue', amount: 4250.00, confidence: 0.99, status: 'verified' },
  { id: 'tx_2', date: '2026-02-26', rawString: 'AWS EMEA SARL', entity: 'Amazon Web Services', category: 'Cloud Infra', amount: -1240.00, confidence: 0.95, status: 'verified' },
  { id: 'tx_3', date: '2026-02-26', rawString: 'POS DEBIT UBER *TRIP SFO', entity: 'Uber', category: 'Transport', amount: -42.50, confidence: 0.98, status: 'verified' },
  
  // Feb 25: Minor Income + Minor Expense
  { id: 'tx_4', date: '2026-02-25', rawString: 'ACH CREDIT SHOPIFY PAYOUT', entity: 'Shopify', category: 'Revenue', amount: 840.50, confidence: 0.96, status: 'verified' },
  { id: 'tx_5', date: '2026-02-25', rawString: 'TST* SWEETGREEN #492', entity: 'Sweetgreen', category: 'Meals', amount: -1000.24, confidence: 0.88, status: 'verified' },
  { id: 'tx_6', date: '2026-02-25', rawString: 'RECURRING PAYMENT GITHUB INC', entity: 'GitHub', category: 'SaaS Tools', amount: -480.00, confidence: 0.99, status: 'verified' },

  // Feb 24: Expense Only (High Burn)
  { id: 'tx_7', date: '2026-02-24', rawString: 'WEWORK MEMBERSHIP FEE', entity: 'WeWork', category: 'Real Estate', amount: 1500.00, confidence: 0.97, status: 'verified' },
  { id: 'tx_8', date: '2026-02-24', rawString: 'DELTA AIR LINES', entity: 'Delta', category: 'Travel', amount: -4500.00, confidence: 0.92, status: 'verified' },

  // Feb 23: Income + Expense
  { id: 'tx_9', date: '2026-02-23', rawString: 'ACH ELECTRONIC CREDIT STRIPE', entity: 'Stripe', category: 'Revenue', amount: 7000.00, confidence: 0.99, status: 'verified' },
  { id: 'tx_10', date: '2026-02-23', rawString: 'ADOBE CREATIVE CLOUD', entity: 'Adobe', category: 'SaaS Tools', amount: -850.99, confidence: 0.98, status: 'verified' },
  { id: 'tx_11', date: '2026-02-23', rawString: 'DOORDASH*DASHPASS', entity: 'DoorDash', category: 'Meals', amount: -350.00, confidence: 0.91, status: 'review' },

  // Feb 22: High Expense Only (Simulate a dip in the line chart)
  { id: 'tx_12', date: '2026-02-22', rawString: 'APPLE STORE #R123 MACBOOK', entity: 'Apple', category: 'Hardware', amount: 2850.00, confidence: 0.99, status: 'verified' },
  { id: 'tx_13', date: '2026-02-22', rawString: 'LEGALZOOM.COM INC', entity: 'LegalZoom', category: 'Legal Fees', amount: -5000.00, confidence: 0.84, status: 'verified' },

  // Feb 21: High Income + Low Expense
  { id: 'tx_14', date: '2026-02-21', rawString: 'WIRE INCOMING VANGUARD', entity: 'Vanguard', category: 'Investment', amount: 8500.00, confidence: 0.99, status: 'verified' },
  { id: 'tx_15', date: '2026-02-21', rawString: 'WIRE TRANSFER FEE INTL', entity: 'Unknown', category: 'Bank Fees', amount: -3500.00, confidence: 0.42, status: 'review' },

  // Feb 20: Moderate Expense
  { id: 'tx_16', date: '2026-02-20', rawString: 'FACEBOOK ADS *META', entity: 'Meta Platforms', category: 'Marketing', amount: 5000.00, confidence: 0.98, status: 'verified' },
  { id: 'tx_17', date: '2026-02-20', rawString: 'LYFT *RIDE', entity: 'Lyft', category: 'Transport', amount: -1024.50, confidence: 0.95, status: 'verified' },
];

export default function Transactions() {
  const [activeView, setActiveView] = useState('trends'); 

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header & View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Transactions</h1>
          <p className="text-stone-400 mt-1 text-sm">Financial telemetry and ledger auditing.</p>
        </div>
        
        {/* Segmented Control */}
        <div className="flex items-center bg-stone-900 border border-white/10 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveView('trends')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeView === 'trends' 
                ? 'bg-stone-800 text-white shadow-sm border border-white/5' 
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <LayoutDashboard size={14} /> Insights
          </button>
          <button
            onClick={() => setActiveView('ledger')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeView === 'ledger' 
                ? 'bg-stone-800 text-white shadow-sm border border-white/5' 
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <TableProperties size={14} /> Audit Ledger
          </button>
        </div>
      </div>

      {/* View Router */}
      {activeView === 'trends' ? (
        <TrendsView data={mockTransactions} />
      ) : (
        <LedgerView data={mockTransactions} />
      )}

    </div>
  );
}