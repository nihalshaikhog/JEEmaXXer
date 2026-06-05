let userName = '';
let examTarget = '';
let daysLeft = '';
let conversationHistory = [];
let currentTab = 'physics';
let warningCount = 0;
let isBanned = false;
let banEndTime = null;
let completedTopics = {};
const BACKEND_URL = '';

const badWords = [
  'chutiya', 'madarchod', 'bhenchod', 'bsdk', 'loda', 'lavda',
  'randi', 'harami', 'fuck', 'bitch', 'bastard', 'mkc', 'mc', 'bc',
  'lund', 'chut', 'lauda', 'gand', 'mutthi', 'gaand', 'bhosdike',
  'chuse', 'chusega', 'chatunga', 'maderchod', 'bhosdi', 'saala',
  'kamina', 'kutte', 'haramzade'
];

const syllabus = {
  physics: [
    {
      chapter: "Units and Dimensions",
      topics: [
        { name: "Physical Quantities and Units", formula: "SI Units: m, kg, s, A, K, mol, cd" },
        { name: "Dimensional Analysis", formula: "[M^a L^b T^c]" },
        { name: "Significant Figures", formula: "Rules of significant figures" },
        { name: "Error Analysis", formula: "Δz/z = Δa/a + Δb/b" },
        { name: "Dimensional Formulae", formula: "e.g. Force = [MLT⁻²]" }
      ]
    },
    {
      chapter: "Kinematics",
      topics: [
        { name: "Distance and Displacement", formula: "Displacement = final - initial position" },
        { name: "Speed and Velocity", formula: "v = Δx/Δt" },
        { name: "Acceleration", formula: "a = Δv/Δt" },
        { name: "Equations of Motion", formula: "v = u+at, s = ut+½at², v² = u²+2as" },
        { name: "Projectile Motion", formula: "R = u²sin2θ/g, H = u²sin²θ/2g" },
        { name: "Relative Motion", formula: "v_AB = v_A - v_B" }
      ]
    },
    {
      chapter: "Laws of Motion",
      topics: [
        { name: "Newton's First Law", formula: "Inertia — object stays at rest or motion" },
        { name: "Newton's Second Law", formula: "F = ma" },
        { name: "Newton's Third Law", formula: "F_AB = -F_BA" },
        { name: "Friction", formula: "f = μN" },
        { name: "Circular Motion", formula: "F_c = mv²/r" }
      ]
    },
    {
      chapter: "Work, Energy and Power",
      topics: [
        { name: "Work Done", formula: "W = F·d·cosθ" },
        { name: "Kinetic Energy", formula: "KE = ½mv²" },
        { name: "Potential Energy", formula: "PE = mgh" },
        { name: "Work-Energy Theorem", formula: "W_net = ΔKE" },
        { name: "Power", formula: "P = W/t = Fv" }
      ]
    },
    {
      chapter: "Gravitation",
      topics: [
        { name: "Newton's Law of Gravitation", formula: "F = Gm₁m₂/r²" },
        { name: "Gravitational Field", formula: "g = GM/r²" },
        { name: "Escape Velocity", formula: "v_e = √(2GM/R)" },
        { name: "Orbital Velocity", formula: "v_o = √(GM/r)" },
        { name: "Kepler's Laws", formula: "T² ∝ r³" }
      ]
    },
    {
      chapter: "Electrostatics",
      topics: [
        { name: "Coulomb's Law", formula: "F = kq₁q₂/r²" },
        { name: "Electric Field", formula: "E = F/q = kQ/r²" },
        { name: "Electric Potential", formula: "V = kQ/r" },
        { name: "Potential Difference", formula: "W = q(V_A - V_B)" },
        { name: "Capacitance", formula: "C = Q/V" },
        { name: "Gauss's Law", formula: "∮E·dA = q/ε₀" }
      ]
    },
    {
      chapter: "Current Electricity",
      topics: [
        { name: "Ohm's Law", formula: "V = IR" },
        { name: "Resistivity", formula: "R = ρL/A" },
        { name: "Kirchhoff's Laws", formula: "ΣI = 0, ΣV = 0" },
        { name: "Wheatstone Bridge", formula: "P/Q = R/S" },
        { name: "Power", formula: "P = VI = I²R = V²/R" }
      ]
    },
    {
      chapter: "Electromagnetic Induction",
      topics: [
        { name: "Faraday's Law", formula: "ε = -dΦ/dt" },
        { name: "Lenz's Law", formula: "Induced current opposes change" },
        { name: "Self Inductance", formula: "ε = -L(dI/dt)" },
        { name: "Mutual Inductance", formula: "ε = -M(dI/dt)" },
        { name: "AC Generator", formula: "ε = NBAω sin(ωt)" }
      ]
    },
    {
      chapter: "Modern Physics",
      topics: [
        { name: "Photoelectric Effect", formula: "KE = hf - φ" },
        { name: "de Broglie Wavelength", formula: "λ = h/mv" },
        { name: "Bohr's Model", formula: "E_n = -13.6/n² eV" },
        { name: "Radioactivity", formula: "N = N₀e^(-λt)" },
        { name: "Mass-Energy Equivalence", formula: "E = mc²" }
      ]
    }
  ],
  chemistry: [
    {
      chapter: "Some Basic Concepts",
      topics: [
        { name: "Mole Concept", formula: "1 mole = 6.022×10²³ particles" },
        { name: "Molar Mass", formula: "n = mass/molar mass" },
        { name: "Molarity", formula: "M = moles/volume(L)" },
        { name: "Stoichiometry", formula: "Mole ratios from balanced equation" }
      ]
    },
    {
      chapter: "Atomic Structure",
      topics: [
        { name: "Bohr's Model", formula: "E_n = -13.6/n² eV" },
        { name: "Quantum Numbers", formula: "n, l, m_l, m_s" },
        { name: "Electronic Configuration", formula: "Aufbau, Hund's, Pauli" },
        { name: "de Broglie", formula: "λ = h/mv" }
      ]
    },
    {
      chapter: "Chemical Bonding",
      topics: [
        { name: "Ionic Bond", formula: "Electron transfer between atoms" },
        { name: "Covalent Bond", formula: "Electron sharing" },
        { name: "VSEPR Theory", formula: "Shape based on electron pairs" },
        { name: "Hybridization", formula: "sp, sp², sp³, sp³d" }
      ]
    },
    {
      chapter: "Thermodynamics",
      topics: [
        { name: "First Law", formula: "ΔU = q + w" },
        { name: "Enthalpy", formula: "ΔH = ΔU + ΔnRT" },
        { name: "Gibbs Free Energy", formula: "ΔG = ΔH - TΔS" },
        { name: "Hess's Law", formula: "ΔH = ΣΔH_products - ΣΔH_reactants" }
      ]
    },
    {
      chapter: "Equilibrium",
      topics: [
        { name: "Law of Mass Action", formula: "Kc = [products]/[reactants]" },
        { name: "Le Chatelier's Principle", formula: "System opposes change" },
        { name: "pH Scale", formula: "pH = -log[H⁺]" },
        { name: "Buffer Solution", formula: "pH = pKa + log([A⁻]/[HA])" }
      ]
    },
    {
      chapter: "Electrochemistry",
      topics: [
        { name: "Faraday's Laws", formula: "m = ZIt" },
        { name: "Nernst Equation", formula: "E = E° - (RT/nF)lnQ" },
        { name: "Cell EMF", formula: "E_cell = E_cathode - E_anode" },
        { name: "Kohlrausch's Law", formula: "Λ°m = Σλ°ions" }
      ]
    },
    {
      chapter: "Organic Chemistry Basics",
      topics: [
        { name: "IUPAC Nomenclature", formula: "Parent chain + substituents" },
        { name: "Isomerism", formula: "Structural and Stereoisomerism" },
        { name: "Reaction Mechanisms", formula: "SN1, SN2, E1, E2" },
        { name: "Inductive Effect", formula: "+I and -I groups" }
      ]
    },
    {
      chapter: "Hydrocarbons",
      topics: [
        { name: "Alkanes", formula: "CnH2n+2 — substitution reactions" },
        { name: "Alkenes", formula: "CnH2n — addition reactions" },
        { name: "Alkynes", formula: "CnH2n-2 — addition reactions" },
        { name: "Markovnikov's Rule", formula: "H adds to C with more H" }
      ]
    }
  ],
  maths: [
    {
      chapter: "Sets, Relations and Functions",
      topics: [
        { name: "Types of Sets", formula: "Empty, finite, infinite, equal sets" },
        { name: "Set Operations", formula: "A∪B, A∩B, A-B, A'" },
        { name: "Relations", formula: "Reflexive, symmetric, transitive" },
        { name: "Functions", formula: "One-one, onto, bijective" }
      ]
    },
    {
      chapter: "Complex Numbers",
      topics: [
        { name: "Imaginary Unit", formula: "i = √-1, i² = -1" },
        { name: "Modulus and Argument", formula: "|z| = √(a²+b²)" },
        { name: "De Moivre's Theorem", formula: "(cosθ + i sinθ)ⁿ = cos(nθ) + i sin(nθ)" },
        { name: "Cube Roots of Unity", formula: "1, ω, ω² where ω³ = 1" }
      ]
    },
    {
      chapter: "Quadratic Equations",
      topics: [
        { name: "Quadratic Formula", formula: "x = (-b ± √(b²-4ac))/2a" },
        { name: "Nature of Roots", formula: "D = b²-4ac" },
        { name: "Sum and Product of Roots", formula: "α+β = -b/a, αβ = c/a" },
        { name: "Formation of Equation", formula: "x² - (α+β)x + αβ = 0" }
      ]
    },
    {
      chapter: "Sequence and Series",
      topics: [
        { name: "AP", formula: "Sn = n/2[2a+(n-1)d]" },
        { name: "GP", formula: "Sn = a(rⁿ-1)/(r-1)" },
        { name: "AM-GM Inequality", formula: "AM ≥ GM ≥ HM" },
        { name: "Sum of Special Series", formula: "Σn = n(n+1)/2" }
      ]
    },
    {
      chapter: "Trigonometry",
      topics: [
        { name: "Basic Ratios", formula: "sin, cos, tan, cosec, sec, cot" },
        { name: "Pythagorean Identities", formula: "sin²θ + cos²θ = 1" },
        { name: "Compound Angles", formula: "sin(A+B) = sinAcosB + cosAsinB" },
        { name: "Multiple Angles", formula: "sin2θ = 2sinθcosθ" }
      ]
    },
    {
      chapter: "Coordinate Geometry",
      topics: [
        { name: "Distance Formula", formula: "d = √((x₂-x₁)²+(y₂-y₁)²)" },
        { name: "Straight Lines", formula: "y = mx+c" },
        { name: "Circles", formula: "(x-h)²+(y-k)² = r²" },
        { name: "Parabola", formula: "y² = 4ax" },
        { name: "Ellipse", formula: "x²/a² + y²/b² = 1" }
      ]
    },
    {
      chapter: "Calculus — Differentiation",
      topics: [
        { name: "Basic Derivatives", formula: "d/dx(xⁿ) = nxⁿ⁻¹" },
        { name: "Chain Rule", formula: "dy/dx = dy/du · du/dx" },
        { name: "Product Rule", formula: "d/dx(uv) = u'v + uv'" },
        { name: "Applications", formula: "Maxima, minima, rate of change" }
      ]
    },
    {
      chapter: "Calculus — Integration",
      topics: [
        { name: "Basic Integrals", formula: "∫xⁿdx = xⁿ⁺¹/(n+1) + C" },
        { name: "Integration by Parts", formula: "∫udv = uv - ∫vdu" },
        { name: "Definite Integrals", formula: "∫[a to b]f(x)dx = F(b)-F(a)" },
        { name: "Area under Curve", formula: "A = ∫[a to b]|f(x)|dx" }
      ]
    }
  ]
};

