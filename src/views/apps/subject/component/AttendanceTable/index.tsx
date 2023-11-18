import React from 'react'

// Sample data
const students = ['John', 'Jane', 'Steve', 'Emily', 'Paul', 'Sara']
const today = new Date()

const AttendanceTable = () => {
  const getWorkingDaysOfMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const workingDays = []
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      // Check if the day is between Monday (1) and Friday (5)
      if (date.getDay() >= 1 && date.getDay() <= 5) {
        workingDays.push(day)
      }
    }
    return workingDays
  }
  const getWeeksOfMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const weeks = []
    let week = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      if (date.getDay() >= 1 && date.getDay() <= 5) {
        week.push(day)
      }
      if (date.getDay() === 5 || day === daysInMonth) {
        if (week.length) weeks.push(week)
        week = []
      }
    }

    return weeks
  }

  return (
    <div className='dynamic-table'>
      <div className='students-sidebar'>
        {students.map((student, index) => (
          <div key={index}>{student}</div>
        ))}
      </div>
      <div className='months-table'>
        <table>
          <thead>
            <tr>
              <th>Students/Month</th>
              {Array.from({ length: 12 }, (_, index) => (
                <th key={index}>{new Date(0, index).toLocaleString('default', { month: 'long' })}</th>
              ))}
            </tr>
            <tr>
              <th></th>
              {Array.from({ length: 12 }, (_, monthIndex) => (
                <th key={monthIndex} style={{ display: 'flex' }}>
                  {getWeeksOfMonth(today.getFullYear(), monthIndex).map((week, weekIndex) => (
                    <div key={weekIndex} style={{ border: '2ps solid #c00' }}>
                      {week.map(day => (
                        <span
                          key={day}
                          className={today.getDate() === day && today.getMonth() === monthIndex ? 'highlighted' : ''}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  ))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student}>
                <td>{student}</td>
                {Array.from({ length: 12 }, (_, monthIndex) => (
                  <td key={monthIndex}>
                    {getWorkingDaysOfMonth(today.getFullYear(), monthIndex).map(day => (
                      <span
                        key={day}
                        className={today.getDate() === day && today.getMonth() === monthIndex ? 'highlighted' : ''}
                      >
                        {day}
                      </span>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AttendanceTable
