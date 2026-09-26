/**
 * Format timestamp into time of day (e.g., "10:45 AM")
 */
export function formatMessageTime(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}

/**
 * Group conversations into relative time categories: Today, Yesterday, Previous 7 Days, Older
 */
export function groupConversationsByDate(conversations) {
  const groups = {
    today: [],
    yesterday: [],
    previous7Days: [],
    older: []
  };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOf7Days = new Date(startOfToday);
  startOf7Days.setDate(startOf7Days.getDate() - 7);

  conversations.forEach(conv => {
    const d = new Date(conv.updatedAt || conv.createdAt || Date.now());
    if (d >= startOfToday) {
      groups.today.push(conv);
    } else if (d >= startOfYesterday) {
      groups.yesterday.push(conv);
    } else if (d >= startOf7Days) {
      groups.previous7Days.push(conv);
    } else {
      groups.older.push(conv);
    }
  });

  return [
    { title: 'Today', items: groups.today },
    { title: 'Yesterday', items: groups.yesterday },
    { title: 'Previous 7 Days', items: groups.previous7Days },
    { title: 'Older', items: groups.older }
  ].filter(group => group.items.length > 0);
}
