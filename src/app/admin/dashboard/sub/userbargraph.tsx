
import MobitCard from "@/components/cards/xmobcard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
interface UserAnalyticsProps {
    dashboardData: AnalyticsResponse;
}

const UserBarGraphAnalytics:React.FC<UserAnalyticsProps> = ({ dashboardData }) => {
    return <div>
        {
                <MobitCard bordered={true} isShadow={true}>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer>
                      <BarChart
                        data={[
                          {
                            period: "Last 7 Days",
                            users: dashboardData?.activeUsers || 0,
                          },
                          {
                            period: "Last 30 Days",
                            users: dashboardData?.newUsers || 0,
                          },
                          {
                            period: "Total",
                            users: dashboardData?.totalUsers || 0,
                          },
                        ]}
                      >
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="users" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </MobitCard>
}
    </div>;
    
}


export default UserBarGraphAnalytics;