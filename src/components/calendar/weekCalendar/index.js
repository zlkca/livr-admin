import React from 'react';
import { useState, useEffect } from 'react';
import '../styles.css';
import { DayColumn } from './DayColumn';
import { TimeColumn } from './TimeColumn';
import { Event } from './Event';
import { getCurrentWeekDates, getNextWeekDates, getPrevWeekDates, getEventPosition } from '../utils';

export function WeekCalendar({ events, onNextWeek, onPrevWeek }) {
    const [dates, setDates] = useState([]);

    useEffect(() => {
        const dates = getCurrentWeekDates();
        setDates(dates);
    }, []);

    const handleNextWeek = () => {
        const ds = getNextWeekDates(dates);
        setDates(ds);
        onNextWeek(ds);
    }

    const handlePrevWeek = () => {
        const ds = getPrevWeekDates(dates);
        setDates(ds);
        onPrevWeek(ds);
    }

    const hours = [];
    for (let i = 8; i <= 20; i++) {
        hours.push(i);
    }

    return (
        <div className="root">
            <div>
                <button onClick={handlePrevWeek}>Prev Week</button>
                <button onClick={handleNextWeek}>Next Week</button>
            </div>
            <div className="calendar-grid">
                <TimeColumn
                    title="Time/Date"
                    hours={hours}
                    cellStyles={{
                        width: 160,
                        height: 80,
                        borderBottom: '1px solid #ddd'
                    }}
                />
                <div className="week">
                    {dates.map(date => {
                        return (
                            <DayColumn
                                cellStyles={{
                                    width: 160,
                                    height: 80,
                                    borderBottom: '1px solid #ddd'
                                }}
                                key={date}
                                date={date}
                                hours={hours}
                            // events={getEventsForDate(date)} 
                            />
                        )
                    })}
                    {dates && events && events.length > 0 && events.map(event => {
                        return (
                            <Event
                                styles={{ ...getEventPosition(event, 160, 80, 40, 8), backgroundColor: event.color }}
                                data={event}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    );


}
