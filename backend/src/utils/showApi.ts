import { showsApiSecret, showsApiUrl } from '@config'
import { ExternalApiError } from '@errors/customErrors'

let cachedToken: string | null = null
let tokenExpiresAt: number = 0

const oneDayMs = 24 * 60 * 60 * 1000
const thirtyDaysMs = 30 * oneDayMs

export const getShowsApiToken = async (): Promise<string> => {
  const now = Date.now()

  if (cachedToken && tokenExpiresAt > now + oneDayMs) {
    return cachedToken
  }

  const response = await fetch(`${showsApiUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: showsApiSecret }),
  })

  if (!response.ok) {
    throw new ExternalApiError('Failed to authenticate with external API')
  }

  const { data } = (await response.json()) as { data: { token: string } }

  cachedToken = data.token
  tokenExpiresAt = now + thirtyDaysMs

  return cachedToken
}
