
import MobitCard from "@/components/cards/xmobcard";
import { Card, CardContent, CardHeader, CardTitle } from "../../card";
import AnalyticsResponse from "@/helpers/interfaces/AnalyticsResponse";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
  } from "recharts";
import UserBarGraphAnalytics from "@/app/admin/dashboard/sub/userbargraph";
import Xmoblayout from "@/components/layouts/xmoblayout";
import UserAreaChart from "@/app/admin/dashboard/sub/userareagraph";
interface UserAnalyticsProps {
    dashboardData: AnalyticsResponse;
}

const UserAnalytics:React.FC<UserAnalyticsProps> = ({ dashboardData }) => {
    return <>
    <Xmoblayout layoutType="grid-2">
    <UserBarGraphAnalytics dashboardData={dashboardData}/>
    <UserAreaChart dashboardData={dashboardData}/>

    </Xmoblayout>
    </>
   
    
}


export default UserAnalytics;