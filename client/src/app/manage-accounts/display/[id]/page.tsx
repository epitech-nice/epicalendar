'use client'

import {useCallback, useEffect, useState} from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AccountService, Account } from '@/services/accountsService'
import { useAuth } from '@/contexts/authContext'
import Link from "next/link";
import Image from "next/image";



export default function ManageAccountsDisplayId() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const { user, loading, isAuthenticated } = useAuth()

    const [account, setAccount] = useState<Account | null>(null)
    const [error, setError] = useState<string | null>(null)



    const fetchAccount = useCallback(async () => {
        try {
            setError(null)
            const accountData = await AccountService.getAccountById(id)
            setAccount(accountData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching the account.')
        }
    }, [id])

    const handleDeleteAccount = async (accountId: string) => {
        console.log('Attempting to delete account with ID:', accountId);

        if (!confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
            return;
        }

        try {
            await AccountService.deleteAccount(accountId);
            router.push('/manage-accounts');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while deleting the account.');
        }
    };



    useEffect(() => {
        if (!id) {
            setError('Account ID is required.')
            return
        }

        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        if (!user || (user && user.role !== 'admin')) {
            setError('You do not have permission to access this page.');
            return;
        }

        fetchAccount()
    }, [fetchAccount, id, isAuthenticated, loading, router, user])



    if (loading) {// TODO: faire un composant de chargement
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }



    return (
        <main>
            <table><tbody>
                <tr>
                    <td colSpan={2}>
                        <Image src={account?.photo || '/default-user.jpg'} alt="User Photo"/>
                    </td>
                </tr>

                <tr>
                    <td>
                        <button onClick={() => router.push(`/manage-accounts/edit/${account?._id}`)}>
                            Edit
                        </button>
                    </td>
                    <td>
                        {account && (
                            <button onClick={() => handleDeleteAccount(account._id!)}>
                                Delete
                            </button>
                        )}
                    </td>
                </tr>

                <tr>
                    <td>
                        <em>
                            <b>ID:</b>
                            <p>{account?._id}</p>
                        </em>
                    </td>
                    <td>
                        <em>
                            <b>Created at:</b>
                            <p>{account?.created_at ?
                                new Date(account?.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : 'unknown date' }</p>
                        </em>
                    </td>
                </tr>

                <tr>
                    <td colSpan={2}>
                        <p>{account?.first_name} {account?.last_name}</p>
                    </td>
                </tr>

                <tr>
                    <td colSpan={2}>
                        <a href={`mailto:${account?.email}`}>{account?.email}</a>
                    </td>
                </tr>

                <tr>
                    <td colSpan={2}>
                        <b>Total guard time:</b>
                        <p>{account?.guard_time
                            ? `${Math.floor(account.guard_time / 60)} hours ${account.guard_time % 60} minutes`
                            : 'No guard time recorded'}</p>
                    </td>
                </tr>

                <tr>
                    <td colSpan={2}>
                        <b>description</b>
                        <p>{account?.description || 'No description provided.'}</p>
                    </td>
                </tr>

                <tr>
                    <td>
                        <b>Preferred room:</b>
                        <p>{account?.room || 'No preferred room set.'}</p>
                    </td>
                    <td>
                        <b>Preferred day:</b>
                        <p>{account?.day || 'No preferred day set.'}</p>
                    </td>
                </tr>
            </tbody></table>

            <Link href="/manage-accounts">
                ← Back to accounts
            </Link>
        </main>
    )
}
