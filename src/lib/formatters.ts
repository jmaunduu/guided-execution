// Utility functions for formatting numbers, dates, and currency for Kenyan context

/**
 * Format amount in KES with smart abbreviation
 * 1240000 → "1.2M"
 * 45000 → "45K"
 * 850 → "850"
 */
export function formatKES(amount: number, showFull = false): string {
  if (showFull) {
    return amount.toLocaleString('en-KE');
  }
  
  if (Math.abs(amount) >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B`;
  }
  if (Math.abs(amount) >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1000) {
    return `${Math.round(amount / 1000)}K`;
  }
  return amount.toLocaleString('en-KE');
}

/**
 * Format amount with full KES suffix
 */
export function formatKESFull(amount: number): string {
  return `${amount.toLocaleString('en-KE')} KES`;
}

/**
 * Format percentage with + or - sign
 */
export function formatPercentage(value: number, decimals = 1): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format date in Kenyan format (DD/MM/YYYY)
 */
export function formatDateKE(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-KE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format date short (e.g., "Dec 22")
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Format date for display in table (e.g., "Dec\n22")
 */
export function formatDateStacked(dateString: string): { month: string; day: string } {
  const date = new Date(dateString);
  return {
    month: date.toLocaleDateString('en-KE', { month: 'short' }),
    day: date.getDate().toString(),
  };
}

/**
 * Get relative time (e.g., "2 days ago", "5 days late")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 0) return `${diffDays} days ago`;
  if (diffDays === -1) return 'Tomorrow';
  return `In ${Math.abs(diffDays)} days`;
}

/**
 * Get days overdue/until due
 */
export function getDaysFromDue(dueDate: string): { days: number; label: string; isOverdue: boolean } {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = now.getTime() - due.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0) {
    return { days: diffDays, label: `${diffDays} days late`, isOverdue: true };
  } else if (diffDays === 0) {
    return { days: 0, label: 'Due today', isOverdue: false };
  } else {
    return { days: Math.abs(diffDays), label: `Due in ${Math.abs(diffDays)} days`, isOverdue: false };
  }
}

/**
 * Safely handle null/undefined/NaN values
 */
export function safeNumber(value: number | null | undefined, fallback: string = '—'): string {
  if (value == null || isNaN(value) || !isFinite(value)) {
    return fallback;
  }
  return formatKES(value);
}
