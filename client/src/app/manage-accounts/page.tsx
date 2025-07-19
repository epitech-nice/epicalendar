"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import { Account, AccountService } from '@/services/accountsService';



export default function ManageAccounts() {
    const router = useRouter();

    const { user, loading, isAuthenticated } = useAuth();

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [error, setError] = useState('');



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

        if (!user || (user && user.role !== 'admin')) {
            setError('You do not have permission to access this page.');
            return;
        }

        fetchAccounts();
    }, [isAuthenticated, loading, user, router]);



    if (loading) {// TODO: faire un composant de chargement
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }



    return (
        <main>
            <h1>Manage Accounts</h1>
            <button onClick={() => router.push(`/manage-accounts/add`)}>
                Add new account
            </button>
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
                        <tr key={account._id} onClick={() => router.push(`/manage-accounts/display/${account._id}`)} style={{ cursor: 'pointer' }}>
                            <td>{account.email}</td>
                            <td>{account.first_name}</td>
                            <td>{account.last_name}</td>
                            <td>{account.role}</td>
                            <td>
                                <button onClick={() => router.push(`/manage-accounts/edit/${account._id}`)}>Edit</button>
                                <button onClick={() => handleDeleteAccount(account._id!)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
