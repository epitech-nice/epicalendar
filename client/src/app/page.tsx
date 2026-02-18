/**
 * @file page.tsx
 * @brief
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { Day, DaysService } from "@/services/days.service";
import { fr } from "date-fns/locale/fr";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format as formatDate, format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { useCallback, useEffect, useRef, useState } from "react";
import { Account, AccountsService } from "@/services/accounts.service";

interface Event {
    title: string;
    start: Date;
    end: Date;
    resource: Day;
}

const locales = {
    fr: fr,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

export default function Home() {
    const [aers, setAers] = useState<Account[]>([]);
    const [day, setDay] = useState<Day | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState<string>("");
    const calendarCardRef = useRef<HTMLDivElement>(null);

    // Resize the calendar card so it always ends 32px above the bottom of the viewport,
    // even when an alert-info banner is present (which shifts the card downward).
    useEffect(() => {
        const updateHeight = () => {
            const el = calendarCardRef.current;
            if (!el) return;
            const top = el.getBoundingClientRect().top;
            const height = window.innerHeight - top - 32;
            el.style.setProperty("--calendar-height", `${Math.max(200, height)}px`);
            el.style.height = `${Math.max(200, height)}px`;
        };
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    });  // runs after every render so it reacts to alert appearing/disappearing

    const formats = {
        timeGutterFormat: (date: Date) => formatDate(date, "HH:mm"),
        eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${formatDate(start, "HH:mm")} – ${formatDate(end, "HH:mm")}`,
        dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${formatDate(start, "dd/MM/yyyy")} - ${formatDate(end, "dd/MM/yyyy")}`,
    };

    const fetchAers = useCallback(async () => {
        try {
            const aersData = await AccountsService.getAers();
            setAers(aersData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching the aers.",
            );
        }
    }, []);

    useEffect(() => {
        const fetchDay = async () => {
            try {
                const day = await DaysService.getCurrentDay();

                if (!day) {
                    setError("The campus is closed today.");
                    return;
                }

                setDay(day);
                const formattedEvents: Event[] = [];

                formattedEvents.push({
                    title: "Campus open",
                    start: new Date(day.open),
                    end: new Date(day.close),
                    resource: day,
                });

                const startGuard = new Date(day.start);
                const endGuard = new Date(day.end ?? day.close);
                if (endGuard < startGuard) {
                    endGuard.setHours(23, 59, 59, 999);
                }
                formattedEvents.push({
                    title: "AER guard",
                    start: startGuard,
                    end: endGuard,
                    resource: day,
                });

                setEvents(formattedEvents);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "An error occurred while fetching day.",
                );
            }
        };

        fetchDay();
        fetchAers();
    }, [fetchAers]);

    if (error) {
        return (
            <main className="page-wrapper">
                <div className="page-container">
                    <div className="error-message">{error}</div>
                </div>
            </main>
        );
    }

    return (
        <main className="page-wrapper home-page">
            <div className="page-container home-page-container">
                {/* Campus Status Banner */}
                {day ? (
                    <div
                        className={`campus-status-banner ${day.end && new Date(day.end) < new Date(Date.now()) ? "status-closed" : "status-open"}`}
                    >
                        <div>
                            <div className="campus-status-label">
                                Campus Status
                            </div>
                            {day.end &&
                            new Date(day.end) < new Date(Date.now()) ? (
                                <div className="campus-status-time">
                                    Closed at{" "}
                                    {formatDate(new Date(day.end), "HH:mm")}
                                </div>
                            ) : (
                                <div className="campus-status-time">
                                    Open until{" "}
                                    {formatDate(new Date(day.close), "HH:mm")}
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}

                {day?.message && (
                    <div
                        className="alert-info"
                        style={{ marginBottom: "1.5rem" }}
                    >
                        {day.message}
                    </div>
                )}

                {/* Main content: Calendar + AERs side by side */}
                <div className="home-main-grid">
                    {/* Calendar Section */}
                    <div className="home-calendar-col">
                        <h2 className="section-title">Today&#39;s Schedule</h2>
                        <div ref={calendarCardRef} className="card home-calendar-card">
                            <Calendar
                                localizer={localizer}
                                events={events}
                                defaultView={Views.DAY}
                                views={[Views.DAY]}
                                startAccessor="start"
                                endAccessor="end"
                                date={new Date()}
                                toolbar={false}
                                onNavigate={() => {}}
                                formats={formats}
                                step={60}
                                timeslots={1}
                                scrollToTime={(() => {
                                    if (events.length === 0)
                                        return new Date(new Date().setHours(7, 0, 0, 0));
                                    const earliest = events.reduce(
                                        (min, e) => e.start < min ? e.start : min,
                                        events[0].start
                                    );
                                    const scroll = new Date(earliest);
                                    scroll.setHours(Math.max(0, earliest.getHours() - 1), 0, 0, 0);
                                    // Never scroll before 07:00
                                    const floor = new Date(new Date().setHours(7, 0, 0, 0));
                                    return scroll < floor ? floor : scroll;
                                })()}
                                eventPropGetter={(event) => {
                                    const backgroundColor =
                                        event.title === "AER guard"
                                            ? "rgb(var(--color-primary))"
                                            : "rgb(var(--color-success))";
                                    return {
                                        style: {
                                            backgroundColor,
                                            borderRadius: "0",
                                            color: "#ffffff",
                                            border: "none",
                                            padding: "0.5rem 0.75rem",
                                            fontFamily:
                                                "'IBM Plex Sans', sans-serif",
                                            fontSize: "0.85rem",
                                            fontWeight: 500,
                                        },
                                    };
                                }}
                            />
                        </div>
                    </div>

                    {/* AERs Section */}
                    <div className="home-aers-col">
                        <h2 className="section-title">AERs on Guard</h2>
                        {aers.length > 0 ? (
                            <div className="aer-grid-vertical">
                                {aers.map(
                                    (aer) =>
                                        day?.aers?.includes(aer._id as string) && (
                                            <div key={aer._id} className="aer-card-row">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={aer.photo || "/default-user.jpg"}
                                                    alt={`${aer.first_name} ${aer.last_name}`}
                                                    className="profile-avatar"
                                                />
                                                <div className="aer-card-info">
                                                    <div className="aer-name">
                                                        {aer.first_name} {aer.last_name}
                                                    </div>
                                                    <a href={`mailto:${aer.email}`} className="aer-email">
                                                        {aer.email}
                                                    </a>
                                                    {aer.room && (
                                                        <div className="aer-detail">📍 {aer.room}</div>
                                                    )}
                                                    {aer.description && (
                                                        <div className="aer-detail">{aer.description}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                )}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">👤</div>
                                <p>No AERs assigned for today.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
