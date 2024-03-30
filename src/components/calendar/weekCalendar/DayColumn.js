import React from 'react';

export function DayColumn({date, hours, cellStyles}) {
  const mStyles = {
    flex: 1,
    padding: '0px',
    ...cellStyles,
  }
    return (
      <div className="day-column">
        <div className="header">{date.toISOString().split('T')[0]}</div>
        <div className="hours">
            {hours.map(hour => (
                <div key={hour} style={mStyles}>
                </div>  
            ))}
        </div>
        
      </div>
    );
  }