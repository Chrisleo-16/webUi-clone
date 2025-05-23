"use client";
import { useEffect, useState } from "react";
import BackedAdminSystemReport, { SystemLogsAndStatistics } from "./backed/backed_reports_service";
import XmobButton from "@/components/button/xmobitButton";
import XmobTable from "@/components/tables/xmobTable";
import xmobcolors from "@/app/styles/xmobcolors";
import ChartComponent from "@/components/graphs/xmobCandlestickChart";
import { ApexOptions } from "apexcharts";
import HelpFormatter from "@/helpers/utils/xmobFomartUtil";
import MobitCard from "@/components/cards/xmobcard";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmobLoadingComponent from "@/components/loading/xmobLoading";

interface GraphState {
    series: { data: { x: number; y: number }[] }[];
    options: ApexOptions;
}

export default function AdminSystemReport() {
    const [logsData, setLogsData] = useState<SystemLogsAndStatistics | null>(null);
    const [formattedLog, setFormattedLog] = useState<any[]>([]);
    const [selectedLog, setSelectedLog] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [lineGraph, setLineGraph] = useState<GraphState>({
        series: [{ data: [] }],
        options: {
            chart: {
                type: 'line',
            },
            xaxis: {
                type: "datetime",
                labels: {
                    format: "hh:mm a",
                },
            },
        },
    });
    const [barGraph, setBarGraph] = useState<GraphState>({
        series: [{ data: [] }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: true,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '60%',
                },
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                type: "datetime",
                labels: {
                    format: "hh:mm a",
                },
            },
            yaxis: {
                title: {
                    text: "Number of Logs",
                },
            },
            colors: [xmobcolors.primary],
        },
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await BackedAdminSystemReport.getAllSystemLogs();
                if (response.success && response.logsData) {
                    const { systemLogs, totalLogsPerHour } = response.logsData;
                    setIsLoading(false)
                    const fLogs = systemLogs.map(log => ({
                        id: log.id,
                        method: log.method,
                        endpoint: log.endpoint,
                        time_called: HelpFormatter.formatDate(log.timeCalled),
                        status: log.status,
                        actions: (
                            <div className="flex gap-1">
                                <XmobButton
                                    onClick={() => viewLog(log)}
                                    backgroundColor={xmobcolors.secondary}
                                >
                                    View Details
                                </XmobButton>
                            </div>
                        ),
                    }));

                    // Format logs for the graphs
                    const graphData = totalLogsPerHour.map(log => ({
                        x: new Date().setHours(log.hourNum, 0, 0, 0),
                        y: log.count,
                    }));

                    setFormattedLog(fLogs);

                    // Update line graph state
                    setLineGraph(prevState => ({
                        ...prevState,
                        series: [{ data: graphData }],
                        options: {
                            ...prevState.options,
                            xaxis: {
                                type: "datetime",
                                categories: graphData.map(d => d.x),
                                labels: {
                                    format: "hh:mm a",
                                },
                            },
                        },
                    }));

             
                    setBarGraph(prevState => ({
                        ...prevState,
                        series: [{ data: graphData }],
                        options: {
                            ...prevState.options,
                            xaxis: {
                                type: "datetime",
                                categories: graphData.map(d => d.x),
                                labels: {
                                    format: "hh:mm a",
                                },
                            },
                        },
                    }));
                }
            } catch (error) {
                console.error("Error fetching system logs:", error);
            }
        }

        fetchData();
    }, []);

    const viewLog = (log: any) => {
        setSelectedLog(log);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedLog(null);
    };

    const columns = [
        { label: "ID", key: "id" },
        { label: "Method", key: "method" },
        { label: "EndPoint", key: "endpoint" },
        { label: "Time Called", key: "time_called" },
        { label: "Status", key: "status" },
        { label: "Action", key: "actions" },
    ];

    return (
        <div>
            {
                isLoading ? (
                    <>
                    <XmobLoadingComponent message="preparing system logs graphs..." />
                    </>
                ):(
                    <Xmoblayout className="grid-2">
                    <MobitCard isShadow={true}>
        
                    <ChartComponent options={lineGraph.options} series={lineGraph.series} type="line" />
                    </MobitCard>
                    <MobitCard isShadow={true}>
                 
                    <ChartComponent options={barGraph.options} series={barGraph.series} type="bar" />
                    </MobitCard>
                    </Xmoblayout>
                )
            }
           
            {
                isLoading ? (
                    <XmobLoadingComponent message="Preparing system logs..." />
                ) : (
                    <XmobTable columns={columns} data={formattedLog} />
                    )
            }

            {isDialogOpen && selectedLog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Error Log Details</h2>
                        <p><strong>Endpoint:</strong> {selectedLog.endpoint}</p>
                        <p><strong>Method:</strong> {selectedLog.method}</p>
                        <p><strong>Time Called:</strong> {selectedLog.time_called}</p>
                        <p><strong>Status:</strong> {selectedLog.status}</p>
                        <p><strong>Error Message:</strong> {selectedLog.errorMessage || "N/A"}</p>
                        <p><strong>Additional Info:</strong> {selectedLog.additionalInfo || "N/A"}</p>

                        <div className="flex justify-end mt-4">
                            <XmobButton onClick={closeDialog} backgroundColor={xmobcolors.primary}>
                                Close
                            </XmobButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}