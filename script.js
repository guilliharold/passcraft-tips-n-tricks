// ═══════════════════════════════════════════════
// PASSCRAFT EDUCATION — Account Security Essentials
// security-essentials.js
// ═══════════════════════════════════════════════

/* ── TAB SWITCHING (same pattern as index.html) ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ═══════════════════════════════════════════════
   PHISHING QUIZ
═══════════════════════════════════════════════ */

const QUIZ_QUESTIONS = [
  {
    from: "IT-Support@passcraft-secure-verify.com",
    body: "Your account will be <span class='flagged'>suspended in 24 hours</span>. Click here to <span class='flagged'>verify your login immediately</span>: passcraft-secure-verify.com/confirm",
    answer: "phish",
    why: "Urgency, a lookalike domain, and a link asking you to \"verify\" credentials are classic phishing signals. Legitimate IT teams rarely threaten suspension by email."
  },
  {
    from: "no-reply@github.com",
    body: "A new sign-in to your account was detected from Melbourne, Australia. If this was you, no action is needed. If not, secure your account from your account settings page.",
    answer: "safe",
    why: "This is a standard security notification. It doesn't ask you to click an urgent link or enter credentials — it just informs you and points to your own settings, not an embedded link with pressure tactics."
  },
  {
    from: "billing@netfIix-support.com",
    body: "We <span class='flagged'>couldn't process your payment</span>. <span class='flagged'>Update your card details within 12 hours</span> to avoid service interruption.",
    answer: "phish",
    why: "Look closely at the sender domain — that's a capital \"I\" standing in for an \"l\" (netfIix, not netflix). Combined with a tight deadline, this is a payment-scam pattern."
  },
  {
    from: "team@slack.com",
    body: "Your weekly workspace summary: 142 messages, 3 new channels. View full activity in the Slack app.",
    answer: "safe",
    why: "Routine, low-stakes, informational content with no request for credentials, payment, or urgent action — a low-risk message."
  },
  {
    from: "security@yourbank-alerts.net",
    body: "Unusual activity detected. To keep your account safe, <span class='flagged'>confirm your identity</span> by entering your online banking password and card PIN here.",
    answer: "phish",
    why: "No legitimate bank will ever ask for your PIN or password by email — full stop. This is one of the clearest possible red flags."
  }
];

let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function renderQuizProgress() {
  const bar = document.getElementById('quiz-progress');
  bar.innerHTML = '';
  QUIZ_QUESTIONS.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'quiz-progress-dot' + (i < quizIndex ? ' done' : i === quizIndex ? ' current' : '');
    bar.appendChild(dot);
  });
}

function renderQuizQuestion() {
  quizAnswered = false;
  const q = QUIZ_QUESTIONS[quizIndex];
  document.getElementById('quiz-from').textContent = 'From: ' + q.from;
  document.getElementById('quiz-body').innerHTML = q.body;
  document.getElementById('quiz-question-count').textContent = `Question ${quizIndex + 1} of ${QUIZ_QUESTIONS.length}`;
  document.getElementById('quiz-score').textContent = `Score: ${quizScore}`;
  document.getElementById('quiz-feedback').classList.remove('show', 'correct', 'incorrect');
  document.getElementById('quiz-next-btn').style.display = 'none';
  document.querySelectorAll('.quiz-choice-btn').forEach(b => {
    b.classList.remove('correct', 'incorrect');
    b.disabled = false;
  });
  renderQuizProgress();
}

function handleQuizChoice(choice) {
  if (quizAnswered) return;
  quizAnswered = true;
  const q = QUIZ_QUESTIONS[quizIndex];
  const correct = choice === q.answer;
  if (correct) quizScore++;

  document.querySelectorAll('.quiz-choice-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.choice === q.answer) b.classList.add('correct');
    else if (b.dataset.choice === choice) b.classList.add('incorrect');
  });

  const feedback = document.getElementById('quiz-feedback');
  feedback.textContent = (correct ? '✅ Correct — ' : '❌ Not quite — ') + q.why;
  feedback.classList.add('show', correct ? 'correct' : 'incorrect');
  document.getElementById('quiz-score').textContent = `Score: ${quizScore}`;

  if (quizIndex < QUIZ_QUESTIONS.length - 1) {
    document.getElementById('quiz-next-btn').style.display = 'flex';
  } else {
    showQuizSummary();
  }
}

