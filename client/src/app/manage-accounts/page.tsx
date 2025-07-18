"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import { Account, AccountService } from '@/services/accountsService';



export default function ManagerAccounts() {
    const { user, loading, isAuthenticated } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [error, setError] = useState('');
    const router = useRouter();



    const fetchAccounts = async () => {
        try {
            console.log(await AccountService.getAccounts());
            setAccounts(await AccountService.getAccounts());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching accounts.');
        }
    };

    const handleDeleteAccount = async (accountId: string) => {
        console.log('Attempting to delete account with ID:', accountId);

        if (!confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
            return;
        }

        try {
            await AccountService.deleteAccount(accountId);
            fetchAccounts();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while deleting the account.');
        }
    };



    useEffect(() => {
        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user && user.role !== 'admin') {
            setError('You do not have permission to access this page.');
            return;
        }

        fetchAccounts();
    }, [isAuthenticated, loading, user, router]);



    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }



    return (
        <main>
            <h1>Manage Accounts</h1>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map(account => (
                        <tr key={account._id}>
                            <td>{account.email}</td>
                            <td>{account.first_name}</td>
                            <td>{account.last_name}</td>
                            <td>{account.role}</td>
                            <td>
                                <button onClick={() => router.push(`/manager-accounts/edit/${account._id}`)}>Edit</button>
                                <button onClick={() => handleDeleteAccount(account._id!)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}