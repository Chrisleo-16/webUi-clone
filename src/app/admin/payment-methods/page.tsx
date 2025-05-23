"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  PlusCircle,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";

import AuthApiService from "@/helpers/Api/users/User.service";
// import Sidebar from "../components/Sidebar";

interface PaymentMethod {
  id: number;
  name: string;
  country: string;
  category: string;
  is_active: boolean;
}

interface PaymentMethodFormData {
  name: string;
  country: string;
  category: string;
}

const AdminPaymentMethodsPage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<
    number | null
  >(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentMethodFormData>();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const methods = await AuthApiService.getAllPaymentDetailsAdmin();
      setPaymentMethods(methods);
      setError(null);
    } catch (err) {
      setError("Failed to fetch payment methods. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<PaymentMethodFormData> = async (data) => {
    try {
      await AuthApiService.createPaymentMethod(data);
      fetchPaymentMethods();
      reset();
    } catch (err) {
      setError("Failed to add payment method. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    setPaymentMethodToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (paymentMethodToDelete) {
      try {
        await AuthApiService.deletePaymentMethod(paymentMethodToDelete);
        fetchPaymentMethods();
        setError(null);
      } catch (err) {
        setError("Failed to delete payment method. Please try again.");
      } finally {
        setShowDeleteModal(false);
        setPaymentMethodToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPaymentMethodToDelete(null);
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await AuthApiService.updatePaymentMethod(id, {
        is_active: !currentStatus,
      });
      fetchPaymentMethods();
    } catch (err) {
      setError("Failed to update payment method status. Please try again.");
    }
  };

  return (
    <div className="flex w-full">
      {/* <Sidebar /> */}
      <div className="min-h-screen bg-gray-50 p-8 w-full">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Manage Payment Methods
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-yellow-500">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Add New Payment Method
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className="mt-1 block w-full px-4 py-2 rounded-lg border-2 border-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 transition-colors"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                {...register("country", { required: "Country is required" })}
                className="mt-1 block w-full px-4 py-2 rounded-lg border-2 border-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 transition-colors"
              />
              {errors.country && (
                <span className="text-red-500 text-sm">
                  {errors.country.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="mt-1 block w-full px-4 py-2 rounded-lg border-2 border-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 transition-colors appearance-none bg-white"
              >
                <option value="">Select a category</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Banks">Banks</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <span className="text-red-500 text-sm">
                  {errors.category.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-gray-800 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Payment Method
            </button>
          </form>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Confirm Deletion
                </h3>
              </div>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete this payment method? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Existing Payment Methods
          </h2>
          {isLoading ? (
            <p>Loading payment methods...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paymentMethods.map((method) => (
                    <tr
                      key={method.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {method.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {method.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {method.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            method.is_active
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {method.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleToggleActive(method.id, method.is_active)
                          }
                          className={`p-1.5 rounded-full hover:bg-gray-100 mr-2 ${
                            method.is_active
                              ? "text-gray-600 hover:text-gray-800"
                              : "text-yellow-600 hover:text-yellow-800"
                          }`}
                        >
                          {method.is_active ? (
                            <X className="h-5 w-5" />
                          ) : (
                            <Check className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(method.id)}
                          className="p-1.5 rounded-full hover:bg-gray-100 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
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
};

export default AdminPaymentMethodsPage;
