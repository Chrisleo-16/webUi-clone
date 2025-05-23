import MobitCard from "@/components/cards/xmobcard";
import XmobText from "@/components/text/xmobText";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketAnalytics } from "@/helpers/interfaces/TicketAnalytics";
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



  interface BarChartUiProps {
    ticketAnalytics: TicketAnalytics;
}

const BarGraphUi:React.FC<BarChartUiProps> = ({ ticketAnalytics }) => {
    return <div>

<MobitCard bordered={true} isShadow={true}>
                  <CardHeader>
                  <XmobText fontWeight="bold" variant="h5">Tickets by Priority</XmobText>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            priority: "High",
                            count: ticketAnalytics.ticketsByPriority.high,
                          },
                          {
                            priority: "Medium",
                            count: ticketAnalytics.ticketsByPriority.medium,
                          },
                          {
                            priority: "Low",
                            count: ticketAnalytics.ticketsByPriority.low,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="priority" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8">
                          <Cell fill="#ff6b6b" />
                          <Cell fill="#ffd93d" />
                          <Cell fill="#4dabf7" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </MobitCard>
    </div>;
}

export default BarGraphUi;