"use client"

import * as React from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconPlus,
} from "@tabler/icons-react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { useCurrency } from "@/lib/currency-context"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "@/lib/database"
import { Transaction } from "@/lib/types"

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function TransactionActions({ transaction }: { transaction: Transaction }) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id)
      toast.success("Transaction deleted successfully")
      window.location.reload() // Simple refresh for now
    } catch (error) {
      toast.error("Failed to delete transaction")
      console.error(error)
    }
    setIsDeleting(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={() => setIsEditing(true)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive"
          onClick={() => setIsDeleting(true)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      
      <TransactionForm
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        transaction={transaction}
        mode="edit"
      />
      
      <DeleteConfirmation
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDelete}
        transactionDescription={transaction.description || "this transaction"}
      />
    </DropdownMenu>
  )
}

function DeleteConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  transactionDescription 
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  transactionDescription: string
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{transactionDescription}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TransactionForm({
  isOpen,
  onClose,
  transaction,
  mode = 'create'
}: {
  isOpen: boolean
  onClose: () => void
  transaction?: Transaction
  mode?: 'create' | 'edit'
}) {
  const isMobile = useIsMobile()
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    description: transaction?.description || '',
    amount: transaction?.amount.toString() || '',
    type: transaction?.type || 'expense' as 'income' | 'expense',
    category: transaction?.category || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const transactionData = {
        description: formData.description,
        amount: Number(formData.amount),
        type: formData.type,
        category: formData.category,
        date: formData.date,
      }

      if (mode === 'edit' && transaction) {
        await updateTransaction(transaction.id, transactionData)
        toast.success("Transaction updated successfully")
      } else {
        await createTransaction(transactionData)
        toast.success("Transaction created successfully")
      }

      onClose()
      window.location.reload() // Simple refresh for now
    } catch (error) {
      toast.error(`Failed to ${mode} transaction`)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter transaction description"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="0.00"
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: 'income' | 'expense') => 
              setFormData(prev => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="e.g., Food, Rent, Salary"
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
      </div>
    </form>
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{mode === 'edit' ? 'Edit' : 'Add'} Transaction</DrawerTitle>
            <DrawerDescription>
              {mode === 'edit' ? 'Update' : 'Create'} your transaction details below.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            {content}
          </div>
          <DrawerFooter>
            <Button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={loading}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit' : 'Add'} Transaction</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? 'Update' : 'Create'} your transaction details below.
          </DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DataTable() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [showAddForm, setShowAddForm] = React.useState(false)
  const { formatCurrency } = useCurrency()

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="font-medium max-w-[200px] truncate">
          {row.original.description || "No description"}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`px-1.5 ${
            row.original.type === 'income' 
              ? 'text-green-600 border-green-200' 
              : 'text-red-600 border-red-200'
          }`}
        >
          {row.original.type === 'income' ? 'Income' : 'Expense'}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => (
        <div className={`text-right tabular-nums font-medium ${
          row.original.type === 'income' ? 'text-green-600' : 'text-red-600'
        }`}>
          {row.original.type === 'income' ? '+' : '-'}{formatCurrency(Number(row.original.amount))}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {formatDate(row.original.date)}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <TransactionActions transaction={row.original} />,
    },
  ]

  React.useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true)
        const data = await getTransactions(100) // Get latest 100 transactions
        setTransactions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
        console.error('Error fetching transactions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const table = useReactTable({
    data: transactions,
    columns,
    state: { 
      sorting,
      pagination 
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="overflow-hidden rounded-lg border">
          <div className="p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full mb-2" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <div className="p-8 text-center">
            <div className="text-red-600 font-medium">Error loading transactions</div>
            <div className="text-muted-foreground mt-2">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recent Transactions</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <IconPlus className="size-4 mr-2" />
          Add Transaction
        </Button>
      </div>
      
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No transactions found. Add your first transaction to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight />
          </Button>
        </div>
      </div>

      <TransactionForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        mode="create"
      />
    </div>
  )
}
