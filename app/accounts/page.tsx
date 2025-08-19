'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useCurrency } from '@/lib/currency-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { IconPlus, IconCreditCard, IconWallet, IconPigMoney, IconEdit, IconTrash, IconTrendingUp } from '@tabler/icons-react';
import { toast } from 'sonner';

interface Account {
  id: string;
  user_id: string;
  name: string;
  type?: 'checking' | 'savings' | 'credit' | 'investment';
  balance?: number;
  created_at: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'checking' as Account['type'],
    balance: 0,
  });

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load accounts';
      setError(errorMessage);
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('User not authenticated');
      return;
    }
    
    try {
      const { data, error } = await supabase.from('accounts').insert([{
        name: newAccount.name,
        type: newAccount.type,
        balance: newAccount.balance,
        user_id: user.id
      }]);

      if (error) {
        // Check if error is due to missing columns
        if (error.message.includes('balance') || error.message.includes('type')) {
          toast.error('Database needs to be updated. Please run the migration script.');
          console.error('Database schema error:', error);
          return;
        }
        throw error;
      }

      toast.success('Account created successfully');
      setShowCreateForm(false);
      setNewAccount({
        name: '',
        type: 'checking',
        balance: 0,
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('Failed to create account');
    }
  };

  const handleEditAccount = async (account: Account, updatedData: Partial<Account>) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('accounts')
        .update(updatedData)
        .eq('id', account.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Account updated successfully');
      setEditingAccount(null);
      fetchAccounts();
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account');
    }
  };

  const handleDeleteAccount = async (account: Account) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', account.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Account deleted successfully');
      setDeletingAccount(null);
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return <IconWallet className="h-5 w-5" />;
      case 'savings':
        return <IconPigMoney className="h-5 w-5" />;
      case 'credit':
        return <IconCreditCard className="h-5 w-5" />;
      case 'investment':
        return <IconTrendingUp className="h-5 w-5" />;
      default:
        return <IconWallet className="h-5 w-5" />;
    }
  };

  const getAccountColor = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return 'bg-blue-100 text-blue-800';
      case 'savings':
        return 'bg-green-100 text-green-800';
      case 'credit':
        return 'bg-orange-100 text-orange-800';
      case 'investment':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground">
              Manage your financial accounts
            </p>
          </div>
        </div>
        <div className="px-4 lg:px-6">
          <div className="text-center">Loading accounts...</div>
        </div>
      </div>
    );
  }

  if (error && error.includes('balance')) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground">
              Manage your financial accounts
            </p>
          </div>
        </div>
        <div className="px-4 lg:px-6">
          <Card className="p-6 border-orange-200 bg-orange-50">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-orange-800">Database Update Required</h3>
              <p className="text-orange-700 mb-4">
                The accounts table needs to be updated to support account types and balances.
              </p>
              <p className="text-sm text-orange-600">
                Please run the migration script in <code>migrations/add_accounts_columns.sql</code> in your Supabase dashboard.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your financial accounts
          </p>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Your Accounts</h2>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <IconPlus className="h-4 w-4 mr-2" />
            {showCreateForm ? 'Cancel' : 'Add Account'}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Account Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Main Checking"
                      value={newAccount.name}
                      onChange={(e) =>
                        setNewAccount({ ...newAccount, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Account Type</Label>
                    <Select
                      value={newAccount.type}
                      onValueChange={(value) =>
                        setNewAccount({ ...newAccount, type: value as Account['type'] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance">Initial Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newAccount.balance}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card key={account.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getAccountColor(account.type || 'checking')}`}>
                    {getAccountIcon(account.type || 'checking')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{account.name}</h3>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {account.type || 'checking'}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditingAccount(account)}>
                    <IconEdit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeletingAccount(account)}>
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{formatCurrency(account.balance || 0)}</p>
                <p className="text-sm text-muted-foreground">
                  Current Balance
                </p>
              </div>
            </Card>
          ))}
        </div>

        {accounts.length === 0 && !showCreateForm && (
          <Card className="p-12 text-center">
            <div className="mb-4">
              <IconWallet className="h-12 w-12 mx-auto text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No accounts yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first account to start tracking your finances
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <IconPlus className="h-4 w-4 mr-2" />
              Add Your First Account
            </Button>
          </Card>
        )}
      </div>

      {/* Edit Account Dialog */}
      <Dialog open={!!editingAccount} onOpenChange={() => setEditingAccount(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update your account information
            </DialogDescription>
          </DialogHeader>
          {editingAccount && (
            <EditAccountForm
              account={editingAccount}
              onSave={(updatedData) => handleEditAccount(editingAccount, updatedData)}
              onCancel={() => setEditingAccount(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={!!deletingAccount} onOpenChange={() => setDeletingAccount(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingAccount?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingAccount(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deletingAccount && handleDeleteAccount(deletingAccount)}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Account Form Component
function EditAccountForm({ 
  account, 
  onSave, 
  onCancel 
}: { 
  account: Account; 
  onSave: (data: Partial<Account>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: account.name,
    type: account.type || 'checking',
    balance: account.balance || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Account Name</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-type">Account Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as 'checking' | 'savings' | 'credit' | 'investment' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">Checking</SelectItem>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="credit">Credit Card</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="edit-balance">Balance</Label>
          <Input
            id="edit-balance"
            type="number"
            step="0.01"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  );
}
