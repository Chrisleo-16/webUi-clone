import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketModel } from "@/helpers/interfaces/TicketModel";
import { format } from "date-fns";
interface TicketProps {
    ticket: TicketModel;
}


const  TicketAnalysisUiTable: React.FC<{ tickets: TicketModel[] }> = ({ tickets }) =>
{
    return (<>
      <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Tickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left">
                            <th className="pb-4">ID</th>
                            <th className="pb-4">Type</th>
                            <th className="pb-4">Priority</th>
                            <th className="pb-4">Status</th>
                            <th className="pb-4">Created</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {tickets?.slice(0, 5).map((ticket) => (
                            <tr key={ticket.ticketId}>
                              <td className="py-3">
                                {ticket.ticketId.substring(0, 8)}
                              </td>
                              <td className="py-3">{ticket.ticketType}</td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    ticket.Priority === "high"
                                      ? "bg-red-100 text-red-700"
                                      : ticket.Priority === "medium"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {ticket.Priority}
                                </span>
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    ticket.isTicketSolved
                                      ? "bg-green-100 text-green-700"
                                      : "bg-orange-100 text-orange-700"
                                  }`}
                                >
                                  {ticket.isTicketSolved ? "Solved" : "Open"}
                                </span>
                              </td>
                              <td className="py-3">
                                {format(
                                  new Date(ticket.createdAt),
                                  "MMM dd, yyyy"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
    
    </>)
}


export default TicketAnalysisUiTable;