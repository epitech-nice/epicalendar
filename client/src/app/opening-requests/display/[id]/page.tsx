/**
 * @file page.tsx
 * @brief 
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import {
    OpeningRequestsService,
    OpeningRequest,
} from "@/services/opening-requests.service";
import { useAuth } from "@/contexts/auth.context";
import Link from "next/link";
import Loading from "@/components/loading.components";

export default function ManageOpeningRequestsDisplayId() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { user, loading, isAuthenticated } = useAuth();

    const [openingRequest, setOpeningRequest] = useState<OpeningRequest | null>(
        null,
    );
    const [error, setError] = useState("");

    const fetchOpeningRequest = useCallback(async () => {
        try {
            const openingRequestData =
                await OpeningRequestsService.getOpeningRequestById(id);
            setOpeningRequest(openingRequestData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching the opening request.",
            );
        }
    }, [id]);

    const handleDeleteOpeningRequest = async (openingRequestId: string) => {
        console.log(
            "Attempting to delete opening request with ID:",
            openingRequestId,
        );

        if (
            !confirm(
                "Are you sure you want to delete this opening request? This action cannot be undone.",
            )
        ) {
            return;
        }

        try {
            await OpeningRequestsService.deleteOpeningRequest(openingRequestId);
            router.push("/opening-requests");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while deleting the opening request.",
            );
        }
    };

    useEffect(() => {
        if (!id) {
            setError("Opening request ID is required.");
            return;
        }

        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (!user) {
            setError("You do not have permission to access this page.");
            return;
        }

        fetchOpeningRequest();

        if (
            openingRequest !== null &&
            user.role === "student" &&
            openingRequest.account !== user.email
        ) {
            setError("You do not have permission to access this page.");
            return;
        }
    }, [
        fetchOpeningRequest,
        id,
        isAuthenticated,
        loading,
        openingRequest,
        router,
        user,
    ]);

    let content = null;

    if (loading) {
        content = <Loading />;
    } else if (error) {
        content = <div className="error">{error}</div>;
    } else {
        content = openingRequest ? (
            <div>
                {user?.role !== "student" && (
                    <div>
                        <em>
                            <b>ID:</b>
                            {openingRequest._id}
                        </em>

                        <em>
                            <b>Created at:</b>
                            {openingRequest.created_at
                                ? new Date(
                                      openingRequest.created_at,
                                  ).toLocaleDateString("fr-FR", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                  })
                                : "unknown date"}
                        </em>

                        <em>
                            <b>Created by:</b>
                            {openingRequest.account}
                        </em>
                    </div>
                )}

                <div>
                    {new Date(openingRequest.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })}
                </div>

                <div>
                    <b>Status:</b>
                    {openingRequest.status}
                </div>

                <div>
                    {user?.role !== "student" && (
                        <button
                            onClick={() =>
                                router.push(
                                    `/opening-requests/edit/${openingRequest?._id}`,
                                )
                            }
                        >
                            Edit
                        </button>
                    )}

                    <button
                        onClick={() =>
                            handleDeleteOpeningRequest(openingRequest._id!)
                        }
                    >
                        Delete
                    </button>
                </div>

                <div>
                    <b>Campus opens at:</b>
                    {openingRequest.open
                        ? new Date(openingRequest.open).toLocaleTimeString(
                              "fr-FR",
                              {
                                  hour: "2-digit",
                                  minute: "2-digit",
                              },
                          )
                        : "Not set"}
                    <b>Campus closes at:</b>
                    {openingRequest.close
                        ? new Date(openingRequest.close).toLocaleTimeString(
                              "fr-FR",
                              {
                                  hour: "2-digit",
                                  minute: "2-digit",
                              },
                          )
                        : "Not set"}
                </div>

                <div>
                    <b>Message:</b>
                    {openingRequest.message}
                </div>

                {openingRequest.status !== "waiting" && (
                    <div>
                        <b>Response:</b>
                        {openingRequest.response || "No response provided."}
                    </div>
                )}
            </div>
        ) : null;
    }

    return (
        <main>
            <h1 className="page-title">Opening requests - Display</h1>

            {content}

            <Link href="/opening-requests">← Back to opening requests</Link>
        </main>
    );
}
