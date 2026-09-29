/* ═══════════════════════════════════════════════════════════════
   Fitnpulse — WEB UI/UX Case Study · webcase-data.js
   Renders the real Fitnpulse web UI inside the browser frames.
   Every value is copied from the product's own data module
   (src/data.ts) and every class mirrors the real component tree
   (src/weblayout.tsx + src/webscreens.tsx + src/webauth.tsx), so the
   presentation shows the actual product, not a mock-up.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var C = {
    green: '#16A34A', lime: '#65A30D', cyan: '#0891B2', orange: '#EA580C',
    red: '#DC2626', purple: '#7C3AED', pink: '#DB2777'
  };

  var D = {
    brand: { name: 'FitPulse', tag: 'Track. Improve. Achieve.', copy: '© 2025 FitPulse Inc.' },
    nav: [
      { id: 'home', e: '🏠', l: 'Home' },
      { id: 'progress', e: '📊', l: 'Progress' },
      { id: 'community', e: '👥', l: 'Community' },
      { id: 'account', e: '👤', l: 'Account' }
    ],
    profile: { greet: 'Good Morning 👋', name: 'Ananya', avatar: '👩‍🦱', streak: '14 streak' },
    steps: 12847,
    delta: '↑ 28% vs yesterday',
    goalLabel: '128% Goal',
    week: [6200, 8100, 7400, 9800, 8600, 11200, 12847],
    weekLabels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    metrics: [
      { i: '❤️', l: 'Heart Rate', v: '72', u: 'BPM', s: 'Resting · Normal', c: C.red },
      { i: '🔥', l: 'Calories', v: '1,847', u: 'kcal', s: '482 remaining', c: C.orange },
      { i: '💧', l: 'Water', v: '1.8', u: 'L', s: 'Goal: 2.5L', c: C.cyan },
      { i: '😴', l: 'Sleep', v: '7.4', u: 'hrs', s: 'Deep 2.1h', c: C.purple },
      { i: '🧠', l: 'Stress', v: 'Low', u: '', s: 'Score 24/100', c: C.lime }
    ],
    insights: [
      'Great progress this week! Hit step goal 5 days in a row.',
      'Heart rate improved by 8% — cardio sessions are working!',
      'Consider a rest day — recovery maximizes muscle gains.'
    ],
    challenge: { title: '🏆 Weekly Challenge', name: '10,000 Steps Every Day', tag: '3 days left', pct: 72, who: '1,247 participants' },
    workout: { title: 'Start Workout', sub: 'Today: Upper body strength' },
    progressStats: [
      { i: '🏋️', l: 'Workouts', v: '24', u: '', s: '', c: C.green },
      { i: '📅', l: 'Active Days', v: '19/30', u: '', s: '', c: C.cyan },
      { i: '👟', l: 'Avg Steps', v: '9.8k', u: '', s: '', c: C.lime }
    ],
    weight: [74.2, 73.8, 73.1, 72.6, 72.0, 71.4, 71.0],
    weightLabels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'Now'],
    weightSub: 'Lost 3.2 kg this month',
    weightDelta: '↓ 3.2 kg',
    bmi: { label: 'BMI Score', v: '22.4', tag: 'Normal Weight', h: '178 cm', w: '71.0 kg' },
    monthly: {
      title: '✨ AI Monthly Summary',
      body: 'Outstanding month! 19/30 step goals hit, resting HR improved by 8 BPM, and 3.2kg lost. Cardio and strength both trending upward — keep it up! 💪',
      tag: 'Top 5% of users this month'
    },
    badges: [
      { i: '🔥', l: '100 Day Streak', on: 1 }, { i: '👟', l: '500K Steps', on: 1 },
      { i: '🏃', l: '50 Workouts', on: 1 }, { i: '💧', l: '30-Day Hydration', on: 0 },
      { i: '💪', l: 'Strength Master', on: 0 }, { i: '🧘', l: 'Zen Master', on: 0 }
    ],
    notifications: [
      { i: '🏆', t: 'Challenge Complete!', m: 'You finished the Weekly 70K Steps challenge.', w: '2m ago', c: C.orange },
      { i: '👥', t: 'Rahul liked your post', m: '"5K personal best" got 14 reactions!', w: '18m ago', c: C.green },
      { i: '🎯', t: 'Daily Goal Reached', m: 'You hit 10,000 steps today. Keep it up!', w: '1h ago', c: C.cyan },
      { i: '❤️', t: 'Heart Rate Alert', m: 'Resting HR improved: 72 → 68 BPM this week.', w: '3h ago', c: C.red }
    ],
    quick: [
      { i: '🍎', l: 'Log Meal' }, { i: '🏋️', l: 'Log Workout' }, { i: '💧', l: 'Add Water' }
    ],
    activityTabs: [
      { i: '👟', l: 'Steps' }, { i: '❤️', l: 'Heart' }, { i: '🔥', l: 'Calories' },
      { i: '😴', l: 'Sleep' }, { i: '🧠', l: 'Stress' }, { i: '💧', l: 'Water' }
    ],
    actSteps: [8200, 6100, 9800, 7400, 11200, 10400, 12847],
    actStepsLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    actStepSummary: [
      { l: 'Avg Daily', v: '9,840', c: C.green }, { l: 'Best Day', v: '14,200', c: C.lime }, { l: 'This Week', v: '65,947', c: C.cyan }
    ],
    actHeart: { label: 'Current', v: '72', u: 'BPM', tag: 'Normal Zone' },
    actHeartSummary: [
      { l: 'Resting', v: '58 BPM', c: C.green }, { l: 'Average', v: '72 BPM', c: C.red }, { l: 'Max Today', v: '142 BPM', c: C.orange }
    ],
    actCalories: [
      { i: '🍽️', l: 'Consumed', u: 'kcal', v: '1,847', c: C.orange },
      { i: '🔥', l: 'Burned', u: 'kcal', v: '682', c: C.green }
    ],
    nutrition: [
      { l: 'Carbs', v: '45%', c: C.orange }, { l: 'Protein', v: '30%', c: C.cyan }, { l: 'Fat', v: '25%', c: C.purple }
    ],
    actSleep: { label: 'Last Night', v: '7h 24m', tag: 'Good Sleep', bed: 'Bedtime 10:42 PM', woke: 'Woke 6:06 AM' },
    actSleepSummary: [
      { l: 'Deep Sleep', v: '2h 6m', c: C.purple }, { l: 'REM Sleep', v: '1h 36m', c: C.green }, { l: 'Sleep Score', v: '84/100', c: C.cyan }
    ],
    sleepStages: [
      { l: 'Light', v: 2.8, c: C.cyan }, { l: 'Deep', v: 2.1, c: C.purple },
      { l: 'REM', v: 1.6, c: C.green }, { l: 'Awake', v: 0.9, c: C.orange }
    ],
    actStress: { label: 'Current Stress Level', v: '24', tag: 'LOW STRESS', levels: ['Low', 'Moderate', 'High', 'Very High'], pct: 24 },
    meditation: { i: '🧘', t: 'Meditation Suggestion', s: '5-min breathing exercise · Tap to start' },
    water: { total: 8, start: 5, goal: 'of 2.0L daily goal' },
    community: {
      challenge: { title: 'Weekly 70K', d: 'Walk 70,000 steps between Monday and Sunday. Sync your tracker to earn the finisher badge!', reward: '🏆 Finisher Badge', end: '3d left', total: 70000, pct: 72, i: '🏃' },
      stats: [{ l: 'Steps', v: '50,430' }, { l: 'Streak', v: '12d' }, { l: 'Active min', v: '210' }],
      active: [
        { t: 'Weekly 70K', i: '👟', p: 72, e: '3d left', c: C.green },
        { t: 'Hydration Month', i: '💧', p: 54, e: '18d left', c: C.cyan }
      ],
      board: [
        { r: '🥇', e: '👩‍🦱', n: 'Ananya S.', s: '86,420', you: 0 },
        { r: '🥈', e: '🧑‍🦰', n: 'Rahul K.', s: '79,100', you: 0 },
        { r: '🥉', e: '👩‍🦳', n: 'Priya M.', s: '71,850', you: 0 },
        { r: '8️⃣', e: '🧑', n: 'You', s: '65,947', you: 1 }
      ],
      boardTag: 'This Week',
      feed: [
        { e: '🧑‍🦰', n: 'Rahul K.', w: '2h ago', m: 'Completed a 5K run in 28:30 🏃 Personal best!', l: 14 },
        { e: '👩‍🦳', n: 'Priya M.', w: '4h ago', m: 'Hit 100-day streak! 🔥 So proud of this milestone.', l: 42 },
        { e: '🧑‍🦱', n: 'Dev R.', w: '6h ago', m: 'New PR: Bench Press 100kg 💪 Strength is growing!', l: 28 }
      ]
    },
    workouts: {
      cats: [
        { i: '🏃', n: 'Running', k: '450 kcal', c: C.orange },
        { i: '🚶', n: 'Walking', k: '180 kcal', c: C.green },
        { i: '🚴', n: 'Cycling', k: '380 kcal', c: C.cyan },
        { i: '🧘', n: 'Yoga', k: '200 kcal', c: C.purple },
        { i: '🏋️', n: 'Strength', k: '320 kcal', c: C.red },
        { i: '⚡', n: 'HIIT', k: '580 kcal', c: C.pink }
      ],
      live: { t: '🏃 Running · Active', s: [{ l: 'Duration', v: '24:38' }, { l: 'Calories', v: '287 kcal' }, { l: 'Distance', v: '3.2 km' }, { l: 'Pace', v: '7.8/km' }] },
      recent: [
        { i: '🏃', n: 'Morning Run', w: 'Today 7:20 AM', k: '412 kcal', d: '38 min' },
        { i: '🏋️', n: 'Upper Body', w: 'Yesterday', k: '298 kcal', d: '52 min' },
        { i: '🧘', n: 'Yoga Flow', w: '2 days ago', k: '145 kcal', d: '30 min' }
      ]
    },
    account: {
      name: 'Ananya Sharma', email: 'ananya@fitpulse.app', avatar: '👩‍🦱', plan: '⭐ FitPulse Pro',
      stats: [{ v: '247', l: 'Workouts' }, { v: '100🔥', l: 'Day Streak' }, { v: '18', l: 'Badges' }],
      records: [
        { l: '5K Run', v: '28:30', i: '🏃', c: C.cyan },
        { l: 'Bench Press', v: '100kg', i: '💪', c: C.orange },
        { l: 'Workouts', v: '247', i: '🏋️', c: C.green },
        { l: 'Longest Streak', v: '42d', i: '🔥', c: C.red }
      ],
      /* `g` mirrors ACCOUNT_MENU.group / ACCOUNT_GROUPS in the product's
         data module — it is how the web Account route arranges the same
         entries into its four section cards. */
      menu: [
        { i: '✏️', l: 'Edit Profile', s: 'Update your information', c: C.green, g: 'Profile' },
        { i: '🎯', l: 'Goals & Progress', s: 'Track your milestones', c: C.cyan, g: 'Health & Fitness' },
        { i: '⌚', l: 'Device Sync', s: 'Manage connected devices', c: C.lime, g: 'Health & Fitness' },
        { i: '⭐', l: 'Subscription', s: 'FitPulse Pro · Active', c: C.orange, g: 'Subscription' },
        { i: '🏆', l: 'Personal Records', s: 'Your best performances', c: C.purple, g: 'Health & Fitness' },
        { i: '🔒', l: 'Privacy & Security', s: 'Manage your data', c: '#6B7280', g: 'Privacy & Security' },
        { i: '🚪', l: 'Sign Out', s: '', c: C.red, g: 'Privacy & Security' }
      ],
      groups: ['Profile', 'Health & Fitness', 'Subscription', 'Privacy & Security'],
      footer: 'FitPulse v3.2.1 · Member since Jan 2024'
    },
    settings: [
      {
        t: 'Preferences', items: [
          { i: '🔔', l: 'Push Notifications', s: 'Reminders & challenges', on: 1 },
          { i: '🔊', l: 'Sounds', s: 'Workout & achievement sounds', on: 1 },
          { i: '📳', l: 'Haptic Feedback', s: 'Vibration on interactions', on: 0 },
          { i: '🌙', l: 'Dark Mode', s: 'Currently disabled', on: 0 }
        ]
      },
      {
        t: 'Data & Privacy', items: [
          { i: '❤️', l: 'Health Integration', s: 'Sync with Apple / Google Health', on: 1 },
          { i: '🔄', l: 'Auto Backup', s: 'Backup data to cloud', on: 1 },
          { i: '🔐', l: 'Privacy Settings', s: 'Manage your data', on: 0 },
          { i: '🔒', l: 'Security', s: 'Biometrics & passcode', on: 0 }
        ]
      },
      {
        t: 'Support', items: [
          { i: '🌐', l: 'Language', s: 'English (US)', on: 0 },
          { i: '☁️', l: 'Backup & Restore', s: 'Manage your data backup', on: 0 },
          { i: '💬', l: 'Help & Support', s: 'FAQs and contact us', on: 0 },
          { i: 'ℹ️', l: 'About FitPulse', s: 'v3.2.1 · Legal & licenses', on: 0 }
        ]
      }
    ],
    goals: [
      { i: '⚖️', t: 'Lose Weight', s: 'Burn fat & slim down', c: C.orange },
      { i: '💪', t: 'Build Muscle', s: 'Gain strength & mass', c: C.cyan },
      { i: '🏃', t: 'Stay Active', s: '10k+ steps every day', c: C.green },
      { i: '❤️', t: 'Improve Cardio', s: 'Boost endurance', c: C.red },
      { i: '🥗', t: 'Healthy Lifestyle', s: 'Balanced wellness', c: C.purple }
    ],
    levels: [
      { i: '🌱', t: 'Beginner', c: C.lime },
      { i: '⚡', t: 'Intermediate', c: C.cyan },
      { i: '🔥', t: 'Advanced', c: C.orange }
    ]
  };
  /* ── tiny render helpers ──────────────────────────────────── */
  function tag(t, c) {
    return '<span class="fpw__tag" style="background:' + c + '18;color:' + c + ';border:1px solid ' + c + '35">' + t + '</span>';
  }
  function ico(e, c) {
    return 'style="background:' + c + '15;border:1px solid ' + c + '25"';
  }
  function logo(sz) {
    return '<div class="fpw__logo" style="width:' + sz + 'px;height:' + sz + 'px;flex-basis:' + sz + 'px">' +
      '<svg viewBox="0 0 48 48" width="' + (sz * 0.6) + '" height="' + (sz * 0.6) + '" fill="none">' +
      '<polyline points="6,26 11,26 14,17 18,35 22,20 26,26 32,26 38,26" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  }
  function metric(m, big) {
    return '<div class="fpw__metric"><div class="fpw__mico" ' + ico(m.i, m.c) + '>' + m.i + '</div>' +
      '<div class="fpw__mlabel">' + m.l + '</div>' +
      '<div class="fpw__mvalue' + (big ? ' fpw__mvalue--xl' : '') + '">' + m.v +
      (m.u ? '<span class="fpw__munit">' + m.u + '</span>' : '') + '</div>' +
      (m.s ? '<div class="fpw__msub">' + m.s + '</div>' : '') + '</div>';
  }
  function row(o) {
    return '<div class="fpw__row"><span class="fpw__rico" ' + ico(o.i, o.c) + '>' + o.i + '</span>' +
      '<span class="fpw__rbody"><span class="fpw__rlabel">' + o.n + '</span>' +
      (o.w ? '<span class="fpw__rsub">' + o.w + '</span>' : '') + '</span>' +
      '<span class="fpw__rright"><span class="fpw__rval" style="color:' + o.k + '">' + o.v + '</span>' +
      (o.d ? '<span class="fpw__rsub">' + o.d + '</span>' : '') + '</span></div>';
  }
  function bars(vals, labels, hot) {
    var max = Math.max.apply(null, vals), h = '';
    for (var i = 0; i < vals.length; i++) {
      h += '<figure><div class="fpw__col' + (hot === i ? ' fpw__col--hot' : '') + '">' +
        '<i style="--h:' + Math.round((vals[i] / max) * 100) + ';--i:' + i + '"></i></div>' +
        '<figcaption>' + labels[i] + '</figcaption></figure>';
    }
    return '<div class="fpw__chart fpw__chart--steps">' + h + '</div>';
  }
  function area(vals, labels, min, max, color) {
    var w = 640, h = 210, pad = 26, pts = [], i;
    for (i = 0; i < vals.length; i++) {
      var x = pad + (i * (w - pad * 2)) / (vals.length - 1);
      var y = h - pad - ((vals[i] - min) / (max - min)) * (h - pad * 2);
      pts.push([x, y]);
    }
    var d = pts.map(function (p, j) { return (j ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var area = d + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + (h - pad) + ' L' + pts[0][0].toFixed(1) + ' ' + (h - pad) + ' Z';
    var dots = pts.map(function (p) {
      return '<circle class="dt" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4" fill="' + color + '" stroke="var(--fp-surface)" stroke-width="2"/>';
    }).join('');
    var xt = labels.map(function (l, j) {
      return '<text class="dt" x="' + pts[j][0].toFixed(1) + '" y="' + (h - 6) + '" text-anchor="middle" font-size="11" fill="var(--fp-muted)">' + l + '</text>';
    }).join('');
    return '<div class="fpw__area"><svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">' +
      '<defs><linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="5%" stop-color="' + color + '" stop-opacity=".3"/><stop offset="95%" stop-color="' + color + '" stop-opacity="0"/>' +
      '</linearGradient></defs>' +
      '<path d="' + area + '" fill="url(#wgrad)"/>' +
      '<path class="ln" d="' + d + '" stroke="' + color + '"/>' + dots + xt + '</svg></div>';
  }
  /* ── web application shell (mirrors weblayout.tsx) ─────────── */
  function side(active) {
    return '<aside class="fpw__side"><div class="fpw__brand">' + logo(38) +
      '<div class="fpw__lbl"><div class="fpw__bname">' + D.brand.name + '</div>' +
      '<div class="fpw__btag">' + D.brand.tag + '</div></div></div>' +
      '<nav class="fpw__nav">' + D.nav.map(function (n) {
        return '<button class="fpw__navi' + (n.id === active ? ' on' : '') + '"><em>' + n.e +
          '</em><span class="fpw__lbl">' + n.l + '</span></button>';
      }).join('') + '</nav>' +
      '<div class="fpw__sidefoot"><div class="fpw__streak"><span>🔥</span>' +
      '<span class="fpw__lbl">' + D.profile.streak + '</span></div></div></aside>';
  }
  function top(o) {
    var notif = '';
    if (o.notif) {
      notif = '<div class="fpw__pop"><div class="fpw__pophead"><b>Notifications</b><u>Clear all</u></div>' +
        D.notifications.map(function (n) {
          return '<div class="fpw__notif"><span class="fpw__nico" ' + ico(n.i, n.c) + '>' + n.i + '</span>' +
            '<span class="fpw__nbody"><b>' + n.t + '</b><small>' + n.m + '</small></span>' +
            '<span class="fpw__ntime">' + n.w + '</span></div>';
        }).join('') + '<div class="fpw__popall">View All Notifications</div></div>';
    }
    return '<header class="fpw__top"><button class="fpw__menubtn">☰</button>' +
      /* a <div>, not an <h1>: the replica lives inside .mc-hero/.wc-hero
         on the cover, and every `h1` / `.mc-hero h1` / `.mc-page h1` rule
         in the deck stylesheets matched this element from the outside —
         that is what rendered "Home" at clamp(36px,4.6vw,60px) and then,
         once the deck rules were scoped, at opacity:0. An app page title
         is not a document heading, so a plain element with the same
         .fpw__title class ends the whole collision for good. */
      '<div class="fpw__titles"><div class="fpw__title">' + o.title + '</div>' +
      (o.sub ? '<p class="fpw__subtitle">' + o.sub + '</p>' : '') + '</div>' +
      '<div class="fpw__acts">' + (o.log ? '<button class="fpw__btn fpw__btn--pri"><span>+</span> Log</button>' : '') +
      '<span class="fpw__popwrap">' + notif +
      '<button class="fpw__iconbtn fpw__bellbtn">🔔<span class="fpw__nbadge">' + D.notifications.length + '</span></button></span>' +
      '<button class="fpw__iconbtn fpw__themebtn" title="Switch theme">' + (o.theme === 'light' ? '🌙' : '☀️') + '</button>' +
      '<button class="fpw__user"><span class="fpw__uav">' + D.profile.avatar + '</span>' +
      '<span class="fpw__uname">' + D.profile.name + '</span></button></div></header>';
  }
  function shell(o) {
    return '<div class="fpw" data-wt="' + (o.theme || 'dark') + '"' + (o.collapsed ? ' data-collapsed' : '') + '>' +
      '<div class="fpw__glow fpw__glow--a"></div><div class="fpw__glow fpw__glow--b"></div>' +
      '<div class="fpw__glow fpw__glow--c"></div>' + side(o.active) +
      '<div class="fpw__main">' + top(o) + '<div class="fpw__content">' + o.body + '</div></div></div>';
  }
  /* ── screens (mirror webscreens.tsx) ───────────────────────── */
  function sHome(o) {
    o = o || {};
    var body = '<div class="fpw__grid">' +
      '<section class="fpw__card fpw__w4"><div class="fpw__hero"><div class="fpw__hav">' + D.profile.avatar + '</div>' +
      '<div><div class="fpw__hgreet">' + D.profile.greet + '</div><div class="fpw__hname">' + D.profile.name + '</div></div></div>' +
      /* the product's greeting card carries the streak chip only, and it
         is a plain .fp-card — it stretches to the row height with its
         content at the top, not distributed with space-between. */
      '<div class="fpw__chips"><span class="fpw__chip fpw__chip--or">🔥 ' + D.profile.streak + '</span></div></section>' +

      '<section class="fpw__card fpw__w8"><header class="fpw__chead"><div class="fpw__ctitle">Today\'s Steps</div>' +
      tag(D.goalLabel, C.green) + '</header>' +
      '<div class="fpw__stepsv"><div class="fpw__stepsnum" data-count="' + D.steps + '">' + D.steps.toLocaleString('en-US') + '</div>' +
      '<div class="fpw__stepsdelta">' + D.delta + '</div></div>' +
      bars(D.week, D.weekLabels, 6) + '</section>' +

      '<div class="fpw__w12 fpw__metrics">' + D.metrics.map(function (m) { return metric(m); }).join('') + '</div>' +

      '<section class="fpw__card fpw__w5 fpw__card--a"><header class="fpw__chead"><div class="fpw__ctitle">✨ AI Insights</div>' +
      tag('New', C.cyan) + '</header>' + D.insights.map(function (t) {
        return '<div class="fpw__ins"><span class="fpw__insdot">●</span><p class="fpw__instext">' + t + '</p></div>';
      }).join('') + '</section>' +

      '<section class="fpw__card fpw__w4"><header class="fpw__chead"><div class="fpw__ctitle">' + D.challenge.title + '</div>' +
      tag(D.challenge.tag, C.orange) + '</header><p class="fpw__csub fpw__csub--b">' + D.challenge.name + '</p>' +
      '<div class="fpw__pbar"><i style="--w:' + D.challenge.pct + '%"></i></div>' +
      '<div class="fpw__meta"><span>' + D.challenge.pct + '% completed</span>' +
      '<span style="color:' + C.green + '">' + D.challenge.who + '</span></div></section>' +

      '<section class="fpw__card fpw__w3"><button class="fpw__cta"><span class="fpw__ctaico">🏋️</span>' +
      '<span class="fpw__ctatext"><span class="fpw__ctatitle">' + D.workout.title + '</span>' +
      '<span class="fpw__ctasub">' + D.workout.sub + '</span></span><span class="fpw__ctaarrow">›</span></button></section>' +
      '</div>';
    return shell({ active: 'home', title: 'Home', log: 1, notif: o.notif, theme: o.theme, body: body });
  }
  function sProgress(o) {
    o = o || {};
    var body = '<div class="fpw__grid">' +
      '<div class="fpw__pagehead"><div class="fpw__seg"><button class="on">Week</button><button>Month</button></div>' +
      '<button class="fpw__btn">📄 Download PDF Report</button></div>' +
      '<div class="fpw__w12 fpw__metrics fpw__metrics--3">' + D.progressStats.map(function (m) { return metric(m); }).join('') + '</div>' +
      '<section class="fpw__card fpw__w8"><header class="fpw__chead"><div><div class="fpw__ctitle">Weight Trend</div>' +
      '<p class="fpw__csub">' + D.weightSub + '</p></div>' + tag(D.weightDelta, C.green) + '</header>' +
      area(D.weight, D.weightLabels, 70, 75, C.green) + '</section>' +
      '<section class="fpw__card fpw__w4"><header class="fpw__chead"><div class="fpw__ctitle">' + D.bmi.label + '</div></header>' +
      '<div class="fpw__bmi"><div class="fpw__bmiico">⚕️</div><div><div class="fpw__bmival">' + D.bmi.v + '</div>' +
      tag(D.bmi.tag, C.green) + '</div></div><div class="fpw__bmimeta">' +
      '<div class="fpw__bmirow"><span class="fpw__bmikey">Height</span><span class="fpw__bmivl">' + D.bmi.h + '</span></div>' +
      '<div class="fpw__bmirow"><span class="fpw__bmikey">Weight</span><span class="fpw__bmivl">' + D.bmi.w + '</span></div></div></section>' +
      '<section class="fpw__card fpw__w7 fpw__card--ac"><header class="fpw__chead"><div class="fpw__ctitle">' + D.monthly.title + '</div>' +
      tag(D.monthly.tag, C.green) + '</header><p class="fpw__body">' + D.monthly.body + '</p></section>' +
      '<section class="fpw__card fpw__w5"><button class="fpw__cta"><span class="fpw__ctaico">📊</span>' +
      '<span class="fpw__ctatext"><span class="fpw__ctatitle">Activity Log</span>' +
      '<span class="fpw__ctasub">Detailed health analytics</span></span><span class="fpw__ctaarrow">›</span></button></section>' +
      '<section class="fpw__card fpw__w12"><header class="fpw__chead"><div class="fpw__ctitle">Achievement Badges</div></header>' +
      '<div class="fpw__badges">' + D.badges.map(function (b) {
        return '<div class="fpw__badge' + (b.on ? ' on' : '') + '"><div class="fpw__badgeico">' + b.i + '</div>' +
          '<div class="fpw__badgelabel">' + b.l + '</div></div>';
      }).join('') + '</div></section></div>';
    return shell({ active: 'progress', title: 'Progress', theme: o.theme, body: body });
  }
  function sWorkouts(o) {
    o = o || {};
    var body = '<div class="fpw__grid">' +
      '<div class="fpw__pagehead"><div class="fpw__search"><span>🔍</span><span>Search workouts...</span></div>' +
      '<button class="fpw__btn">‹ Home</button></div>' +
      '<section class="fpw__card fpw__w7 fpw__card--fill"><div class="fpw__cats">' + D.workouts.cats.map(function (c) {
        return '<button class="fpw__cat"><span class="fpw__catico" ' + ico(c.i, c.c) + '>' + c.i + '</span>' +
          '<span class="fpw__catname">' + c.n + '</span><span class="fpw__catcal" style="color:' + c.c + '">~' + c.k + '</span></button>';
      }).join('') + '</div></section>' +
      '<div class="fpw__w5 fpw__stack"><div class="fpw__live"><div class="fpw__livehead">' +
      '<span class="fpw__livetitle">' + D.workouts.live.t + '</span><span class="fpw__livedot"></span></div>' +
      '<div class="fpw__livestats">' + D.workouts.live.s.map(function (s) {
        return '<div><div class="fpw__liveval">' + s.v + '</div><div class="fpw__livelbl">' + s.l + '</div></div>';
      }).join('') + '</div>' +
      '<button class="fpw__abtn" style="background:linear-gradient(135deg,' + C.red + ',#b91c1c);box-shadow:0 4px 16px ' + C.red + '40">⏹ Stop Workout</button></div>' +
      '<section class="fpw__card"><header class="fpw__chead"><div class="fpw__ctitle">Recent Workouts</div></header>' +
      D.workouts.recent.map(function (w) {
        return row({ i: w.i, c: C.green, n: w.n, w: w.w, v: w.k, k: C.orange, d: w.d });
      }).join('') + '</section></div></div>';
    return shell({ active: 'home', title: 'Workouts', sub: 'Choose your session', theme: o.theme, body: body });
  }
  function sActivity(o) {
    o = o || {};
    var body = '<div class="fpw__grid">' +
      '<div class="fpw__pagehead"><div class="fpw__tabs">' + D.activityTabs.map(function (t, i) {
        return '<button class="fpw__tab' + (i ? '' : ' on') + '">' + t.i + ' ' + t.l + '</button>';
      }).join('') + '</div></div>' +
      '<div class="fpw__w12 fpw__metrics">' +
      metric({ i: '👟', l: D.actSteps ? 'Today' : '', v: D.steps.toLocaleString('en-US'), u: 'Steps', s: 'Goal 10,000', c: C.green }, true) +
      metric({ i: '🎯', l: 'Goal', v: '128%', u: '', s: '10,000 steps', c: C.cyan }) +
      D.actStepSummary.map(function (s) { return metric({ i: '📊', l: s.l, v: s.v, u: '', s: '', c: s.c }); }).join('') +
      '</div>' +
      '<section class="fpw__card fpw__w8"><header class="fpw__chead"><div class="fpw__ctitle">Daily Steps</div>' +
      tag('↑ 28% vs avg', C.green) + '</header>' + bars(D.actSteps, D.actStepsLabels, 6) + '</section>' +
      '<section class="fpw__card fpw__w4"><header class="fpw__chead"><div class="fpw__ctitle">This Week</div></header>' +
      '<div class="fpw__strip">' + D.actStepSummary.map(function (s) {
        return '<div class="fpw__stripitem"><div class="fpw__stripv" style="color:' + s.c + '">' + s.v + '</div>' +
          '<div class="fpw__stripl">' + s.l + '</div></div>';
      }).join('') + '</div></section></div>';
    return shell({ active: 'progress', title: 'Activity Log', sub: 'Detailed health analytics', theme: o.theme, body: body });
  }
  function sCommunity(o) {
    o = o || {};
    var cm = D.community;
    var body = '<div class="fpw__grid">' +
      '<div class="fpw__pagehead"><button class="fpw__btn fpw__btn--pri"><span>+</span> Join Challenge</button></div>' +
      '<div class="fpw__w12 fpw__sectitle">Active Challenges</div>' +
      cm.active.map(function (a) {
        return '<section class="fpw__card fpw__w6"><div class="fpw__chal"><span class="fpw__chalico" ' + ico(a.i, a.c) + '>' + a.i + '</span>' +
          '<div class="fpw__chalbody"><div class="fpw__chaltitle">' + a.t + '</div>' +
          '<div class="fpw__chalend">' + a.e + '</div>' +
          '<div class="fpw__pbar"><i style="--w:' + a.p + '%;background:' + a.c + '"></i></div>' +
          '<div class="fpw__chalpct" style="color:' + a.c + '">' + a.p + '%</div></div></div></section>';
      }).join('') +
      '<section class="fpw__card fpw__w5"><header class="fpw__chead"><div class="fpw__ctitle">🏆 Leaderboard</div>' +
      tag(cm.boardTag, C.orange) + '</header>' +
      cm.board.map(function (b, i) {
        return '<div class="fpw__lb' + (b.you ? ' is-you' : '') + '"' +
          (i < cm.board.length - 1 ? ' style="border-bottom:1px solid var(--fp-track)"' : '') + '>' +
          '<span class="fpw__lbrank">' + b.r + '</span><span class="fpw__lbav">' + b.e + '</span>' +
          '<span class="fpw__lbname">' + b.n + '</span><span class="fpw__lbscore">' + b.s + '</span></div>';
      }).join('') + '</section>' +
      '<section class="fpw__card fpw__w7"><header class="fpw__chead"><div class="fpw__ctitle">Friends Activity</div></header>' +
      cm.feed.map(function (p, i) {
        return '<div class="fpw__post"' + (i < cm.feed.length - 1 ? ' style="margin-bottom:12px"' : '') + '>' +
          '<div class="fpw__posthead"><span class="fpw__postav">' + p.e + '</span>' +
          '<span class="fpw__postwho"><span class="fpw__postname">' + p.n + '</span>' +
          '<span class="fpw__posttime">' + p.w + '</span></span></div>' +
          '<p class="fpw__postmsg">' + p.m + '</p>' +
          '<div class="fpw__postacts">' +
          '<span class="fpw__postbtn"><span class="fpw__postbtnico">\u{1F90D}</span> ' + p.l + '</span>' +
          '<span class="fpw__postbtn"><span class="fpw__postbtnico">\u{1F4AC}</span> Comment</span>' +
          '<span class="fpw__postbtn"><span class="fpw__postbtnico">\u2197\uFE0F</span> Share</span>' +
          '</div></div>';
      }).join('') + '</section></div>';
    return shell({ active: 'community', title: 'Community', sub: 'Challenges, friends & achievements', theme: o.theme, body: body });
  }
  /* The product's Account route keeps a 5-column profile card and a
     7-column stack of the four grouped section cards. The "Personal
     Records" card and the full-width footer card that used to sit here
     are not part of the web route - there Personal Records is a modal
     and the version line lives inside the profile card. */
  function sAccount(o) {
    o = o || {};
    var a = D.account;
    var body = '<div class="fpw__grid">' +
      '<div class="fpw__pagehead"><button class="fpw__btn">\u2699\uFE0F Settings</button></div>' +
      '<section class="fpw__card fpw__w5 fpw__card--profile"><div class="fpw__profile">' +
        '<div class="fpw__profileav">' + a.avatar + '<span class="fpw__profileedit">\u270F\uFE0F</span></div>' +
        '<div class="fpw__profilename">' + a.name + '</div>' +
        '<div class="fpw__profilemail">' + a.email + '</div>' +
        ' ' + tag(a.plan, C.lime) +
        '<div class="fpw__profilestats">' + a.stats.map(function (s) {
          return '<div class="fpw__profilestat"><div class="fpw__profilevalue">' + s.v + '</div>' +
            '<div class="fpw__profilestatlabel">' + s.l + '</div></div>';
        }).join('') + '</div></div>' +
        '<div class="fpw__profilefoot">' + a.footer + '</div></section>' +
      '<div class="fpw__w7 fpw__stack">' + a.groups.map(function (g) {
        return '<section class="fpw__card"><header class="fpw__chead"><div class="fpw__ctitle">' + g + '</div></header>' +
          a.menu.filter(function (m) { return m.g === g; }).map(function (m) {
            return '<div class="fpw__mrow' + (m.l === 'Sign Out' ? ' is-danger' : '') + '">' +
              '<span class="fpw__mrowico" ' + ico(m.i, m.c) + '>' + m.i + '</span>' +
              '<span class="fpw__mrowbody"><span class="fpw__mrowlabel">' + m.l + '</span>' +
              (m.s ? '<span class="fpw__mrowsub">' + m.s + '</span>' : '') + '</span>' +
              (m.l === 'Sign Out' ? '' : '<span class="fpw__mrowarrow">\u203A</span>') + '</div>';
          }).join('') + '</section>';
      }).join('') + '</div></div>';
    return shell({ active: 'account', title: 'Account', theme: o.theme, body: body });
  }
  function sSettings(o) {
    o = o || {};
    var body = '<div class="fpw__grid">' +
      D.settings.map(function (g, gi) {
        return '<section class="fpw__card ' + (gi < 2 ? 'fpw__w4' : 'fpw__w4') + '">' +
          '<header class="fpw__chead"><div class="fpw__ctitle">' + g.t + '</div></header>' +
          g.items.map(function (it) {
            return '<div class="fpw__row"><span class="fpw__rico" ' + ico(it.i, it.on ? C.cyan : '#6B7280') + '>' + it.i + '</span>' +
              '<span class="fpw__rbody"><span class="fpw__rlabel">' + it.l + '</span>' +
              '<span class="fpw__rsub">' + it.s + '</span></span>' +
              '<span class="fpw__tgl' + (it.on ? ' on' : '') + '"><i></i></span></div>';
          }).join('') + '</section>';
      }).join('') + '</div>';
    return shell({ active: 'account', title: 'Settings', theme: o.theme, body: body });
  }
  /* ── first-run / auth screens (mirror webauth.tsx) ──────────── */
  function authWrap(inner) {
    return '<div class="fpw" data-wt="light"><div class="fpw__glow fpw__glow--a"></div>' +
      '<div class="fpw__glow fpw__glow--b"></div><div class="fpw__glow fpw__glow--c"></div>' +
      '<div class="fpw__auth">' + inner + '</div></div>';
  }
  function brandSide(kind) {
    var h = kind === 'signup'
      ? { t: 'Start your<br>healthy momentum.', s: 'Create one account and every screen — mobile and web — fills with your own data.' }
      : { t: 'Track. Improve.<br>Achieve.', s: 'Steps, heart rate, calories, sleep and stress in one calm dashboard, with AI insights that turn numbers into next actions.' };
    return '<div class="fpw__abrand"><div>' + logo(40).replace('fpw__logo', 'fpw__logo') +
      '<div class="fpw__abrandname" style="margin-top:14px">' + D.brand.name + '</div>' +
      '<div class="fpw__abrandtag">' + D.brand.tag + '</div></div>' +
      '<div class="fpw__abrandhero"><h3>' + h.t + '</h3><p>' + h.s + '</p>' +
      '<div class="fpw__abrandstats"><div><b>4</b><span>Product areas</span></div>' +
      '<div><b>2</b><span>Layouts, one data set</span></div>' +
      '<div><b>12</b><span>Grid columns</span></div></div></div></div>';
  }
  function field(icon, ph, type) {
    return '<label class="fpw__field"><em>' + icon + '</em>' +
      '<input class="fpw__ffield" type="' + (type || 'text') + '" placeholder="' + ph + '" readonly></label>';
  }
  function aLogin() {
    return authWrap('<div class="fpw__asplit">' + brandSide('login') +
      '<div class="fpw__apanel"><div class="fpw__apanelh"><h2>Welcome Back</h2>' +
      '<p>Sign in to your FitPulse account</p></div>' +
      field('📧', 'Email address', 'email') + field('🔒', 'Password', 'password') +
      '<div class="fpw__afrow"><button class="fpw__alink">Forgot Password?</button></div>' +
      '<button class="fpw__abtn">Sign In</button>' +
      '<div class="fpw__adiv">or continue with</div>' +
      '<div class="fpw__asocial"><button class="fpw__asbtn">🅖 Google</button>' +
      '<button class="fpw__asbtn"> Apple</button></div>' +
      '<p class="fpw__aswitch">New here? <button class="fpw__alink">Create Account</button></p></div></div>');
  }
  function aSignup() {
    return authWrap('<div class="fpw__asplit">' + brandSide('signup') +
      '<div class="fpw__apanel"><div class="fpw__apanelh"><h2>Create Account</h2>' +
      '<p>Start your fitness journey today</p></div>' +
      field('👤', 'Full Name') + field('📧', 'Email address', 'email') +
      field('🔒', 'Password', 'password') + field('✅', 'Confirm Password', 'password') +
      '<button class="fpw__abtn" style="margin-top:8px">Create Account 🎉</button>' +
      '<p class="fpw__aswitch">Already have an account? <button class="fpw__alink">Sign In</button></p></div></div>');
  }
  function aProfile() {
    return authWrap('<div class="fpw__ainner"><div class="fpw__ahead"><h2>Set Up Profile</h2>' +
      '<p>Help us personalize your experience</p></div><div class="fpw__acard">' +
      '<div class="fpw__aav">👩‍🦱<u>📷</u></div><div class="fpw__agrid">' +
      field('👤', 'Full Name') + field('🎂', 'Age', 'number') +
      field('📏', 'Height (cm)', 'number') + field('⚖️', 'Weight (kg)', 'number') + '</div>' +
      '<div class="fpw__alabel">Gender</div><div class="fpw__achips">' +
      ['Male', 'Female', 'Other'].map(function (g) { return '<button class="fpw__achip">' + g + '</button>'; }).join('') +
      '</div></div><div style="height:18px"></div><div class="fpw__acard">' +
      '<div class="fpw__alabel">Fitness Level</div><div class="fpw__achips">' +
      D.levels.map(function (l, i) {
        return '<button class="fpw__achip' + (i === 1 ? ' on' : '') + '">' + l.i + ' ' + l.t + '</button>';
      }).join('') + '</div><div style="height:20px"></div>' +
      '<button class="fpw__abtn">Continue</button></div></div>');
  }
  function aGoals() {
    return authWrap('<div class="fpw__ainner"><div class="fpw__ahead"><h2>Select Your Goal</h2>' +
      '<p>Pick what you want to work towards first</p></div><div class="fpw__acard">' +
      '<div class="fpw__cats" style="grid-template-columns:repeat(3,minmax(0,1fr))">' +
      D.goals.map(function (g, i) {
        return '<button class="fpw__cat"' + (i === 2 ? ' style="border-color:' + g.c + ';background:' + g.c + '14"' : '') + '>' +
          '<span class="fpw__catico" ' + ico(g.i, g.c) + '>' + g.i + '</span>' +
          '<span class="fpw__catname">' + g.t + '</span><span class="fpw__catcal" style="color:var(--fp-muted)">' + g.s + '</span></button>';
      }).join('') + '</div><div style="height:20px"></div><button class="fpw__abtn">Start Tracking</button></div></div>');
  }
  /* ── mobile screens (reuse the .cs-* phone system from the
        mobile case study so both case studies look like one system) */
  function csHead() {
    return '<div class="cs-row cs-spread cs-hdr"><div class="cs-row cs-gap">' +
      '<span class="cs-avatar">👩‍🦱</span><div><div class="cs-mute">' + D.profile.greet + '</div>' +
      '<div class="cs-name">' + D.profile.name + '</div></div></div>' +
      '<div class="cs-row cs-gap"><span class="cs-chip orange">🔥 14</span>' +
      '<span class="cs-bell">🔔<b>4</b></span></div></div>';
  }
  function csNav(ind) {
    var tabs = [['🏠', 'Home'], ['📊', 'Progress'], ['👥', 'Community'], ['👤', 'Account']];
    return '<div class="cs-nav ind' + ind + '">' + tabs.map(function (t, i) {
      return '<span class="cs-tab' + (i + 1 === ind ? ' on' : '') + '"><span>' + t[0] + '</span>' + t[1] + '</span>';
    }).join('') + '</div>';
  }
  function pHome() {
    return '<div class="cs-screen s-active" data-screen="home"><div class="cs-status"><span>9:41</span>' +
      '<span class="cs-dots">●●●</span><span>5G <i>🔋</i></span></div><div class="cs-scroll">' + csHead() +
      '<div class="cs-card"><div class="cs-row cs-spread" style="align-items:flex-start"><div>' +
      '<div class="cs-mute">Today\'s Steps</div><div class="cs-num">12,847</div><div class="cs-up">↑ 28% vs yesterday</div>' +
      '</div><span class="cs-chip green">128% Goal</span></div>' +
      '<div class="cs-bars">' + D.week.map(function (v, i) {
        var h = Math.round((v / 12847) * 100);
        return '<i class="' + (i === 6 ? 'hot' : '') + '" style="height:' + h + '%"></i>';
      }).join('') + '</div></div>' +
      '<div class="cs-row"><div class="cs-card"><div class="cs-mute">❤️ Heart</div>' +
      '<div class="cs-num sm" style="color:#f87171">72<i>BPM</i></div><div class="cs-mute">Resting · Normal</div></div>' +
      '<div class="cs-card"><div class="cs-mute">🔥 Calories</div><div class="cs-num sm">1,847<i>kcal</i></div>' +
      '<div class="cs-mute">482 remaining</div></div></div>' +
      '<div class="cs-row"><div class="cs-card"><div class="cs-mute">💧 Water</div><div class="cs-num xs">1.8<i>L</i></div>' +
      '<div class="cs-mute">Goal: 2.5L</div></div><div class="cs-card"><div class="cs-mute">😴 Sleep</div>' +
      '<div class="cs-num xs">7.4<i>h</i></div><div class="cs-mute">Deep 2.1h</div></div>' +
      '<div class="cs-card"><div class="cs-mute">🧠 Stress</div><div class="cs-num xs lime">Low</div>' +
      '<div class="cs-mute">Score 24/100</div></div></div>' +
      '<div class="cs-card cs-ai"><div class="cs-row cs-spread"><b class="cs-t">✨ AI Insights</b>' +
      '<span class="cs-chip cyan">New</span></div><p>' + D.insights[0] + '</p><p>' + D.insights[2] + '</p></div>' +
      '<div class="cs-card"><div class="cs-row cs-spread"><b class="cs-t">🏆 Weekly Challenge</b>' +
      '<span class="cs-chip amber">3 days left</span></div><div class="cs-mute">10,000 Steps Every Day</div>' +
      '<div class="cs-track"><i style="--w:72%"></i></div>' +
      '<div class="cs-row cs-spread cs-footnote"><span class="cs-mute">72% completed</span>' +
      '<span class="cs-go">1,247 participants</span></div></div>' +
      '<div class="cs-cta"><span class="cs-ico">🏋️</span><div><div class="cs-go">Start Workout</div>' +
      '<div class="cs-mute">Today: Upper body strength</div></div><b>›</b></div></div>' + csNav(1) + '</div>';
  }
  function pProgress() {
    return '<div class="cs-screen" data-screen="progress"><div class="cs-status"><span>9:41</span>' +
      '<span class="cs-dots">●●●</span><span>5G <i>🔋</i></span></div><div class="cs-scroll">' +
      '<div class="cs-row cs-spread cs-hdr"><b class="cs-stitle">Progress</b><span class="cs-seg">' +
      '<i>Week</i><i class="on">Month</i></span></div>' +
      '<div class="cs-row"><div class="cs-card"><div class="cs-mute">🏋️ Workouts</div><div class="cs-num sm">24</div></div>' +
      '<div class="cs-card"><div class="cs-mute">📅 Active</div><div class="cs-num sm">19/30</div></div>' +
      '<div class="cs-card"><div class="cs-mute">👟 Avg Steps</div><div class="cs-num sm">9.8k</div></div></div>' +
      '<div class="cs-card"><div class="cs-row cs-spread"><b class="cs-t">Weight Trend</b>' +
      '<span class="cs-chip green">↓ 3.2 kg</span></div>' +
      '<svg class="cs-chart" viewBox="0 0 200 48" preserveAspectRatio="none"><polyline class="cs-line" fill="none" ' +
      'points="4,10 36,15 68,20 100,24 132,30 164,36 196,41"/></svg>' +
      '<div class="cs-days">' + D.weightLabels.map(function (l) { return '<span>' + l + '</span>'; }).join('') + '</div>' +
      '<div class="cs-mute" style="margin-top:5px">Lost 3.2 kg this month</div></div>' +
      '<div class="cs-card"><div class="cs-bmi"><span style="font-size:18px">⚕️</span><div>' +
      '<div class="cs-num sm">22.4</div><span class="cs-chip green">Normal Weight</span></div></div>' +
      '<div class="cs-row cs-spread" style="margin-top:8px"><div class="cs-mute">Height<br><b style="color:var(--ct-text)">178 cm</b></div>' +
      '<div class="cs-mute">Weight<br><b style="color:var(--ct-text)">71.0 kg</b></div></div></div>' +
      '<div class="cs-card cs-cyan"><div class="cs-row cs-spread"><b class="cs-t">✨ AI Monthly Summary</b>' +
      '<span class="cs-chip green">Top 5%</span></div><p>' + D.monthly.body + '</p></div>' +
      '<div class="cs-sec">Achievement Badges</div><div class="cs-badges">' +
      D.badges.map(function (b) {
        return '<div class="cs-badge' + (b.on ? '' : ' lock') + '"><span>' + b.i + '</span>' + b.l + '</div>';
      }).join('') + '</div></div>' + csNav(2) + '</div>';
  }
  function pCommunity() {
    var cm = D.community;
    return '<div class="cs-screen" data-screen="community"><div class="cs-status"><span>9:41</span>' +
      '<span class="cs-dots">●●●</span><span>5G <i>🔋</i></span></div><div class="cs-scroll">' +
      '<div class="cs-row cs-spread cs-hdr"><b class="cs-stitle">Community</b>' +
      '<span class="cs-chip cyan">3 challenges</span></div>' +
      '<div class="cs-card"><div class="cs-row cs-spread"><b class="cs-t">🏃 ' + cm.challenge.title + '</b>' +
      '<span class="cs-chip amber">' + cm.challenge.end + '</span></div><p style="margin:5px 0 0;font:600 8px/1.5 \'DM Sans\',sans-serif;color:var(--ct-text-2)">' +
      cm.challenge.d + '</p><div class="cs-track"><i style="--w:72%"></i></div>' +
      '<div class="cs-row cs-spread cs-footnote"><span class="cs-mute">72% of 70,000</span>' +
      '<span class="cs-go">🏆 Finisher Badge</span></div>' +
      '<button class="cs-btn" style="margin-top:8px;width:100%">Join Challenge</button></div>' +
      '<div class="cs-sec">Leaderboard · This Week</div>' +
      cm.board.map(function (b) {
        return '<div class="cs-lbrow' + (b.you ? ' you' : '') + '"><span>' + b.r + '</span>' +
          '<i class="cs-av">' + b.e + '</i><b>' + b.n + '</b><em>' + b.s + '</em></div>';
      }).join('') +
      '<div class="cs-sec">Friends Feed</div>' +
      cm.feed.map(function (p) {
        return '<div class="cs-card" style="padding:9px 10px"><div class="cs-row cs-gap">' +
          '<i class="cs-av sm">' + p.e + '</i><b class="cs-fname">' + p.n + '</b>' +
          '<span class="cs-mute" style="margin-left:auto">' + p.w + '</span></div>' +
          '<div class="cs-feed"><p>' + p.m + '</p></div></div>';
      }).join('') + '</div>' + csNav(3) + '</div>';
  }
  function pAccount() {
    var a = D.account;
    return '<div class="cs-screen" data-screen="account"><div class="cs-status"><span>9:41</span>' +
      '<span class="cs-dots">●●●</span><span>5G <i>🔋</i></span></div><div class="cs-scroll">' +
      '<div class="cs-prof"><div class="cs-prof-av">👩‍🦱</div><b style="font:800 12px Outfit,sans-serif">' + a.name + '</b>' +
      '<div class="cs-mute" style="margin-top:3px">' + a.email + '</div>' +
      '<div class="cs-prof-stats">' + a.stats.map(function (s) {
        return '<div><b>' + s.v + '</b><span>' + s.l + '</span></div>';
      }).join('') + '</div><div style="margin-top:11px"><span class="cs-chip green">' + a.plan + '</span></div></div>' +
      '<div class="cs-sec">Personal Records</div>' +
      a.records.map(function (r) {
        return '<div class="cs-lbrow"><i class="cs-av">' + r.i + '</i><b>' + r.l + '</b><em>' + r.v + '</em></div>';
      }).join('') +
      '<div class="cs-sec">Account</div><div class="cs-menu">' +
      a.menu.slice(0, 5).map(function (m) {
        return '<div class="cs-men"><span>' + m.i + '</span><div><b>' + m.l + '</b><small>' + (m.s || 'Sign out of this device') + '</small></div><i>›</i></div>';
      }).join('') + '</div><div class="cs-foot">' + a.footer + '</div></div>' + csNav(4) + '</div>';
  }
  function pSplash() {
    return '<div class="cs-screen s-active" data-screen="splash"><div style="margin:auto;text-align:center">' +
      '<div class="cs-avatar" style="width:56px;height:56px;font-size:26px;margin:0 auto 12px">💪</div>' +
      '<b style="display:block;font:900 18px Outfit,sans-serif;color:var(--ct-text)">FitPulse</b>' +
      '<div class="cs-mute" style="letter-spacing:2px;margin-top:4px">TRACK. IMPROVE. ACHIEVE.</div>' +
      '<div style="width:22px;height:22px;border-radius:50%;border:2px solid rgba(255,255,255,.16);' +
      'border-top-color:#34d399;margin:22px auto 0"></div></div></div>';
  }
  /* phone host: the same real-iPhone render + overlay geometry the
     mobile case study uses for its App Flow section. */
  function phoneStage(inner) {
    return '<div class="flow-stage"><div class="flow-phone">' +
      '<img src="imports/no2.png" alt="Real iPhone render" class="flow-phone-img">' +
      '<div class="flow-app"><div class="flow-app-screen cover-theme-dark">' + inner + '</div></div>' +
      '</div></div>';
  }

  window.WCD = {
    D: D, C: C,
    web: { home: sHome, progress: sProgress, workouts: sWorkouts, activity: sActivity, community: sCommunity, account: sAccount, settings: sSettings },
    auth: { login: aLogin, signup: aSignup, profile: aProfile, goals: aGoals },
    phone: { splash: pSplash, home: pHome, progress: pProgress, community: pCommunity, account: pAccount },
    phoneStage: phoneStage
  };
})();
