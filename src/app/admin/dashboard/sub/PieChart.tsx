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
  interface PieChartUiProps {
    ticketAnalytics: TicketAnalytics;
}

const PieChartUi: React.FC<PieChartUiProps> = ({ ticketAnalytics }) => {
    
return (
<>
<MobitCard bordered={true}  isShadow={true}>
    <CardHeader>
    <XmobText fontWeight="bold" variant="h5">Ticket Status Distribution</XmobText>
    </CardHeader>
    <CardContent className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
        <PieChart>
        <Pie
            data={[
            {
                name: "Open",
                value: ticketAnalytics.openTickets,
            },
            {
                name: "Solved",
                value: ticketAnalytics.solvedTickets,
            },
            ]}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            label
        >
            <Cell fill="#ff6b6b" />
            <Cell fill="#51cf66" />
        </Pie>
        <Tooltip />
        </PieChart>
    </ResponsiveContainer>
    </CardContent>
</MobitCard>


</>)


}

export default PieChartUi;