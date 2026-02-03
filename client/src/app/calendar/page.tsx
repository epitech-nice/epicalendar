/**
 * @file page.tsx
 * @brief 
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

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
                const days = await DaysService.getDays();
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
            <main>
                <div className="error">{error}</div>
            </main>
        );
    }

    return (
        <main>
            <h1 className="page-title">Opening Calendar</h1>

            <Calendar
                localizer={localizer}
                events={events}
                defaultView={Views.WEEK}
                views={[Views.DAY, Views.WEEK]} //Views.MONTH ne marche pas
                startAccessor="start"
                endAccessor="end"
                formats={formats}
                eventPropGetter={(event) => {
                    const backgroundColor =
                        event.title === "AER guard"
                            ? "var(--color-epitech)"
                            : "#00FF90";
                    return {
                        style: {
                            backgroundColor,
                            borderRadius: "0.5rem",
                            color: "var(--foreground)",
                            border: "none",
                            padding: "0.5rem",
                        },
                    };
                }}
            />
        </main>
    );
}
