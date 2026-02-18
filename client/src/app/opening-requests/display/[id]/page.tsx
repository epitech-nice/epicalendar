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
import Loading from "@/components/ui/loading.component";

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
        content = <div className="error-message">{error}</div>;
    } else {
        content = openingRequest ? (
            <div>
                <div className="card">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "1.25rem",
                        }}
                    >
                        <div>
                            <h2 className="section-title" style={{ margin: 0 }}>
                                {new Date(
                                    openingRequest.date,
                                ).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </h2>
                            <span
                                className={`badge ${openingRequest.status === "accepted" ? "badge-success" : openingRequest.status === "rejected" ? "badge-error" : "badge-neutral"}`}
                                style={{
                                    marginTop: "0.5rem",
                                    display: "inline-block",
                                }}
                            >
                                {openingRequest.status}
                            </span>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            {user?.role !== "student" && (
                                <button
                                    className="btn btn-secondary btn-sm"
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
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                    handleDeleteOpeningRequest(
                                        openingRequest._id!,
                                    )
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {user?.role !== "student" && (
                        <div
                            style={{
                                marginBottom: "1.25rem",
                                padding: "0.75rem",
                                background:
                                    "rgb(var(--color-background-secondary))",
                                borderLeft:
                                    "3px solid rgb(var(--color-border))",
                            }}
                        >
                            <div className="info-row">
                                <span className="info-label">ID</span>
                                <span
                                    className="info-value"
                                    style={{
                                        fontFamily: "monospace",
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    {openingRequest._id}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Created at</span>
                                <span className="info-value">
                                    {openingRequest.created_at
                                        ? new Date(
                                              openingRequest.created_at,
                                          ).toLocaleDateString("fr-FR", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "Unknown date"}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Submitted by</span>
                                <span className="info-value">
                                    {openingRequest.account}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="form-row-2">
                        <div className="info-row">
                            <span className="info-label">Campus opens at</span>
                            <span className="info-value">
                                {openingRequest.open
                                    ? new Date(
                                          openingRequest.open,
                                      ).toLocaleTimeString("fr-FR", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : "Not set"}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Campus closes at</span>
                            <span className="info-value">
                                {openingRequest.close
                                    ? new Date(
                                          openingRequest.close,
                                      ).toLocaleTimeString("fr-FR", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : "Not set"}
                            </span>
                        </div>
                    </div>

                    <div className="info-row" style={{ marginTop: "0.75rem" }}>
                        <span className="info-label">Message</span>
                        <span className="info-value">
                            {openingRequest.message}
                        </span>
                    </div>

                    {openingRequest.status !== "waiting" && (
                        <div className="info-row">
                            <span className="info-label">Response</span>
                            <span className="info-value">
                                {openingRequest.response ||
                                    "No response provided."}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        ) : null;
    }

    return (
        <div className="page-wrapper">
            <div className="page-container">
                <div className="page-header">
                    <div className="page-header-left">
                        <Link href="/opening-requests" className="back-link">
                            ← Back to opening requests
                        </Link>
                        <h1 className="page-title">Request Details</h1>
                    </div>
                </div>

                {content}
            </div>
        </div>
    );
}
