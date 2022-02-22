export const displayMemberQuantity = (memberQuantity: number) =>
  memberQuantity === 1 ? `${memberQuantity} Mitglied` : `${memberQuantity} Mitglieder`

export const displayHistoryQuantity = (historyQuantity: number) =>
  historyQuantity === 1 ? `${historyQuantity} Eintrag` : `${historyQuantity} Einträge`
