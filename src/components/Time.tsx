import { useEffect, useState } from 'react'
import { dayjs } from '@utils/dayjs'
import React from 'react'

const now = () => dayjs().tz()

const events = {
  christmas: [25, 12],
  newYear: [1, 1],
  birthday: [12, 29],
}


const Time = () => {
  const [date, setDate] = useState(now())

  const currentEvent = Object.entries(events)
  .filter(([, value]: [string, number[]]) => value[0] === date.date() && value[1] === date.month() + 1)
  .flat()[0] as string;

  useEffect(() => {
    const timer = setInterval(() => setDate(now()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <p className="inline">
      {date.format('dddd, MMMM Do, YYYY • hh:mm:ss A')}{' '}
      {currentEvent && (
        <span className="font-bold">
          —{' '}
          {
            {
              christmas: 'Merry Christmas!',
              newYear: 'Happy New Year!',
              birthday: 'Happy Birthday to me!',
            }[currentEvent]
          }
        </span>
      )}
    </p>
  )
}

export default Time