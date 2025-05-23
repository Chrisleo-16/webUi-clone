import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarIcon } from 'lucide-react'

import AxiosInstance from '@/helpers/security/interceptors/http.interceptor'
import TokenService from '@/helpers/Token/token.service'
import { baseUrl } from '@/helpers/constants/baseUrls'

// Types for new transaction data format
interface Transaction {
    sender: string
    receiver: string
    amount: string
    currency_symbol: string
    status: string
    created_at: string
    fee_amount: string
}

// API call
const fetchTransactions = async (): Promise<Transaction[]> => {
    const token = await TokenService.getToken()
    const { data } = await AxiosInstance.get(`${baseUrl}/exchange/history`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data.data
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    const getVariant = () => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success'
            case 'pending':
                return 'warning'
            case 'failed':
                return 'destructive'
            default:
                return 'secondary'
        }
    }

    return <Badge variant={getVariant() as any}>{status}</Badge>
}

const Transactions = () => {
    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransactions,
    })

    const [searchTerm, setSearchTerm] = useState('')

    const filteredTransactions = transactions?.filter((tx) =>
        tx.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.currency_symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.status.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Render loading skeletons
    const renderSkeleton = () => (
        <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
    )

    return (
        <div className="container mx-auto py-5">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Transaction History</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>View your recent transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <Input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-1/4 mb-4"
                    />

                    <Table className=''>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Fee</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>

                        {isLoading ? (
                            renderSkeleton()
                        ) : (
                            <TableBody>
                                {filteredTransactions && filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((tx) => (
                                        <TableRow key={tx.sender + tx.receiver + tx.created_at}>
                                            <TableCell className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                {format(new Date(tx.created_at), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell>{tx.sender}</TableCell>
                                            <TableCell>{tx.receiver}</TableCell>
                                            <TableCell>
                                                {`${parseFloat(tx.amount).toFixed(8)} ${tx.currency_symbol}`}
                                            </TableCell>
                                            <TableCell>
                                                {`${parseFloat(tx.fee_amount).toFixed(8)} ${tx.currency_symbol}`}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={tx.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            No transactions found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default Transactions
