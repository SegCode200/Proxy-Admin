"use client";

import { useState } from "react";
import { ChevronDown, MoreHorizontal, Loader2, XCircle } from "lucide-react";
import { useGetAllRiders } from "@/hooks/useHook";
import { RiderDetailsModal } from "./RiderDetailsModal";

interface Rider {
  id: string;
  fullName: string;
  phone: string;
  vehicleType: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  isOnline: boolean;
  lastSeenAt: string;
  user: {
    name: string;
    email: string;
  };
  _count: {
    deliveries: number;
  };
}

export function RidesTable() {
  const { data, isLoading, error } = useGetAllRiders();
  const [sortField, setSortField] = useState<keyof Rider>("fullName");
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Rider) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#004CFF] mb-2" />
          <p className="text-gray-600">Loading riders data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white border border-red-200 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-red-100 rounded-full">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-red-600">
            Failed to Load Riders
          </h3>
          <p className="text-sm text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  const { riders = [], total: totalRiders = 0 } = data?.data ?? {};

  if (riders.length === 0) {
    return <div className="p-6 text-center text-gray-500">No riders found</div>;
  }

  const sortedRiders = [...riders].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusBadge = (status: Rider["status"]) => {
    const statusMap = {
      PENDING: { bg: "bg-yellow-100 text-yellow-800", text: "Pending" },
      APPROVED: { bg: "bg-green-100 text-green-800", text: "Active" },
      REJECTED: { bg: "bg-red-100 text-red-800", text: "Rejected" },
      SUSPENDED: { bg: "bg-gray-100 text-gray-800", text: "Suspended" },
    };
    const { bg, text } = statusMap[status] || {
      bg: "bg-gray-100",
      text: status,
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
      >
        {text}
      </span>
    );
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Riders</h3>
        <p className="mt-1 text-sm text-gray-600">View and manage all riders</p>
      </div>
      <div className="overflow-x-auto">
        <div className="mb-4 text-sm text-gray-600">
          Showing {riders.length} of {totalRiders} riders
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort("fullName")}
              >
                <div className="flex items-center">
                  Rider
                  <ChevronDown
                    className={`ml-1 w-4 h-4 transition-transform ${
                      sortField === "fullName" && sortDirection === "asc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Vehicle
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Deliveries
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Last Seen
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <ChevronDown
                    className={`ml-1 w-4 h-4 transition-transform ${
                      sortField === "status" && sortDirection === "asc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  />
                </div>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRiders.map((rider) => (
              <tr
                key={rider.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedRiderId(rider.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-gray-500 bg-gray-200 rounded-full">
                      {rider.fullName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {rider.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {rider.user?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {rider.phone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {rider.vehicleType}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {rider._count?.deliveries || 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {rider.lastSeenAt ? formatDate(rider.lastSeenAt) : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(rider.status)}
                    {rider.isOnline ? (
                      <span className="flex items-center">
                        <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                        <span className="text-xs text-gray-500">Online</span>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Offline</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle actions
                    }}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRiderId && (
        <RiderDetailsModal
          riderId={selectedRiderId}
          onClose={() => setSelectedRiderId(null)}
        />
      )}
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { ChevronDown, MoreHorizontal, Loader2, XCircle } from "lucide-react";
// import { useGetAllRiders } from "@/hooks/useHook";
// import { RiderDetailsModal } from "./RiderDetailsModal";

// interface Rider {
//   id: string;
//   fullName: string;
//   phone: string;
//   vehicleType: string;
//   status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
//   isOnline: boolean;
//   lastSeenAt: string;
//   user: {
//     name: string;
//     email: string;
//   };
//   _count: {
//     deliveries: number;
//   };
// }

// export function RidesTable() {
//   const { data, isLoading, error } = useGetAllRiders();
//   const [sortField, setSortField] = useState<keyof Rider>("fullName");
//   const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

//   const handleSort = (field: keyof Rider) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
//         <div className="flex flex-col items-center justify-center">
//           <Loader2 className="w-8 h-8 animate-spin text-[#004CFF] mb-2" />
//           <p className="text-gray-600">Loading riders data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 bg-white border border-red-200 rounded-lg shadow-sm">
//         <div className="text-center">
//           <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-red-100 rounded-full">
//             <XCircle className="w-6 h-6 text-red-600" />
//           </div>
//           <h3 className="mb-2 text-lg font-medium text-red-600">
//             Failed to Load Riders
//           </h3>
//           <p className="text-sm text-red-500">{error.message}</p>
//         </div>
//       </div>
//     );
//   }

//   const { riders = [], total: totalRiders = 0 } = data?.data ?? {};

//   if (riders.length === 0) {
//     return <div className="p-6 text-center text-gray-500">No riders found</div>;
//   }

//   const sortedRiders = [...riders].sort((a, b) => {
//     const aValue = a[sortField];
//     const bValue = b[sortField];

//     if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
//     if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
//     return 0;
//   });

//   const formatDate = (dateString: string) => {
//     const options: Intl.DateTimeFormatOptions = {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString("en-US", options);
//   };

//   const getStatusBadge = (status: Rider["status"]) => {
//     const statusMap = {
//       PENDING: { bg: "bg-yellow-100 text-yellow-800", text: "Pending" },
//       APPROVED: { bg: "bg-green-100 text-green-800", text: "Active" },
//       REJECTED: { bg: "bg-red-100 text-red-800", text: "Rejected" },
//       SUSPENDED: { bg: "bg-gray-100 text-gray-800", text: "Suspended" },
//     };
//     const { bg, text } = statusMap[status] || {
//       bg: "bg-gray-100",
//       text: status,
//     };
//     return (
//       <span
//         className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
//       >
//         {text}
//       </span>
//     );
//   };

//   return (
//     <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
//       <div className="p-6 border-b border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-900">Riders</h3>
//         <p className="mt-1 text-sm text-gray-600">View and manage all riders</p>
//       </div>
//       <div className="overflow-x-auto">
//         <div className="mb-4 text-sm text-gray-600">
//           Showing {riders.length} of {totalRiders} riders
//         </div>
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
//                 onClick={() => handleSort("fullName")}
//               >
//                 <div className="flex items-center">
//                   Rider
//                   <ChevronDown
//                     className={`ml-1 w-4 h-4 transition-transform ${
//                       sortField === "fullName" && sortDirection === "asc"
//                         ? "transform rotate-180"
//                         : ""
//                     }`}
//                   />
//                 </div>
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
//               >
//                 Vehicle
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
//               >
//                 Deliveries
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
//               >
//                 Last Seen
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
//                 onClick={() => handleSort("status")}
//               >
//                 <div className="flex items-center">
//                   Status
//                   <ChevronDown
//                     className={`ml-1 w-4 h-4 transition-transform ${
//                       sortField === "status" && sortDirection === "asc"
//                         ? "transform rotate-180"
//                         : ""
//                     }`}
//                   />
//                 </div>
//               </th>
//               <th scope="col" className="relative px-6 py-3">
//                 <span className="sr-only">Actions</span>
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {sortedRiders.map((rider) => (
//               <tr
//                 key={rider.id}
//                 className="cursor-pointer hover:bg-gray-50"
//                 onClick={() => setSelectedRiderId(rider.id)}
//               >
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-gray-500 bg-gray-200 rounded-full">
//                       {rider.fullName.charAt(0)}
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">
//                         {rider.fullName}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {rider.user?.email}
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
//                   {rider.phone}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
//                   {rider.vehicleType}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
//                   {rider._count?.deliveries || 0}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
//                   {rider.lastSeenAt ? formatDate(rider.lastSeenAt) : "N/A"}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center space-x-2">
//                     {getStatusBadge(rider.status)}
//                     {rider.isOnline ? (
//                       <span className="flex items-center">
//                         <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
//                         <span className="text-xs text-gray-500">Online</span>
//                       </span>
//                     ) : (
//                       <span className="text-xs text-gray-400">Offline</span>
//                     )}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
//                   <button
//                     className="text-gray-400 hover:text-gray-600"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       // Handle actions
//                     }}
//                   >
//                     <MoreHorizontal className="w-5 h-5" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {selectedRiderId && (
//         <RiderDetailsModal
//           riderId={selectedRiderId}
//           onClose={() => setSelectedRiderId(null)}
//         />
//       )}
//     </div>
//   );
// }
