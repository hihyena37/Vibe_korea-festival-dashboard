import { formatDateLabel, WEEKDAYS } from '../utils/calendar'
import '../styles/states.css'
import '../styles/calendar.css'

const WEEKEND_CLASS = { 0: ' is-sunday', 6: ' is-saturday' }

// 월 달력 grid. 날짜별 축제 수는 상위에서 계산한 calendarMap을 받아 표시만 한다.
// minDate 이전 날짜는 축제 데이터 제공 범위 밖이므로 선택할 수 없다.
export default function FestivalCalendar({ days, calendarMap, selectedDate, today, minDate, onSelectDate }) {
  return (
    <div className="calendar">
      <div className="calendar__weekdays" aria-hidden="true">
        {WEEKDAYS.map((label, i) => (
          <span key={label} className={`calendar__weekday${WEEKEND_CLASS[i] ?? ''}`}>
            {label}
          </span>
        ))}
      </div>

      <div className="calendar__grid">
        {days.map(({ ymd, day, weekday, inMonth }) => {
          const count = calendarMap[ymd]?.length ?? 0
          const isSelected = ymd === selectedDate
          const isToday = ymd === today
          const isDisabled = ymd < minDate
          const className = [
            'calendar__day',
            WEEKEND_CLASS[weekday] ?? '',
            inMonth ? '' : ' is-outside',
            isToday ? ' is-today' : '',
            isSelected ? ' is-selected' : '',
          ].join('')

          return (
            <button
              key={ymd}
              type="button"
              className={className}
              disabled={isDisabled}
              aria-pressed={isSelected}
              aria-current={isToday ? 'date' : undefined}
              aria-label={`${formatDateLabel(ymd)}${isToday ? ', 오늘' : ''}, ${
                isDisabled ? '일정 정보 제공 범위 밖' : `진행 중인 축제 ${count}개`
              }`}
              onClick={() => onSelectDate(ymd)}
            >
              <span className="calendar__date">
                <span className="calendar__num">{day}</span>
                {isToday && <span className="calendar__today">오늘</span>}
              </span>
              {count > 0 && !isDisabled && (
                <span className="calendar__count">
                  <span className="calendar__dot" aria-hidden="true" />
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function CalendarSkeleton() {
  return (
    <div className="calendar" aria-hidden="true">
      <div className="calendar__weekdays">
        {WEEKDAYS.map((label) => (
          <span key={label} className="calendar__weekday">
            {label}
          </span>
        ))}
      </div>
      <div className="calendar__grid">
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} className="calendar__day calendar__day--skeleton skeleton" />
        ))}
      </div>
    </div>
  )
}