// Initialize app
window.onload = async function() {
  await checkLoginStatus();
};

async function checkLoginStatus() {
  try {
    const res = await fetch('/api/user');
    const user = await res.json();
    if (user.logged_in) {
      userName = user.name;
      examTarget = user.exam_target;
      daysLeft = user.days_left;
      if (!examTarget || !daysLeft) {
        showScreen('onboarding');
      } else {
        await loadProgressFromDB();
        await loadBanFromDB();
        setupDashboard();
        showScreen('dashboard');
      }
    } else {
      showScreen('landing');
    }
  } catch (e) {
    showScreen('landing');
  }
}

async function loadProgressFromDB() {
  try {
    const res = await fetch('/api/progress');
    completedTopics = await res.json();
  } catch (e) {
    completedTopics = {};
  }
}

async function loadBanFromDB() {
  try {
    const res = await fetch('/api/ban');
    const ban = await res.json();
    const now = Date.now();
    if (ban.is_banned && ban.ban_end_time > now) {
      isBanned = true;
      banEndTime = ban.ban_end_time;
      warningCount = ban.warning_count;
    } else {
      isBanned = false;
      banEndTime = null;
      warningCount = ban.warning_count || 0;
    }
  } catch (e) {
    warningCount = 0;
  }
}

async function saveBanToDB() {
  try {
    await fetch('/api/ban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        warning_count: warningCount,
        is_banned: isBanned,
        ban_end_time: banEndTime || 0
      })
    });
  } catch (e) {}
}

