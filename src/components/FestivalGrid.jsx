import FestivalCard from './FestivalCard'

export default function FestivalGrid({ festivals, today, variant = 'default' }) {
  return (
    <div className={`festival-grid${variant === 'compact' ? ' festival-grid--compact' : ''}`}>
      {festivals.map((festival) => (
        <FestivalCard key={festival.id} festival={festival} today={today} variant={variant} />
      ))}
    </div>
  )
}
