'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string | null;
  date: string;
  account_id: string;
  created_at: string;
}

interface Account {
  id: string;
  name: string;
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => format(new Date(row.getValue('date')), 'PPP'),
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'account_id',
    header: 'Account',
    cell: ({ row }) => {
      // This will need to be updated to show account name instead of ID
      return row.getValue('account_id');
    },
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    account_id: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();

    const channel = supabase
      .channel('transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTransactions((prev) => [...prev, payload.new as Transaction]);
          } else if (payload.eventType === 'DELETE') {
            setTransactions((prev) =>
              prev.filter((t) => t.id !== (payload.old as Transaction).id)
            );
          } else if (payload.eventType === 'UPDATE') {
            setTransactions((prev) =>
              prev.map((t) =>
                t.id === (payload.old as Transaction).id
                  ? (payload.new as Transaction)
                  : t
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions.');
    } else {
      setTransactions(data as Transaction[]);
    }
    setLoading(false);
  };

  const fetchAccounts = async () => {
    const { data, error } = await supabase.from('accounts').select('id, name');
    if (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts.');
    } else {
      setAccounts(data as Account[]);
      if (data && data.length > 0 && !newTransaction.account_id) {
        setNewTransaction((prev) => ({ ...prev, account_id: data[0].id }));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string, id: string) => {
    setNewTransaction((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      toast.error('You must be logged in to add transactions.');
      return;
    }

    const transactionToInsert = {
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionToInsert])
      .select();

    if (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction.');
    } else {
      toast.success('Transaction added successfully!');
      setNewTransaction({
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        account_id: accounts.length > 0 ? accounts[0].id : '',
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
              <p className="text-muted-foreground">
                View and manage all your financial transactions
              </p>
            </div>
          </div>

          <div className="px-4 lg:px-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Add New Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div classNameName="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div classNameName="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newTransaction.type}
                      onValueChange={(value) => handleSelectChange(value, 'type')}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div classNameName="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      type="text"
                      value={newTransaction.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div classNameName="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      type="text"
                      value={newTransaction.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div classNameName="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newTransaction.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div classNameName="space-y-2">
                    <Label htmlFor="account_id">Account</Label>
                    <Select
                      value={newTransaction.account_id}
                      onValueChange={(value) => handleSelectChange(value, 'account_id')}
                    >
                      <SelectTrigger id="account_id">
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                    <Button type="submit">Add Transaction</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            {loading ? (
              <div>Loading transactions...</div>
            ) : (
              <DataTable columns={columns} data={transactions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}