const N8N_INSTAGRAM_CALENDAR_URL =
  import.meta.env.VITE_N8N_INSTAGRAM_CALENDAR_URL ||
  'https://n8n-service-igq5.onrender.com/webhook/instagram-content-calendar'

class InstagramPlanService {
  async fetchWeeklyPlan() {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60_000)

    try {
      const response = await fetch(N8N_INSTAGRAM_CALENDAR_URL, {
        method: 'GET',
        signal: controller.signal,
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(
          `Calendar fetch error ${response.status}: ${text.substring(0, 200)}`
        )
      }

      const data = await response.json()
      return data
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Calendar request timed out. Please try again.')
      }
      throw err
    } finally {
      clearTimeout(timeout)
    }
  }
}

const instagramPlanService = new InstagramPlanService()
export default instagramPlanService
