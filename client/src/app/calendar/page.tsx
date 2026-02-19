/**
 * @file page.tsx
 * @brief
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { useEffect, useState } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { DayResponse, DaysService } from "@/services/days.service";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { fr } from "date-fns/locale/fr";
import { getDay } from "date-fns/getDay";
import { format } from "date-fns/format";
import { useEffect, useState } from "react";
import { format as formatDate } from "date-fns";
import { startOfWeek } from "date-fns/startOfWeek";
import { Day, DaysService } from "@/services/days.service";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";

interface Event {
    title: string;
    start: Date;
    end: Date;
    resource: DayResponse;
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

export default function CalendarPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState<string>("");

    const formats = {
        timeGutterFormat: (date: Date) => formatDate(date, "HH:mm"),
        eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${formatDate(start, "HH:mm")} – ${formatDate(end, "HH:mm")}`,
        dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${formatDate(start, "dd/MM/yyyy")} - ${formatDate(
                end,
                "dd/MM/yyyy",
            )}`,
    };

    useEffect(() => {
        const fetchDays = async () => {
            try {
                const days = await DaysService.getAllDays();
                const formattedEvents: Event[] = [];

                for (const day of days) {
                    formattedEvents.push({
                        title: "Campus open",
                        start: new Date(day.open),
                        end: new Date(day.close),
                        resource: day,
                    });

                    let startGuard = new Date(day.start);
                    let endGuard = new Date(day.end ?? day.close);
                    if (endGuard < startGuard) {
                        endGuard.setHours(23, 59, 59, 999);
                    }
                    formattedEvents.push({
                        title: "AER guard",
                        start: startGuard,
                        end: endGuard,
                        resource: day,
                    });
                    endGuard = new Date(day.end ?? day.close);
                    if (endGuard < startGuard) {
                        endGuard = new Date(
                            endGuard.getTime() + 24 * 60 * 60 * 1000,
                        );
                        startGuard = new Date(
                            startGuard.getTime() + 24 * 60 * 60 * 1000,
                        );
                        startGuard.setHours(0, 0, 0, 0);
                        formattedEvents.push({
                            title: "AER guard",
                            start: startGuard,
                            end: endGuard,
                            resource: day,
                        });
                    }
                }

                setEvents(formattedEvents);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "An error occurred while fetching days.",
                );
            }
        };

        fetchDays();
    }, []);

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
        <main className="page-wrapper">
            <div className="page-container">
                <div className="page-header">
                    <div className="page-header-left">
                        <h1 className="page-title">Opening Calendar</h1>
                        <p className="page-subtitle">Campus opening schedule</p>
                    </div>
                </div>

                <div className="card" style={{ padding: "0" }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        defaultView={Views.WEEK}
                        views={[Views.DAY, Views.WEEK]}
                        startAccessor="start"
                        endAccessor="end"
                        formats={formats}
                        scrollToTime={(() => {
                            if (events.length === 0)
                                return new Date(
                                    new Date().setHours(7, 0, 0, 0),
                                );
                            const earliest = events.reduce(
                                (min, e) => (e.start < min ? e.start : min),
                                events[0].start,
                            );
                            const scroll = new Date(earliest);
                            scroll.setHours(
                                Math.max(0, earliest.getHours() - 1),
                                0,
                                0,
                                0,
                            );
                            // Never scroll before 07:00
                            const floor = new Date(
                                new Date().setHours(7, 0, 0, 0),
                            );
                            return scroll < floor ? floor : scroll;
                        })()}
                        style={{ height: 600 }}
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
                                    padding: "0.4rem 0.6rem",
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    fontSize: "0.82rem",
                                    fontWeight: 500,
                                },
                            };
                        }}
                    />
                </div>
            </div>
        </main>
    );
}
