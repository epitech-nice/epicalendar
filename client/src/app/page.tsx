"use client";

import {Day, DaysService} from "@/services/daysService";
import {fr} from "date-fns/locale/fr";
import {Calendar, dateFnsLocalizer, Views} from "react-big-calendar";
import {format as formatDate, format} from "date-fns/format";
import {parse} from "date-fns/parse";
import {startOfWeek} from "date-fns/startOfWeek";
import {getDay} from "date-fns/getDay";
import {useCallback, useEffect, useState} from "react";
import {Account, AccountsService} from "@/services/accountsService";
import 'react-big-calendar/lib/css/react-big-calendar.css';



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
    const [error, setError] = useState<string>('');

    const formats = {
        timeGutterFormat: (date: Date) => formatDate(date, 'HH:mm'),
        eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${formatDate(start, 'HH:mm')} – ${formatDate(end, 'HH:mm')}`,
        dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${formatDate(start, 'dd/MM/yyyy')} - ${formatDate(end, 'dd/MM/yyyy')}`,
    };



    const fetchAers = useCallback(async () => {
        try {
            const aersData = await AccountsService.getAers();
            setAers(aersData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching the aers.')
        }
    }, []);

    useEffect(() => {
        const fetchDay = async () => {
            try {
                const day = await DaysService.getCurrentDay();

                if (!day) {
                    setError('The campus is closed today.');
                    return;
                }

                setDay(day);
                const formattedEvents: Event[] = [];

                formattedEvents.push({
                    title: 'Campus open',
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
                    title: 'AER guard',
                    start: startGuard,
                    end: endGuard,
                    resource: day,
                });

                setEvents(formattedEvents);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred while fetching day.');
            }
        }

        fetchDay();
        fetchAers();
    }, [fetchAers]);



    if (error) {
        return (
            <main>
                <div className="error">
                    {error}
                </div>
            </main>
        )
    }

    return (
        <main>
            {day && (
                <div>
                    {day.end && new Date(day.end) < new Date(Date.now()) ? (
                        <h1>Campus was closed at {formatDate(new Date(day.end), 'HH:mm')}</h1>
                    ) : (
                        <h1>Campus is open until {formatDate(new Date(day.close), 'HH:mm')}</h1>
                    )}
                </div>
            )}

            { day && day.message && (
                <div>
                    {day.message}
                </div>
            )}

            <div>
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
                />
            </div>

            <div>
                <h2>AERs for guard</h2>
                {aers.length > 0 ? (
                    aers.map(aer => (day?.aers?.includes(aer._id as string) && (
                        <div key={aer._id} className="aer">
                            <div>
                                { /* Je peux pas faire de balise Image next parce que sa pu et qu'il faut autoriser le lien dans le next config */ }
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={aer.photo || '/default-user.jpg'} alt="User Photo"/>
                            </div>

                            <div>
                                {aer.first_name} {aer.last_name}
                            </div>

                            <div>
                                <a href={`mailto:${aer.email}`}>{aer.email}</a>
                            </div>

                            <div>
                                {aer.description}
                            </div>

                            <div>
                                <b>Preferred room:</b> {aer.room || 'Not specified'}
                            </div>
                        </div>
                    )))
                ) : (
                    <p>No AERs assigned.</p>
                )}
            </div>
        </main>
    );
}
