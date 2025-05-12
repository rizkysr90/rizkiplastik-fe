import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";

const AutoInput = () => {
    const API_URL =
        import.meta.env.VITE_BASE_URL_RIZKIPLASTIK_BE || "http://localhost:8080";
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Check if file is an Excel file
            if (
                file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                file.type === "application/vnd.ms-excel"
            ) {
                setSelectedFile(file);
                setError("");
            } else {
                setError("Please upload an Excel file (.xlsx or .xls)");
                setSelectedFile(null);
            }
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!selectedFile) {
            setError("Please select a file to upload");
            setIsLoading(false);
            return;
        }

        try {
            if (!token) {
                throw new Error("Authentication token is missing");
            }

            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await fetch(
                `${API_URL}/api/v1/online-transactions/auto-input-excel`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to upload file");
            }

            // Successfully uploaded file, navigate back to transactions list
            navigate("/dashboard/online-transactions");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unexpected error occurred"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Auto Input Transactions</h1>
                <p className="text-gray-600">
                    Upload an Excel file to automatically input transactions
                </p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label
                            htmlFor="file"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Excel File*
                        </label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Supported formats: .xlsx, .xls
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard/online-transactions")}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !selectedFile}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isLoading ? "Uploading..." : "Upload File"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AutoInput;
