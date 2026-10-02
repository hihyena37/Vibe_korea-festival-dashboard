import { Link, NavLink } from 'react-router-dom'
import '../styles/header.css'

const NAV_ITEMS = [
  { to: '/festivals', label: '전국축제' },
  { to: '/calendar', label: '캘린더' },
  { to: '/favorites', label: '관심축제' },
]

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner container">
        <Link to="/" className="header__logo" aria-label="FESTIVAL NOW 홈">
          FESTIVAL <span>NOW</span>
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="header__nav">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `header__link${isActive ? ' is-active' : ''}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
