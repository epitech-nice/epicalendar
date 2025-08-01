'use client'

import {useState} from 'react'
import {useRouter} from "next/navigation";
import {useAuth} from "@/contexts/authContext";
import {Account, AccountsService} from "@/services/accountsService";



export default function DisplayAccount({ account, profile } : { account: Account, profile?: boolean }) {
    const router = useRouter()

    const { user, loading } = useAuth()

    const [error, setError] = useState('')



    const handleDeleteAccount = async (accountId: string) => {
        console.log('Attempting to delete account with ID:', accountId);

        if (!confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
            return;
        }

        try {
            await AccountsService.deleteAccount(accountId);
            router.push('/manage-accounts');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while deleting the account.');
        }
    };



    if (loading) {
        return;
    }

    if (error) {
        return (
            <div className="error">
                {error}
            </div>
        );
    }



    return (
        <div>
            <div>
                { /* Je peux pas faire de balise Image next parce que sa pu et qu'il faut autoriser le lien dans le next config */ }
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={account?.photo || '/default-user.jpg'} alt="User Photo"/>
            </div>

            <div>
                {profile ? (
                    <button onClick={() => router.push('/profile/edit')}>
                        Edit
                    </button>
                ) : (
                    <button onClick={() => router.push(`/manage-accounts/edit/${account?._id}`)}>
                        Edit
                    </button>
                )}

                {account && !profile && (
                    <button onClick={() => handleDeleteAccount(account._id!)}>
                        Delete
                    </button>
                )}
            </div>

            { user?.role === 'admin' && (
                <div>
                    <em>
                        <b>ID:</b>
                        {account?._id}
                    </em>

                    <em>
                        <b>Created at:</b>
                        {account?.created_at ?
                            new Date(account?.created_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : 'unknown date' }
                    </em>
                </div>
            )}

            <div>
                {account?.first_name} {account?.last_name}
            </div>

            <div>
                <a href={`mailto:${account?.email}`}>{account?.email}</a>
            </div>

            <div>
                <b>Role:</b>
                {account?.role ? account.role.toUpperCase() : 'No role assigned'}
                <b>Total guard time:</b>
                {!account?.guard_time ?
                    'No guard time recorded' :
                    <table>
                        <thead>
                            <tr>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                                <th>Saturday</th>
                                <th>Sunday</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>{account?.guard_time?.monday || '0h'}</td>
                                <td>{account?.guard_time?.tuesday || '0h'}</td>
                                <td>{account?.guard_time?.wednesday || '0h'}</td>
                                <td>{account?.guard_time?.thursday || '0h'}</td>
                                <td>{account?.guard_time?.friday || '0h'}</td>
                                <td>{account?.guard_time?.saturday || '0h'}</td>
                                <td>{account?.guard_time?.sunday || '0h'}</td>
                                <td>{account?.guard_time ? account.guard_time.total : '0h'}</td>
                            </tr>
                        </tbody>
                    </table>
                }
            </div>

            <div>
                <b>description</b>
                {account?.description || 'No description provided.'}
            </div>

            <div>
                <b>Preferred day:</b>
                {account?.day || 'No preferred day set.'}


                <b>Preferred room:</b>
                {account?.room || 'No preferred room set.'}
            </div>
        </div>
    )
}