function setupDashboard() {
  document.getElementById('dashWelcome').textContent = `Hey ${userName.split(' ')[0]}! 👋`;
  document.getElementById('dashExam').textContent = `${examTarget} • ${daysLeft} days left`;
  document.getElementById('dashDays').textContent = daysLeft;
  updateProgress();
}

async function saveSetup() {
  examTarget = document.getElementById('examType').value;
  daysLeft = document.getElementById('daysLeft').value;
  let struggle = document.getElementById('struggle').value;
  if (struggle === 'other') {
    struggle = document.getElementById('otherStruggle').value || 'general struggles';
  }
  if (!examTarget || !daysLeft || !struggle) {
    alert('Please fill all fields bhai! 🙏');
    return;
  }
  try {
    await fetch('/api/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examTarget, daysLeft, struggle })
    });
    setupDashboard();
    showScreen('dashboard');
  } catch (e) {
    alert('Something went wrong! Try again.');
  }
}

async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  userName = '';
  examTarget = '';
  daysLeft = '';
  conversationHistory = [];
  completedTopics = {};
  showScreen('landing');
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'syllabus') renderSyllabus(currentTab);
  if (id === 'dashboard') updateProgress();
}

function toggleOther(select) {
  const otherGroup = document.getElementById('otherGroup');
  otherGroup.style.display = select.value === 'other' ? 'block' : 'none';
}

