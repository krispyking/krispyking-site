interface Props {
  generatedAt: string
  rowCount: number
}

export default function DataBadge({ generatedAt, rowCount }: Props) {
  const date = new Date(generatedAt)
  const formatted = Number.isNaN(date.getTime())
    ? generatedAt
    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-border bg-bg-card/60 px-4 py-1.5 text-xs text-text-secondary">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
      <span>
        <span className="text-text-primary font-medium">{rowCount.toLocaleString()}</span> technologies tracked
      </span>
      <span className="text-border">·</span>
      <span>Data exported {formatted}</span>
    </div>
  )
}
