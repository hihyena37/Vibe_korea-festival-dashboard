import { REGIONS } from '../data/regions'
import { inputValueToYmd, ymdToInputValue } from '../utils/date'
import { PERIOD_OPTIONS, STATUS_OPTIONS } from '../utils/festivalFilter'
import SearchBar from './SearchBar'
import '../styles/filter.css'

function SegmentedControl({ label, options, value, onSelect }) {
  return (
    <div className="filter-group" role="group" aria-label={label}>
      <span className="filter-group__label">{label}</span>
      <div className="segmented">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`segmented__item${value === option.value ? ' is-active' : ''}`}
            aria-pressed={value === option.value}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function FilterBar({ filters, onChange, onReset, canReset, onQueryComposingChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__top">
        <SearchBar
          value={filters.query}
          onChange={(query) => onChange({ query })}
          onComposingChange={onQueryComposingChange}
        />
        <label className="filter-select">
          <span className="filter-group__label">지역</span>
          <select value={filters.region} onChange={(event) => onChange({ region: event.target.value })}>
            <option value="all">전체 지역</option>
            {REGIONS.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-bar__row">
        <SegmentedControl
          label="기간"
          options={PERIOD_OPTIONS}
          value={filters.period}
          onSelect={(period) => onChange({ period })}
        />
        <SegmentedControl
          label="상태"
          options={STATUS_OPTIONS}
          value={filters.status}
          onSelect={(status) => onChange({ status })}
        />
        {canReset && (
          <button type="button" className="filter-bar__reset" onClick={onReset}>
            필터 초기화
          </button>
        )}
      </div>

      {filters.period === 'custom' && (
        <div className="filter-dates">
          <label className="filter-dates__field">
            <span>시작일</span>
            <input
              type="date"
              value={ymdToInputValue(filters.from)}
              onChange={(event) => onChange({ from: inputValueToYmd(event.target.value) })}
            />
          </label>
          <span className="filter-dates__sep" aria-hidden="true">
            ~
          </span>
          <label className="filter-dates__field">
            <span>종료일</span>
            <input
              type="date"
              value={ymdToInputValue(filters.to)}
              onChange={(event) => onChange({ to: inputValueToYmd(event.target.value) })}
            />
          </label>
          <p className="filter-dates__hint">선택한 기간에 하루라도 진행되는 축제를 보여줍니다.</p>
        </div>
      )}
    </div>
  )
}
