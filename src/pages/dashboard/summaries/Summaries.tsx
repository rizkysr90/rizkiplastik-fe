import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/authContext";
import { useSummaryData } from "../../../hooks/summaries";
import { formatDate } from "../../../utils/date";
import { formatToRupiah } from "../../../utils/number";

interface Point {
    x: number;
    y: number;
}

const Summaries = () => {
    const { token } = useAuth();
    const [dateRange, setDateRange] = useState({
        start_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0], // Default to 30 days ago
        end_date: new Date().toISOString().split("T")[0], // Today
    });

    // Prepare query parameters with YYYY-MM-DD format
    const queryParams = useMemo(() => ({
        start_date: dateRange.start_date, // YYYY-MM-DD format
        end_date: dateRange.end_date, // YYYY-MM-DD format
    }), [dateRange.start_date, dateRange.end_date]);

    // Use the query hook
    const { data, isLoading, isError, error, refetch } = useSummaryData(queryParams, token || undefined);

    const [maxProfit, setMaxProfit] = useState(0);
    const [minProfit, setMinProfit] = useState(0);
    const [chartPoints, setChartPoints] = useState<Point[]>([]);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    // Handle date range changes
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDateRange((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle manual fetch
    const handleFetchSummary = () => {
        refetch();
    };

    // Calculate chart points when data changes
    useEffect(() => {
        if (data?.daily_profits && data.daily_profits.length > 0) {
            const profits = data.daily_profits.map(p => p.net_profit);
            const max = Math.max(...profits);
            const min = Math.min(...profits);

            // Ensure range includes zero and has some padding
            setMaxProfit(Math.max(max * 1.1, 0));
            setMinProfit(Math.min(min * 1.1, 0));

            // Calculate chart points
            const totalPoints = data.daily_profits.length;
            const chartWidth = 100; // percentage width

            if (totalPoints > 1) {
                const points: Point[] = data.daily_profits.map((profit, index) => {
                    // X coordinate (0 to chartWidth)
                    const x = (index / (totalPoints - 1)) * chartWidth;

                    // Y coordinate (from minProfit to maxProfit, converted to 0-100% scale)
                    const range = Math.max(max, 0) - Math.min(min, 0);
                    const normalizedY = range === 0
                        ? 50 // If all values are the same, center them
                        : ((profit.net_profit - Math.min(min, 0)) / range) * 100;

                    // Invert Y because SVG coordinate system has 0 at top
                    const y = 100 - normalizedY;

                    return { x, y };
                });

                setChartPoints(points);
            } else if (totalPoints === 1) {
                // If there's only one point, place it in the middle
                setChartPoints([{ x: 50, y: 50 }]);
            }
        } else {
            setChartPoints([]);
        }
    }, [data]);

    // Generate the SVG path for the line chart
    const generateLinePath = (): string => {
        if (chartPoints.length < 2) return '';

        return chartPoints.reduce((path, point, index) => {
            if (index === 0) {
                return `M ${point.x} ${point.y}`;
            }
            return `${path} L ${point.x} ${point.y}`;
        }, '');
    };

    // Get position of zero line
    const getZeroLinePosition = (): number => {
        if (maxProfit <= 0) return 0;
        if (minProfit >= 0) return 100;

        const range = maxProfit - minProfit;
        return ((maxProfit / range) * 100);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Profit Summary</h1>

            {/* Date Range Selector */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="start_date"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={dateRange.start_date}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            name="end_date"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={dateRange.end_date}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={handleFetchSummary}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Generate Summary"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Content */}
            {isError ? (
                <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6">
                    Error: {error?.message || "Failed to fetch summary data"}
                </div>
            ) : isLoading ? (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            ) : data ? (
                <div className="bg-white rounded-lg shadow p-6">
                    {/* Total Summary */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-2">Total Summary</h2>
                        <div className="bg-indigo-50 p-6 rounded-lg">
                            <p className="text-gray-700 text-lg">
                                Total Net Profit:{" "}
                                <span
                                    className={
                                        data.total_net_profit >= 0
                                            ? "text-green-600 font-bold text-2xl"
                                            : "text-red-600 font-bold text-2xl"
                                    }
                                >
                                    {formatToRupiah(data.total_net_profit)}
                                </span>
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                For period: {formatDate(dateRange.start_date)} to{" "}
                                {formatDate(dateRange.end_date)}
                            </p>
                        </div>
                    </div>

                    {/* Line Chart using SVG and Tailwind */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Profit Trend</h2>
                        {!data.daily_profits || data.daily_profits.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-lg">
                                No profit data available for the selected date range.
                            </div>
                        ) : (
                            <div className="relative h-64 border border-gray-200 rounded-lg p-4">
                                {/* Y-axis labels */}
                                <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-2 text-xs text-gray-500">
                                    <span>{formatToRupiah(maxProfit)}</span>
                                    {maxProfit > 0 && minProfit < 0 && (
                                        <span style={{ top: `${getZeroLinePosition()}%` }} className="absolute left-0 transform -translate-y-1/2">
                                            {formatToRupiah(0)}
                                        </span>
                                    )}
                                    <span>{formatToRupiah(minProfit)}</span>
                                </div>

                                {/* SVG for the chart */}
                                <div className="pl-16 pr-2 h-full w-full">
                                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                                        {/* Grid lines */}
                                        <line x1="0" y1="0" x2="100" y2="0" stroke="#e5e7eb" strokeWidth="0.5" />
                                        <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.5" />
                                        <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" />
                                        <line x1="0" y1="75" x2="100" y2="75" stroke="#e5e7eb" strokeWidth="0.5" />
                                        <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />

                                        {/* Zero line (if applicable) */}
                                        {maxProfit > 0 && minProfit < 0 && (
                                            <line
                                                x1="0"
                                                y1={getZeroLinePosition()}
                                                x2="100"
                                                y2={getZeroLinePosition()}
                                                stroke="#6b7280"
                                                strokeWidth="0.5"
                                                strokeDasharray="2,2"
                                            />
                                        )}

                                        {/* Line chart - reduced stroke width */}
                                        <path
                                            d={generateLinePath()}
                                            fill="none"
                                            stroke="#4f46e5"
                                            strokeWidth="1"
                                            className="transition-all duration-500 ease-in-out"
                                        />

                                        {/* Invisible larger hit areas for better hover detection */}
                                        {chartPoints.map((point, index) => (
                                            <circle
                                                key={`hitarea-${index}`}
                                                cx={point.x}
                                                cy={point.y}
                                                r="5"
                                                fill="transparent"
                                                className="cursor-pointer"
                                                onMouseEnter={() => setHoverIndex(index)}
                                                onMouseLeave={() => setHoverIndex(null)}
                                            />
                                        ))}

                                        {/* Data points */}
                                        {chartPoints.map((point, index) => (
                                            <g key={index}>
                                                <circle
                                                    cx={point.x}
                                                    cy={point.y}
                                                    r="1"
                                                    fill="#4f46e5"
                                                    className="transition-all duration-300 ease-in-out"
                                                />

                                                {/* Larger hover circle */}
                                                {hoverIndex === index && (
                                                    <circle
                                                        cx={point.x}
                                                        cy={point.y}
                                                        r="3"
                                                        fill="#4f46e5"
                                                        className="transition-all duration-150 ease-in-out"
                                                    />
                                                )}
                                            </g>
                                        ))}
                                    </svg>
                                </div>

                                {/* Tooltip - improved positioning and styling */}
                                {hoverIndex !== null && data.daily_profits && data.daily_profits[hoverIndex] && (
                                    <div
                                        className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none z-10 shadow-lg"
                                        style={{
                                            left: `calc(${16 + (chartPoints[hoverIndex].x * (100 - 18) / 100)}%)`,
                                            top: `calc(${chartPoints[hoverIndex].y}% - 12px)`,
                                            transform: 'translateX(-50%)'
                                        }}
                                    >
                                        <p className="font-medium">{formatDate(data.daily_profits[hoverIndex].date)}</p>
                                        <p className="font-semibold">{formatToRupiah(data.daily_profits[hoverIndex].net_profit)}</p>
                                    </div>
                                )}

                                {/* X-axis labels */}
                                <div className="absolute bottom-0 left-16 right-2 flex justify-between text-xs text-gray-500">
                                    {data.daily_profits && data.daily_profits.length > 0 && (
                                        <>
                                            <span>{formatDate(data.daily_profits[0].date)}</span>
                                            {data.daily_profits.length > 2 && (
                                                <span>
                                                    {formatDate(data.daily_profits[Math.floor(data.daily_profits.length / 2)].date)}
                                                </span>
                                            )}
                                            <span>
                                                {formatDate(data.daily_profits[data.daily_profits.length - 1].date)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Daily Profits Table */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Daily Profit Breakdown</h2>
                        {!data.daily_profits || data.daily_profits.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-lg">
                                No profit data available for the selected date range.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Net Profit
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data.daily_profits.map((profit, index) => (
                                            <tr
                                                key={index}
                                                className={`hover:bg-gray-50 ${hoverIndex === index ? 'bg-indigo-50' : ''}`}
                                                onMouseEnter={() => setHoverIndex(index)}
                                                onMouseLeave={() => setHoverIndex(null)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(profit.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <span
                                                        className={
                                                            profit.net_profit >= 0
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }
                                                    >
                                                        {formatToRupiah(profit.net_profit)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500 border border-gray-200">
                    Select a date range and click "Generate Summary" to view profit data.
                </div>
            )}
        </div>
    );
};

export default Summaries;