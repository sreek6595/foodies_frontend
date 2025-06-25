import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FaChartLine, FaUtensils, FaUser, FaMotorcycle, FaEye, FaCheck, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDriversAPI, verifyDriverAPI,  } from "../services/deliveryServices";

const Admindbview = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "Delivery Partner Management - Foodies Corner";
  }, []);

  // Fetch delivery partners using getDriversAPI
  const { data: partners, isLoading, error } = useQuery({
    queryKey: ["deliveryPartners"],
    queryFn: async () => {
      const response = await getDriversAPI();
      console.log("Drivers Data from Backend:", response); // Debug log
      return response;
    },
  });

  // Mutation for verifying/rejecting driver
  const verifyDriverMutation = useMutation({
    mutationFn: verifyDriverAPI,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["deliveryPartners"]);
      queryClient.setQueryData(["deliveryPartners"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((partner) =>
          partner._id === variables.id
            ? { ...partner, status: variables.status, reason: variables.reason || partner.reason }
            : partner
        );
      });
    },
    onError: (error) => {
      console.error("Failed to verify/reject driver:", error);
      alert("An error occurred while processing the request");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["deliveryPartners"]);
    },
  });

  const handleAccept = (id) => {
    if (!id) {
      console.error("No ID provided for Accept");
      alert("❌ Cannot accept: Driver ID is missing!");
      return;
    }
    console.log("Accepting driver with ID:", id); // Debug log
    verifyDriverMutation.mutate({ id, status: "approved" });
  };

  const handleRejectProcess = (id, action = "start", reason = "") => {
    if (action === "start") {
      setShowRejectModal(id);
      setRejectReason("");
    } else if (action === "submit" && reason.trim()) {
      setIsRejecting(true);
      console.log(reason)
      verifyDriverMutation.mutate(
        { id, status: "rejected", reason: reason },
        {
          onSuccess: () => {
            setShowRejectModal(null);
            setRejectReason("");
            setIsRejecting(false);
          },
          onError: () => {
            setIsRejecting(false);
            alert("Failed to reject driver. Please try again.");
          },
        }
      );
    } else if (action === "cancel") {
      setShowRejectModal(null);
      setRejectReason("");
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expanded state for this row
    }));
  };

  if (isLoading) {
    return <div className="flex min-h-screen justify-center items-center"><p className="text-xl text-gray-600">Loading delivery partners...</p></div>;
  }

  if (error) {
    return <div className="flex min-h-screen justify-center items-center"><p className="text-xl text-red-600">Error loading data: ${error.message}</p></div>;
  }

  const isReasonValid = rejectReason.trim().length >= 5;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <NavLink to="/adminverifyres" className="flex items-center gap-3 text-gray-300 hover:text-white">
              <FaChartLine /> Verify Restaurants
            </NavLink>
          </li>
          <li>
            <NavLink to="/adminrestview" className="flex items-center gap-3 text-gray-300 hover:text-white">
              <FaUtensils /> Restaurants
            </NavLink>
          </li>
          <li>
            <NavLink to="/admincustview" className="flex items-center gap-3 text-gray-300 hover:text-white">
              <FaUser /> Delivery boy complaints
            </NavLink>
          </li>
          <li>
            <NavLink to="/admindbview" className="flex items-center gap-3 text-gray-300 hover:text-white">
              <FaMotorcycle /> Delivery Partners
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex justify-between items-center rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Back
          </button>
        </nav>

        <h1 className="text-4xl font-bold text-gray-800 text-center my-8">
          Delivery Partner Verification
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-4 font-semibold text-gray-700">Sl No</th>
                <th className="p-4 font-semibold text-gray-700">Name</th>
                <th className="p-4 font-semibold text-gray-700">Email</th>
                <th className="p-4 font-semibold text-gray-700">Phone No</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners?.map((partner, index) => {
                const displayStatus = partner.status || "pending";
                const driverId = partner._id || partner.id;

                return (
                  <tr key={driverId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 border-t border-gray-200 text-gray-800">{index + 1}</td>
                    <td className="p-4 border-t border-gray-200 text-gray-800">{partner.username || partner.name || "N/A"}</td>
                    <td className="p-4 border-t border-gray-200 text-gray-600">{partner.email || "N/A"}</td>
                    <td className="p-4 border-t border-gray-200 text-gray-600">{partner.phoneno || partner.phone || "N/A"}</td>
                    <td className="p-4 border-t border-gray-200">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          displayStatus === "approved"
                            ? "bg-green-100 text-green-700"
                            : displayStatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {displayStatus}
                      </span>
                    </td>
                    <td className="p-4 border-t border-gray-200 flex gap-3">
                      <motion.button
                        onClick={() => toggleRow(driverId)}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      >
                        {expandedRows[driverId] ? <FaChevronUp /> : <FaChevronDown />}
                        {expandedRows[driverId] ? "Hide" : "View"}
                      </motion.button>

                      <motion.button
                        onClick={() => handleAccept(driverId)}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                        disabled={verifyDriverMutation.isLoading || displayStatus === "approved"}
                      >
                        {verifyDriverMutation.isLoading ? "Processing..." : <><FaCheck /> Accept</>}
                      </motion.button>

                      <motion.button
                        onClick={() => handleRejectProcess(driverId, "start")}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        disabled={verifyDriverMutation.isLoading || isRejecting || displayStatus === "rejected"}
                      >
                        {isRejecting ? "Processing..." : <><FaTimes /> Reject</>}
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Reason for Rejection</h2>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Enter reason for rejection (min 5 characters)..."
                rows="4"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => handleRejectProcess(showRejectModal, "submit", rejectReason)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  disabled={!isReasonValid || isRejecting}
                >
                  {isRejecting ? "Submitting..." : "Submit"}
                </button>
                <button
                  onClick={() => handleRejectProcess(showRejectModal, "cancel")}
                  className="flex-1 bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  disabled={isRejecting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {Object.keys(expandedRows).length > 0 && (
          <motion.div
            className="mt-6 p-6 bg-white shadow-lg rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {partners.map((partner) => {
              const driverId = partner._id || partner.id;
              return expandedRows[driverId] ? (
                <div key={driverId}>
                  <h2 className="text-2xl font-bold">{partner.username || partner.name} - Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p><strong>Address:</strong> {partner.address || "N/A"}</p>
                      <p><strong>Aadhar No:</strong> {partner.adhar || partner.adharno || "N/A"}</p>
                      <p><strong>License No:</strong> {partner.licenceno || "N/A"}</p>
                    </div>
                    <div>
                      <p><strong>Experience:</strong> {partner.exp || partner.experience || "N/A"}</p>
                      <p><strong>Vehicle No:</strong> {partner.vehicleNumber || partner.vehiclePlate || "N/A"}</p>
                      <p><strong>Email:</strong> {partner.email || "N/A"}</p>
                    </div>
                  </div>
                  {partner.status === "rejected" && (
                    <div className="mt-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <h3 className="font-semibold text-lg text-red-700 mb-2">Rejection Details</h3>
                      <div className="space-y-2">
                        <p><strong className="text-gray-800">Reason:</strong> {partner.reason || "No reason provided"}</p>
                        <p className="text-sm text-gray-500">
                          <strong>Rejected on:</strong> {new Date(partner.date || Date.now()).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null;
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admindbview;