function showQuizSummary() {
  const summary = document.getElementById('quiz-summary');
  summary.style.display = 'block';
  summary.innerHTML = `<strong>Final score: ${quizScore} / ${QUIZ_QUESTIONS.length}.</strong> ` +
    (quizScore === QUIZ_QUESTIONS.length
      ? "Perfect — you caught every one. Sender domain, urgency, and requests for credentials are the three things worth checking every time."
      : "Review the domain name, the urgency of the request, and whether it asks for credentials before trusting any message.");
}

document.querySelectorAll('.quiz-choice-btn').forEach(btn => {
  btn.addEventListener('click', () => handleQuizChoice(btn.dataset.choice));
});

document.getElementById('quiz-next-btn').addEventListener('click', () => {
  quizIndex++;
  renderQuizQuestion();
});

renderQuizQuestion();

/* ═══════════════════════════════════════════════
   MFA COMPARISON
═══════════════════════════════════════════════ */

const MFA_METHODS = [
  { icon: '💬', name: 'SMS Text Code', strength: 2, desc: 'Easy to set up but vulnerable to SIM-swap attacks. Better than nothing, worth upgrading from.' },
  { icon: '📱', name: 'Authenticator App', strength: 4, desc: 'Codes generate on your device, not over the network. Strong, free, and widely supported.' },
  { icon: '🔑', name: 'Hardware Security Key', strength: 5, desc: 'A physical key (e.g. YubiKey) that resists phishing entirely — the strongest common option.' },
  { icon: '👆', name: 'Biometric (Face/Fingerprint)', strength: 4, desc: 'Convenient and strong when paired with device-level security, e.g. passkeys.' },
  { icon: '📧', name: 'Email Code', strength: 1, desc: 'Only as strong as your email account\'s own security — a weak second factor on its own.' }
];

const mfaList = document.getElementById('mfa-list');
MFA_METHODS.forEach(m => {
  const item = document.createElement('div');
  item.className = 'mfa-item';
  const pips = Array.from({ length: 5 }, (_, i) =>
    `<div class="pip${i < m.strength ? ' on' : ''}"></div>`).join('');
  item.innerHTML = `
    <div class="mfa-icon">${m.icon}</div>
    <div class="mfa-item-body">
      <h3>${m.name}</h3>
      <p>${m.desc}</p>
    </div>
    <div class="mfa-strength">${pips}</div>
  `;
  mfaList.appendChild(item);
});

/* ═══════════════════════════════════════════════
   BREACH CHECK (k-anonymity via Have I Been Pwned)
═══════════════════════════════════════════════ */

async function sha1(text) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

async function checkBreach() {
  const input = document.getElementById('breach-input');
  const btn = document.getElementById('breach-check-btn');
  const result = document.getElementById('breach-result');
  const pw = input.value;

  if (!pw) {
    showToast('Type a password first');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Checking…';
  result.className = 'breach-result';

  try {
    const hash = await sha1(pw);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!res.ok) throw new Error('API request failed');
    const text = await res.text();

    const match = text.split('\r\n').find(line => line.startsWith(suffix));

    if (match) {
      const count = parseInt(match.split(':')[1], 10);
      result.className = 'breach-result exposed show';
      result.innerHTML = `<strong>⚠️ Found in known breaches</strong>This password has appeared in data breaches ${count.toLocaleString()} time${count === 1 ? '' : 's'}. Don't use it — even with small variations.`;
    } else {
      result.className = 'breach-result safe show';
      result.innerHTML = `<strong>✅ Not found in known breaches</strong>This exact password hasn't appeared in the breach datasets checked. That doesn't guarantee it's strong — pair it with length, uniqueness, and MFA.`;
    }
  } catch (err) {
    result.className = 'breach-result error show';
    result.innerHTML = `<strong>Couldn't complete the check</strong>The breach-check service didn't respond. Try again in a moment.`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Check';
  }
}

document.getElementById('breach-check-btn').addEventListener('click', checkBreach);
document.getElementById('breach-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkBreach();
});
