const BASE =
  import.meta.env.VITE_N8N_BASE_URL ||
  'https://n8n-service-igq5.onrender.com/webhook'

async function call(path, body, timeoutMs = 90_000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${BASE}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`n8n error ${res.status}: ${text.substring(0, 200)}`)
    }
    return res.json()
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out. n8n may be cold-starting — try again in 30s.')
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export const n8nService = {
  /**
   * Generate a 7-day content plan for a given week.
   * @param {object} body - { weekStartDate, previousPosts, goals, currentFollowers }
   */
  generateWeek: (body) => call('instagram-content-calendar', body),

  /**
   * Analyse the previous week's performance and return insights.
   * @param {object} body - { weekLabel, posts: [{...post, stats}] }
   */
  weeklyReview: (body) => call('instagram-weekly-review', body, 120_000),

  /**
   * Audit content diversity over the last 4 weeks.
   * @param {object} body - { posts: [...], goals: [...] }
   */
  contentAudit: (body) => call('instagram-content-audit', body, 120_000),

  /**
   * Improve a rough caption idea into polished on-brand copy.
   * @param {object} body - { idea, pillar, postType }
   */
  optimizeCaption: (body) => call('instagram-caption-optimizer', body),

  /**
   * Generate a 30-day community growth strategy.
   * @param {object} body - { currentFollowers, goals, topPillars, recentEngagementRate }
   */
  communityStrategy: (body) => call('instagram-community-strategy', body, 120_000),
}
