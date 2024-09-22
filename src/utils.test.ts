import { describe, expect, it } from 'vitest'
import { decodeJWT, formatDateMMDDYYYY } from './utils'

describe('utils.ts', () => {
  it('decodeJWT method decodes a JWT token', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    const decoded = decodeJWT(token)
    expect(decoded.sub).toBe('1234567890')
    expect(decoded.name).toBe('John Doe')
    expect(decoded.iat).toBe(1516239022)
  })

  it('formatDateMMDDYYYY method formats a date to MM/DD/YYYY', () => {
    const date = new Date('2021-01-01')
    const formatted = formatDateMMDDYYYY(date)
    expect(formatted).toBe('1/1/2021')
  })

  // test formatDateMMDDYYYY with a string input
  it('formatDateMMDDYYYY method formats a string date to MM/DD/YYYY', () => {
    const date = '2021-01-01'
    const formatted = formatDateMMDDYYYY(date)
    expect(formatted).toBe('1/1/2021')
  })

  // test formatDateMMDDYYYY with no input
  it('formatDateMMDDYYYY method returns a formatted date for today if no string or date object is provided', () => {
    const formatted = formatDateMMDDYYYY()
    const expected = new Date().toLocaleDateString('en-US', { timeZone: 'UTC' })
    // const expected = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`
    expect(formatted).toBe(expected)
    expect(formatted).toBeTypeOf('string')
  })
})