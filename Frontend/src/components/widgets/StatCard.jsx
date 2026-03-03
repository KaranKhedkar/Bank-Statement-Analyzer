// import React from "react";

// export default function StatCard({
//   title,
//   value,
//   valueSuffix,
//   icon: Icon,
//   iconColor,
//   iconBg,
//   badgeNode,
// }) {
//   return (
//     <div
//       className={`
//       relative overflow-hidden backdrop-blur-md p-6 rounded-2xl shadow-sm transition-all duration-300 bg-stone-900/50 border border-white/5 hover:border-white/10`}
//     >
//       <div className="flex justify-between items-start mb-4">
//         {/* Dynamic Icon Container */}
//         <div
//           className={`w-10 h-10 rounded-xl flex items-center justify-center border ${iconBg}`}
//         >
//           <Icon size={20} className={iconColor} />
//         </div>

//         {/* Dynamic Top-Right Badge */}
//         {badgeNode && <div>{badgeNode}</div>}
//       </div>

//       <h3 className="text-stone-400 text-sm font-medium">{title}</h3>
//       <p className="text-3xl font-semibold tracking-tight text-white mt-1">
//         {value}{" "}
//         {valueSuffix && (
//           <span className="text-sm font-normal text-stone-500">
//             {valueSuffix}
//           </span>
//         )}
//       </p>
//     </div>
//   );
// }



import React from "react";

export default function StatCard({
  title,
  value,
  valueSuffix,
  badgeNode,
}) {
  return (
    <div
      className="relative overflow-hidden backdrop-blur-md p-6 rounded-2xl shadow-sm transition-all duration-300 bg-stone-900/50 border border-white/5 hover:border-white/10 flex flex-col justify-center"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-stone-400 text-sm font-medium">{title}</h3>
        {badgeNode && <div>{badgeNode}</div>}
      </div>

      <p className="text-3xl font-semibold tracking-tight text-white">
        {value}{" "}
        {valueSuffix && (
          <span className="text-sm font-normal text-stone-500">
            {valueSuffix}
          </span>
        )}
      </p>
    </div>
  );
}