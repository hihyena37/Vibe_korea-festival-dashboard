import { useState } from 'react'

// 이 글자 수를 넘는 긴 설명만 접어서 보여준다.
const COLLAPSE_THRESHOLD = 320

// 정리된 일반 텍스트(줄바꿈 포함)를 표시. HTML은 렌더링하지 않는다.
export default function ExpandableText({ text, id }) {
  const [expanded, setExpanded] = useState(false)
  const collapsible = text.length > COLLAPSE_THRESHOLD
  const collapsed = collapsible && !expanded

  return (
    <div className="expandable-text">
      <p id={id} className={`expandable-text__body${collapsed ? ' is-collapsed' : ''}`}>
        {text}
      </p>
      {collapsible && (
        <button
          type="button"
          className="expandable-text__toggle"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? '접기' : '더보기'}
        </button>
      )}
    </div>
  )
}
