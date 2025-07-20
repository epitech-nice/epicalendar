'use client'

import {useCallback, useEffect, useState} from 'react'
import { useAuth } from '@/contexts/authContext'
import Link from "next/link";
import Loading from "@/components/loading";
import {ProfileService} from "@/services/profileService";
import {useRouter} from "next/navigation";
import {Account} from "@/services/accountsService";
import EditAccount from "@/components/editAccount";



export default function ProfileEdit() {
    const router = useRouter()

    const { user, loading, isAuthenticated } = useAuth()

    const [account, setAccount] = useState<Account | null>(null)
    const [error, setError] = useState<string | null>(null)



    const fetchAccount = useCallback(async () => {
        try {
            setError(null)
            const accountData = await ProfileService.getProfile()
            setAccount(accountData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching the account.')
        }
    }, [])



    useEffect(() => {
        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        if (!user || (user && user.role === 'student')) {
            setError('You do not have permission to access this page.');
            return;
        }

        fetchAccount()
    }, [fetchAccount, isAuthenticated, loading, router, user])



    let content = null;

    if (loading) {
        content = (
            <Loading/>
        )

    } else if (error) {
        content = (
            <div className="error">
                {error}
            </div>
        )

    } else {
        content = account ? (
            <EditAccount account={account} profile={true}/>
        ) : null
    }



    return (
        <main>
            <h1>
                Edit profile
            </h1>

            {content}

            <Link href="/">
                ← Back to profile
            </Link>
        </main>
    )
}