function getTotalTopics() {
  let total = 0;
  Object.values(syllabus).forEach(subject => {
    subject.forEach(chapter => { total += chapter.topics.length; });
  });
  return total;
}

function getCompletedCount() {
  return Object.values(completedTopics).filter(Boolean).length;
}

function updateProgress() {
  const total = getTotalTopics();
  const completed = getCompletedCount();
  const percent = Math.round((completed / total) * 100);
  const bar = document.getElementById('overallProgress');
  const label = document.getElementById('progressLabel');
  const syllabusProgress = document.getElementById('syllabusProgress');
  if (bar) bar.style.width = percent + '%';
  if (label) label.textContent = `${completed} of ${total} topics completed`;
  if (syllabusProgress) syllabusProgress.textContent = `${percent}% Complete`;
}

function switchTab(tab, event) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (event) event.target.classList.add('active');
  renderSyllabus(tab);
}

function renderSyllabus(subject) {
  const container = document.getElementById('syllabusContent');
  container.innerHTML = '';
  syllabus[subject].forEach((chapter, ci) => {
    const completed = chapter.topics.filter(
      t => completedTopics[`${subject}_${ci}_${t.name}`]
    ).length;
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.innerHTML = `
      <div class="chapter-header" onclick="toggleChapter(this)">
        <div class="chapter-name">${chapter.chapter}</div>
        <div class="chapter-meta">
          <span class="chapter-count">${completed}/${chapter.topics.length}</span>
          <span class="chapter-arrow">▼</span>
        </div>
      </div>
      <div class="topics-list">
        ${chapter.topics.map((topic, ti) => {
          const key = `${subject}_${ci}_${topic.name}`;
          const done = completedTopics[key] || false;
          return `
            <div class="topic-item ${done ? 'topic-done' : ''}" id="topic_${subject}_${ci}_${ti}">
              <input type="checkbox" class="topic-checkbox" ${done ? 'checked' : ''}
                onchange="toggleTopic('${subject}', ${ci}, ${ti}, '${topic.name}', this)"/>
              <div class="topic-info">
                <div class="topic-name">${topic.name}</div>
                <span class="topic-formula">${topic.formula}</span>
              </div>
            </div>`;
        }).join('')}
      </div>
    `;
    container.appendChild(card);
  });
}

