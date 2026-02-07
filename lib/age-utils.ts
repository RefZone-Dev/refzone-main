/**
 * Calculate age from a date of birth string (YYYY-MM-DD).
 * Returns null if DOB is invalid or missing.
 */
export function calculateAge(dateOfBirth: string | null | undefined): number | null {
  if (!dateOfBirth) return null
  const dob = new Date(dateOfBirth)
  if (Number.isNaN(dob.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age
}

/**
 * Check if a user is under 16 based on their date of birth.
 * Returns true if under 16, false if 16 or older.
 * Returns false if DOB is not available (gives benefit of the doubt for legacy users).
 */
export function isUnder16(dateOfBirth: string | null | undefined): boolean {
  const age = calculateAge(dateOfBirth)
  if (age === null) return false
  return age < 16
}
