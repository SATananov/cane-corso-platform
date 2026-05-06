interface PublicOwnerBadgeProps {
  displayName: string;
  avatarUrl?: string | null;
  compact?: boolean;
}

function getInitials(displayName: string) {
  const parts = displayName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  if (parts[0]) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return 'USG';
}

export function PublicOwnerBadge({ displayName, avatarUrl, compact = false }: PublicOwnerBadgeProps) {
  return (
    <span className={`public-owner-badge${compact ? ' public-owner-badge--compact' : ''}`}>
      <span className="public-owner-badge__avatar" aria-hidden="true">
        {avatarUrl ? <img src={avatarUrl} alt="" loading="lazy" decoding="async" /> : <span>{getInitials(displayName)}</span>}
      </span>
      <strong>{displayName}</strong>
    </span>
  );
}
