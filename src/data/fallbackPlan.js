// Static fallback plan shown when the n8n webhook is unavailable (cold start / offline).
const fallbackPlan = {
  weekLabel: 'Sample Week',
  weekStartDate: '2026-04-07',
  weeklyPlan: [
    {
      dayNumber: 1,
      date: '2026-04-07',
      dayName: 'Monday',
      pillar: 'morning-anchor',
      postType: 'Feed Post',
      visualConcept:
        'Flat lay of an open notebook with a few handwritten lines, an uncapped pen resting across the page, and a small ceramic cup of black coffee on a linen surface. Soft morning window light from the left. No hands visible.',
      caption:
        'The first ten minutes don\'t need to be productive. They need to be yours. A notebook. Something warm to drink. No phone yet. That\'s the whole ritual. What does your morning anchor look like?',
      hashtags: [
        '#morningroutine',
        '#intentionalliving',
        '#slowmorning',
        '#tinyhabits',
        '#habitbuilding',
        '#productivemorning',
        '#mindfulmorning',
        '#tinytweaks',
      ],
      bestTimeToPost: '7:30am',
    },
    {
      dayNumber: 2,
      date: '2026-04-08',
      dayName: 'Tuesday',
      pillar: 'tiny-step',
      postType: 'Reel',
      visualConcept:
        'Close-up of a hand-written habit tracker on grid paper. Seven days across the top, a single habit row. Six boxes already ticked with a satisfying X, the seventh box waiting. Pen hovering near it. Warm lamp light.',
      caption:
        'One box. That\'s all it is. Not a transformation. Not a new identity. Just one box, ticked again. The streak is built one day at a time — and today is just today. What\'s the one thing you\'re ticking off tonight?',
      hashtags: [
        '#habittracker',
        '#tinyhabits',
        '#consistency',
        '#slowprogress',
        '#onepercentbetter',
        '#dailyhabits',
        '#habitbuilding',
        '#tinytweaks',
      ],
      bestTimeToPost: '12:00pm',
    },
    {
      dayNumber: 3,
      date: '2026-04-09',
      dayName: 'Wednesday',
      pillar: 'ordered-space',
      postType: 'Story',
      visualConcept:
        'A tidy desk corner: one notebook closed, one pen, one small plant in a terracotta pot, a glass of water. Nothing else on the surface. Natural daylight. Top-down flat lay composition.',
      caption:
        'Your environment is always saying something. A clear surface says: this is a place for thinking. You don\'t need a redesign — you need five minutes and a decision about what stays. What would you remove from your desk right now?',
      hashtags: [
        '#minimalistdesk',
        '#orderedspace',
        '#declutter',
        '#intentionalliving',
        '#clearliving',
        '#minimalismlifestyle',
        '#tinytweaks',
        '#slowliving',
      ],
      bestTimeToPost: '7:00pm',
    },
    {
      dayNumber: 4,
      date: '2026-04-10',
      dayName: 'Thursday',
      pillar: 'gratitude-discipline',
      postType: 'Feed Post',
      visualConcept:
        'Open journal showing a simple list: three short lines written in a clean handwriting style. Beside it, a dried flower pressed between the pages. Soft warm light. Slightly overhead angle.',
      caption:
        'Gratitude doesn\'t feel like much on a hard day. That\'s exactly when it matters most. Three things. One sentence each. No commentary required. It\'s not about feeling grateful — it\'s about practising it.',
      hashtags: [
        '#gratitudepractice',
        '#journaling',
        '#dailygratitude',
        '#intentionalliving',
        '#morningpages',
        '#mindfulness',
        '#tinytweaks',
        '#slowliving',
      ],
      bestTimeToPost: '7:30am',
    },
    {
      dayNumber: 5,
      date: '2026-04-11',
      dayName: 'Friday',
      pillar: 'slow-progress',
      postType: 'Feed Post',
      visualConcept:
        'Simple line graph on graph paper showing a gentle upward slope over 30 days — hand-drawn, imperfect, real. A pencil resting beside it. Warm side light. The line isn\'t steep, but it\'s steady.',
      caption:
        'Day 47 doesn\'t look like much. Neither does day 48. But somewhere around day 90, you stop counting and start living it. Progress that lasts isn\'t dramatic. It\'s just not quitting on the boring days.',
      hashtags: [
        '#slowprogress',
        '#consistency',
        '#longterm',
        '#tinyhabits',
        '#habitbuilding',
        '#growthmindset',
        '#tinytweaks',
        '#progressnotperfection',
      ],
      bestTimeToPost: '12:00pm',
    },
    {
      dayNumber: 6,
      date: '2026-04-12',
      dayName: 'Saturday',
      pillar: 'service-ordinary',
      postType: 'Reel',
      visualConcept:
        'A set dinner table for two: simple white plates, folded napkins, a small candle, a glass of water each. Warm evening light. Viewed from slightly above. No food yet — just the act of preparation.',
      caption:
        'Setting the table before someone arrives is a small act of love. It says: I thought of you before you got here. The ordinary acts of care — the ones no one photographs — are often the most faithful. Who are you setting the table for tonight?',
      hashtags: [
        '#serviceintheordinary',
        '#slowliving',
        '#intentionalliving',
        '#ordinarymoments',
        '#homeliving',
        '#warmhome',
        '#tinytweaks',
        '#faithfulsmallthings',
      ],
      bestTimeToPost: '7:00pm',
    },
    {
      dayNumber: 7,
      date: '2026-04-13',
      dayName: 'Sunday',
      pillar: 'rest-discipline',
      postType: 'Story',
      visualConcept:
        'A bedside table in dim light: a closed book with a bookmark, a glass of water, and a phone placed face-down. The phone is off. A bedside lamp glows softly. Clean, intentional, restful.',
      caption:
        'The phone goes face-down at 9pm. It\'s not a rule. It\'s a boundary you keep with yourself. Rest isn\'t what happens when you finally run out of energy — it\'s what you choose to protect. What does your wind-down look like?',
      hashtags: [
        '#restdiscipline',
        '#sleephygiene',
        '#intentionalrest',
        '#digitalwellness',
        '#screenfreeroutine',
        '#slowevening',
        '#tinytweaks',
        '#mindfulnighttime',
      ],
      bestTimeToPost: '8:00pm',
    },
  ],
}

export default fallbackPlan
