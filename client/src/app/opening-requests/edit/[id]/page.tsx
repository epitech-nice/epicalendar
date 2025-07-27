"use client";

import {useCallback, useEffect, useState} from 'react'
import { useParams, useRouter } from 'next/navigation'
import { OpeningRequest, OpeningRequestsService, OpeningRequestUpdate } from '@/services/openingRequestsService'
import { useAuth } from '@/contexts/authContext'
import Link from "next/link";
import Loading from "@/components/loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



export default function ManageOpeningRequestsEditId() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const { user, loading, isAuthenticated } = useAuth()

    const [openingRequest, setOpeningRequest] = useState<OpeningRequest | null>(null)
    const [formData, setFormData] = useState<OpeningRequestUpdate | null>(null);
    const [responseLoading, setResponseLoading] = useState(false)
    const [error, setError] = useState('')



    const fetchOpeningRequest = useCallback(async () => {
        try {
            const openingRequestData = await OpeningRequestsService.getOpeningRequestById(id);
            openingRequestData.date = new Date(openingRequestData.date);
            openingRequestData.open = new Date(openingRequestData.open);
            openingRequestData.close = new Date(openingRequestData.close);
            setOpeningRequest(openingRequestData)
            if (formData === null) {
                setFormData({
                    date: new Date(openingRequestData.date),
                    open: new Date(openingRequestData.open),
                    close: new Date(openingRequestData.close),
                    message: openingRequestData.message,
                    status: openingRequestData.status,
                    response: openingRequestData.response || '',
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching the opening request.');
        }
    }, [formData, id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (name: keyof OpeningRequest, value: Date | null) => {
        if (!value) return;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseLoading(true);
        setError('');

        const finalFormData: OpeningRequestUpdate = {};
        for (const key in formData) {
            const originalValue = openingRequest ? openingRequest[key as keyof OpeningRequest] : undefined;
            const newValue = formData[key as keyof OpeningRequestUpdate];

            const isDate = newValue instanceof Date && originalValue instanceof Date;
            const areDatesEqual = isDate && newValue.getTime() === originalValue.getTime();
            if (newValue !== undefined && newValue !== null && newValue !== '' &&
            (!isDate ? (newValue !== originalValue) : !areDatesEqual)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                finalFormData[key as keyof OpeningRequestUpdate] = newValue as OpeningRequestUpdate[typeof key];
            }
        }

        try {
            //console.log(finalFormData);
            await OpeningRequestsService.updateOpeningRequest(id, finalFormData);
            router.push('/opening-requests');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred while updating the opening request.');
        } finally {
            setResponseLoading(false);
        }
    };



    useEffect(() => {
        if (!id) {
            setError('Opening request ID is required.')
            return
        }

        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        if (!user || user.role === 'student') {
            setError('You do not have permission to access this page.');
            return;
        }

        fetchOpeningRequest()
    }, [fetchOpeningRequest, id, isAuthenticated, loading, router, user])



    let content = null;

    if (loading) {
        content = (
            <Loading/>
        )

    } else {
        content = openingRequest ? (
            <form onSubmit={handleSubmit}>
                <div>
                    <em>
                        <b>ID:</b>
                        {openingRequest._id}
                    </em>

                    <em>
                        <b>Created at:</b>
                        {openingRequest.created_at ?
                            new Date(openingRequest.created_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : 'unknown date' }
                    </em>

                    <em>
                        <b>Created by:</b>
                        {openingRequest.account}
                    </em>
                </div>

                <div>
                    <label htmlFor="date">
                        Date
                    </label>
                    <DatePicker
                        selected={formData?.date}
                        onChange={(date) => handleDateChange("date", date)}
                        dateFormat="dd-MM-yyyy"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="open">
                        Campus opens at
                    </label>
                    <DatePicker
                        selected={formData?.open}
                        onChange={(date) => handleDateChange("open", date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Open"
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        required
                    />
                    <label htmlFor="close">
                        Campus closes at
                    </label>
                    <DatePicker
                        selected={formData?.close}
                        onChange={(date) => handleDateChange("close", date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Close"
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="message">
                        Message
                    </label>
                    <input
                        type="text"
                        id="message"
                        name="message"
                        value={formData?.message}
                        onChange={handleChange}
                        placeholder="Why do you want to open the campus?"
                    />
                </div>

                <div>
                    <label htmlFor="status">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData?.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="waiting">Waiting</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="response">
                        Response
                    </label>
                    <input
                        type="text"
                        id="response"
                        name="response"
                        value={formData?.response}
                        onChange={handleChange}
                        placeholder="Response to the opening request"
                    />
                </div>

                {error && (
                    <div>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={responseLoading}
                >
                    {responseLoading ? 'Updating...' : 'Update opening request'}
                </button>
            </form>
        ) : null
    }



    return (
        <main>
            <h1>
                Opening requests - Edit opening request
            </h1>

            {content}

            <Link href="/opening-requests">
                ← Back to opening requests
            </Link>
        </main>
    )
}
