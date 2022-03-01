export const displayMemberQuantity = (memberQuantity: number) =>
  memberQuantity === 1 ? `1 Mitglied` : `${memberQuantity} Mitglieder`

export const displayHistoryQuantity = (historyQuantity: number) =>
  historyQuantity === 1 ? `1 Eintrag` : `${historyQuantity} Einträge`

export const isDark = (theme: 'dark' | 'white') => theme === 'dark'