function toggleChapter(header) {
  const topicsList = header.nextElementSibling;
  const arrow = header.querySelector('.chapter-arrow');
  topicsList.classList.toggle('open');
  arrow.classList.toggle('open');
}

async function toggleTopic(subject, ci, ti, topicName, checkbox) {
  const key = `${subject}_${ci}_${topicName}`;
  completedTopics[key] = checkbox.checked;
  const topicItem = document.getElementById(`topic_${subject}_${ci}_${ti}`);
  if (checkbox.checked) {
    topicItem.classList.add('topic-done');
  } else {
    topicItem.classList.remove('topic-done');
  }
  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_key: key, completed: checkbox.checked })
    });
  } catch (e) {}
  updateProgress();
}

function containsGaali(text) {
  const lower = text.toLowerCase();
  return badWords.some(word => lower.includes(word));
}

function checkBanStatus() {
  if (isBanned && banEndTime) {
    const remaining = Math.ceil((banEndTime - Date.now()) / 1000);
    if (remaining <= 0) {
      isBanned = false;
      banEndTime = null;
      warningCount = 0;
      saveBanToDB();
      const input = document.getElementById('chatInput');
      if (input) {
        input.disabled = false;
        input.placeholder = 'Ask JEEmaXXer anything...';
      }
      return false;
    }
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    const input = document.getElementById('chatInput');
    if (input) input.placeholder = `🚫 Banned for ${mins}m ${secs}s — chill kar bhai`;
    return true;
  }
  return false;
}

function addBotMsg(text) {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `
    <div class="msg-avatar">JX</div>
    <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMsg(text) {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="msg-avatar">JX</div>
    <div class="msg-bubble">
      <div class="typing"><span></span><span></span><span></span></div>
    </div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

async function getBotReply(userMessage) {
  try {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        userName: userName,
        examTarget: examTarget,
        daysLeft: daysLeft,
        history: conversationHistory
      })
    });
    const data = await response.json();
    return data.reply;
  } catch (error) {
    return "Bhai network issue aa gaya 😭 ek baar phir try kar!";
  }
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  if (checkBanStatus()) return;

  if (containsGaali(text)) {
    warningCount++;
    input.value = '';
    await saveBanToDB();
    if (warningCount === 1) {
      addBotMsg("⚠️ Bhai ye JEE prep ka platform hai — thodi respect rakh. Ek warning ho gayi, ek aur aayi toh 10 min ke liye chat band 🙏");
      return;
    }
    if (warningCount >= 2) {
      addBotMsg("🚫 Done bhai — 10 minute ke liye chat band. Thanda ho ja, phir milte hain 😤");
      isBanned = true;
      banEndTime = Date.now() + (10 * 60 * 1000);
      await saveBanToDB();
      input.disabled = true;
      input.placeholder = '🚫 10 min ban — chill kar bhai';
      const countdown = setInterval(() => {
        if (!checkBanStatus()) {
          clearInterval(countdown);
          addBotMsg("✅ Theek hai bhai — wapas aa gaya! Ab padhai karte hain? 🔥");
        }
      }, 1000);
      return;
    }
  }

  input.value = '';
  input.disabled = true;
  addUserMsg(text);
  conversationHistory.push({ role: 'user', content: text });
  showTyping();
  const reply = await getBotReply(text);
  removeTyping();
  addBotMsg(reply);
  input.disabled = false;
  input.focus();
  conversationHistory.push({ role: 'assistant', content: reply });
}

async function sendQuick(text) {
  if (checkBanStatus()) return;
  if (containsGaali(text)) return;
  addUserMsg(text);
  conversationHistory.push({ role: 'user', content: text });
  showTyping();
  const reply = await getBotReply(text);
  removeTyping();
  addBotMsg(reply);
  conversationHistory.push({ role: 'assistant', content: reply });
}