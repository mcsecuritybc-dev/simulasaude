(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const STORAGE_KEY = "sav_platform_v2";

  const state = {
    view: "home",
    gameTab: "memory",
    stats: { answered: 0, correct: 0, wins: 0 },

    quiz: { areaKey: null, list: [], index: 0, score: 0, locked: false, targetCount: 10, mode: "random" },
    caseCurrent: null,

    sim: { current: null, step: 0, locked: false, hint: "" },

    memory: { deck: [], first: null, second: null, lock: false, matched: 0, sizePairs: 8, timerSec: 180, timerId: null },

    hang: { word: "", hint: "", guessed: new Set(), wrong: 0, maxWrong: 6, active: false },

    ws: { size: 12, grid: [], words: [], found: new Set(), selected: [], timerSec: 180, timerId: null },
  };

  // ===== UTIL =====
  const saveStats = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stats));
  const loadStats = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (!s || typeof s !== "object") return;
      state.stats.answered = s.answered || 0;
      state.stats.correct = s.correct || 0;
      state.stats.wins = s.wins || 0;
    } catch (_) {}
  };

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const fmtTime = (sec) => {
    const s = Math.max(0, sec);
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const r = String(s % 60).padStart(2, "0");
    return `${m}:${r}`;
  };

  const isMobile = () => window.matchMedia("(max-width: 980px)").matches;

  // ===== SIDEBAR / BACKDROP =====
  const ensureBackdrop = () => {
    let b = $("#backdrop");
    if (b) return b;
    b = document.createElement("div");
    b.id = "backdrop";
    b.className = "backdrop";
    document.body.appendChild(b);
    b.addEventListener("click", () => closeSidebar());
    return b;
  };

  const openSidebar = () => {
    const sb = $("#sidebar");
    const bd = ensureBackdrop();
    sb.classList.remove("collapsed");
    if (isMobile()) bd.classList.add("show");
  };

  const closeSidebar = () => {
    const sb = $("#sidebar");
    const bd = ensureBackdrop();
    if (isMobile()) sb.classList.add("collapsed");
    bd.classList.remove("show");
  };

  const toggleSidebar = () => {
    const sb = $("#sidebar");
    if (sb.classList.contains("collapsed")) openSidebar();
    else closeSidebar();
  };

  const applySidebarMode = () => {
    const sb = $("#sidebar");
    const bd = ensureBackdrop();
    if (isMobile()) {
      sb.classList.add("collapsed"); // ✅ no celular começa fechado
      bd.classList.remove("show");
    } else {
      sb.classList.remove("collapsed"); // ✅ no desktop fica aberto
      bd.classList.remove("show");
    }
  };

  // ===== NAV/VIEWS =====
  const setViewMeta = (title, subtitle) => {
    $("#viewTitle").textContent = title;
    $("#viewSubtitle").textContent = subtitle;
  };

  const showView = (key) => {
    state.view = key;

    $$(".view").forEach((v) => v.classList.add("hidden"));
    $("#view-" + key).classList.remove("hidden");

    $$(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === key));

    const meta = {
      home: ["Início", "Treinamento interativo para dinâmicas hospitalares"],
      quiz: ["Quiz", "Perguntas rotativas com justificativa após responder"],
      cases: ["Casos Clínicos", "Decisão rápida com tema e dica opcional"],
      sims: ["Simulações", "Filtros por área, nível e profissão"],
      games: ["Jogos", "Memória, Forca e Caça-Palavras"],
      ecg: ["Leitura ECG", "Monitor interativo: ritmos e velocidade"],
      qr: ["QR Code", "Acesso rápido para os alunos"],
    };
    const [t, s] = meta[key] || ["Plataforma", ""];
    setViewMeta(t, s);

    if (key === "qr") updateQRLink();
    if (key === "games") setGameTab(state.gameTab);

    // ✅ ao navegar no celular, fecha o menu para liberar tela
    if (isMobile()) closeSidebar();
  };

  // ===== STATS UI =====
  const renderStats = () => {
    $("#statQuizAnswered").textContent = String(state.stats.answered);
    const acc = state.stats.answered ? Math.round((state.stats.correct / state.stats.answered) * 100) : 0;
    $("#statQuizAccuracy").textContent = acc + "%";
    $("#statGamesWins").textContent = String(state.stats.wins);
  };

  // ===== HOME chips =====
  const renderAreaChips = () => {
    const chips = $("#chipsAreas");
    chips.innerHTML = "";
    Object.keys(window.SAV_DATA.BANKS).forEach((k) => {
      const el = document.createElement("div");
      el.className = "chip";
      el.textContent = k;
      chips.appendChild(el);
    });
  };

  // ===== QUIZ =====
  const fillQuizAreas = () => {
    const sel = $("#quizArea");
    sel.innerHTML = "";
    Object.keys(window.SAV_DATA.BANKS).forEach((k) => {
      const op = document.createElement("option");
      op.value = k;
      op.textContent = k;
      sel.appendChild(op);
    });
  };

  const startQuiz = () => {
    const areaKey = $("#quizArea").value;
    const count = parseInt($("#quizCount").value, 10);
    const mode = $("#quizMode").value;

    const base = window.SAV_DATA.BANKS[areaKey] || [];
    const list = mode === "random" ? shuffle(base) : [...base];

    state.quiz.areaKey = areaKey;
    state.quiz.list = list;
    state.quiz.index = 0;
    state.quiz.score = 0;
    state.quiz.locked = false;
    state.quiz.targetCount = count;
    state.quiz.mode = mode;

    $("#quizPanel").classList.remove("hidden");
    $("#quizPanelTitle").textContent = "Quiz • " + areaKey;
    renderQuizQuestion();
  };

  const stopQuiz = () => {
    $("#quizPanel").classList.add("hidden");
    $("#quizFeedback").classList.add("hidden");
    $("#btnQuizNext").classList.add("hidden");
    state.quiz.locked = false;
  };

  const renderQuizQuestion = () => {
    const totalTarget = state.quiz.targetCount === 9999
      ? state.quiz.list.length
      : Math.min(state.quiz.targetCount, state.quiz.list.length);

    if (state.quiz.index >= totalTarget) {
      const msg = `Quiz finalizado. Pontuação: ${state.quiz.score}.`;
      const fb = $("#quizFeedback");
      fb.textContent = msg;
      fb.className = "feedback good";
      fb.classList.remove("hidden");
      $("#quizOptions").innerHTML = "";
      $("#btnQuizNext").classList.add("hidden");
      $("#quizProgress").textContent = `${totalTarget}/${totalTarget}`;
      $("#quizScore").textContent = `Pontuação: ${state.quiz.score}`;
      return;
    }

    const q = state.quiz.list[state.quiz.index];
    $("#quizQuestion").textContent = q.q;
    $("#quizOptions").innerHTML = "";
    $("#quizFeedback").classList.add("hidden");
    $("#btnQuizNext").classList.add("hidden");
    state.quiz.locked = false;

    q.options.forEach((txt, idx) => {
      const btn = document.createElement("button");
      btn.className = "opt";
      btn.type = "button";
      btn.textContent = txt;
      btn.addEventListener("click", () => answerQuiz(idx));
      $("#quizOptions").appendChild(btn);
    });

    $("#quizProgress").textContent = `${state.quiz.index + 1}/${totalTarget}`;
    $("#quizScore").textContent = `Pontuação: ${state.quiz.score}`;
  };

  const answerQuiz = (idx) => {
    if (state.quiz.locked) return;
    state.quiz.locked = true;

    const q = state.quiz.list[state.quiz.index];
    const correctIdx = q.answer;

    const opts = $$("#quizOptions .opt");
    opts.forEach((b, i) => {
      if (i === correctIdx) b.classList.add("correct");
      if (i === idx && idx !== correctIdx) b.classList.add("wrong");
      b.disabled = true;
    });

    state.stats.answered += 1;

    let fbClass = "feedback bad";
    let head = "Incorreto. ";
    if (idx === correctIdx) {
      state.stats.correct += 1;
      state.quiz.score += 10;
      fbClass = "feedback good";
      head = "Correto. ";
    } else {
      state.quiz.score = Math.max(0, state.quiz.score - 2);
    }

    saveStats();
    renderStats();

    const explanation = (q.explain && String(q.explain).trim().length > 0)
      ? q.explain
      : "Justificativa não disponível para esta questão (adicione o campo explain em assets/js/data.js).";

    const fb = $("#quizFeedback");
    fb.className = fbClass;
    fb.textContent = head + explanation;
    fb.classList.remove("hidden");

    $("#quizScore").textContent = `Pontuação: ${state.quiz.score}`;
    $("#btnQuizNext").classList.remove("hidden");
  };

  const nextQuiz = () => {
    state.quiz.index += 1;
    renderQuizQuestion();
  };

  // ===== CASES =====
  const newCase = () => {
    const pool = shuffle(window.SAV_DATA.CASES);
    state.caseCurrent = pool[0];

    $("#caseTheme").textContent = "Tema: " + state.caseCurrent.theme;
    $("#caseArea").textContent = "Área: " + state.caseCurrent.area;
    $("#caseLevel").textContent = "Nível: " + state.caseCurrent.level;
    $("#caseProf").textContent = "Profissão: " + state.caseCurrent.profession;

    $("#caseText").textContent = state.caseCurrent.text;
    $("#caseOptions").innerHTML = "";
    $("#caseFeedback").classList.add("hidden");

    state.caseCurrent.options.forEach((txt, i) => {
      const btn = document.createElement("button");
      btn.className = "opt";
      btn.type = "button";
      btn.textContent = txt;
      btn.addEventListener("click", () => answerCase(i));
      $("#caseOptions").appendChild(btn);
    });
  };

  const answerCase = (idx) => {
    const c = state.caseCurrent;
    if (!c) return;

    const correctIdx = c.answer;
    const opts = $$("#caseOptions .opt");
    opts.forEach((b, i) => {
      if (i === correctIdx) b.classList.add("correct");
      if (i === idx && idx !== correctIdx) b.classList.add("wrong");
      b.disabled = true;
    });

    const ok = idx === correctIdx;
    const fb = $("#caseFeedback");
    fb.className = ok ? "feedback good" : "feedback bad";
    fb.textContent = ok
      ? "Conduta adequada para o cenário."
      : "Conduta inadequada. Reavalie segurança do paciente e sequência do protocolo.";
    fb.classList.remove("hidden");

    state.stats.answered += 1;
    if (ok) state.stats.correct += 1;
    saveStats();
    renderStats();
  };

  const caseHint = () => {
    const c = state.caseCurrent;
    if (!c) return;
    const fb = $("#caseFeedback");
    fb.className = "feedback warn";
    fb.textContent = "Dica: " + c.hint;
    fb.classList.remove("hidden");
  };

  // ===== SIMULATIONS =====
  const fillSimFilters = () => {
    const sims = window.SAV_DATA.SIMS;

    const areas = ["Todas", ...Array.from(new Set(sims.map(s => s.area)))];
    const levels = ["Todos", ...Array.from(new Set(sims.map(s => s.level)))];
    const profs = ["Todas", ...Array.from(new Set(sims.map(s => s.profession)))];

    const fill = (selId, list) => {
      const sel = $(selId);
      sel.innerHTML = "";
      list.forEach(v => {
        const op = document.createElement("option");
        op.value = v;
        op.textContent = v;
        sel.appendChild(op);
      });
    };

    fill("#simArea", areas);
    fill("#simLevel", levels);
    fill("#simProf", profs);
  };

  const pickSimByFilter = () => {
    const area = $("#simArea").value;
    const level = $("#simLevel").value;
    const prof = $("#simProf").value;

    let pool = window.SAV_DATA.SIMS;
    if (area !== "Todas") pool = pool.filter(s => s.area === area);
    if (level !== "Todos") pool = pool.filter(s => s.level === level);
    if (prof !== "Todas") pool = pool.filter(s => s.profession === prof);

    if (!pool.length) pool = window.SAV_DATA.SIMS;
    return shuffle(pool)[0];
  };

  const startSim = () => {
    const sim = pickSimByFilter();
    state.sim.current = sim;
    state.sim.step = 0;
    state.sim.locked = false;
    state.sim.hint = sim.hint;

    $("#simFeedback").classList.add("hidden");
    $("#btnSimNext").classList.add("hidden");

    $("#simPrompt").textContent = `Simulação: ${sim.name}`;
    renderSimStep();
  };

  const renderVitals = (v) => {
    $("#vFC").textContent = v.FC ?? "—";
    $("#vFR").textContent = v.FR ?? "—";
    $("#vSPO2").textContent = v.SPO2 ?? "—";
    $("#vPA").textContent = v.PA ?? "—";
  };

  const renderSimStep = () => {
    const sim = state.sim.current;
    if (!sim) return;

    if (state.sim.step >= sim.steps.length) {
      const fb = $("#simFeedback");
      fb.className = "feedback good";
      fb.textContent = "Simulação finalizada. Refaça com outro filtro para treinar cenários diferentes.";
      fb.classList.remove("hidden");
      $("#simOptions").innerHTML = "";
      $("#simStep").textContent = "Etapa: final";
      $("#btnSimNext").classList.add("hidden");

      state.stats.wins += 1;
      saveStats();
      renderStats();
      return;
    }

    const step = sim.steps[state.sim.step];
    renderVitals(step.vitals);

    $("#simPrompt").textContent = step.prompt;
    $("#simOptions").innerHTML = "";
    $("#simFeedback").classList.add("hidden");
    $("#btnSimNext").classList.add("hidden");
    $("#simStep").textContent = `Etapa: ${state.sim.step + 1}/${sim.steps.length}`;

    state.sim.locked = false;
    step.options.forEach((o) => {
      const btn = document.createElement("button");
      btn.className = "opt";
      btn.type = "button";
      btn.textContent = o.t;
      btn.addEventListener("click", () => answerSim(o));
      $("#simOptions").appendChild(btn);
    });
  };

  const answerSim = (opt) => {
    if (state.sim.locked) return;
    state.sim.locked = true;

    const fb = $("#simFeedback");
    fb.className = opt.ok ? "feedback good" : "feedback bad";
    fb.textContent = opt.feedback;
    fb.classList.remove("hidden");

    $$("#simOptions .opt").forEach((b) => (b.disabled = true));
    $("#btnSimNext").classList.remove("hidden");
  };

  const nextSim = () => {
    state.sim.step += 1;
    renderSimStep();
  };

  const simHint = () => {
    if (!state.sim.current) return;
    const fb = $("#simFeedback");
    fb.className = "feedback warn";
    fb.textContent = "Dica: " + state.sim.hint;
    fb.classList.remove("hidden");
  };

  // ===== GAMES TABS =====
  const setGameTab = (tab) => {
    state.gameTab = tab;

    $$(".tab").forEach(b => b.classList.toggle("active", b.dataset.game === tab));
    $$(".game-panel").forEach(p => p.classList.add("hidden"));
    $("#game-" + tab).classList.remove("hidden");
  };

  // ===== MEMORY =====
  const stopMemoryTimer = () => { if (state.memory.timerId) clearInterval(state.memory.timerId); state.memory.timerId = null; };

  const startMemoryTimer = () => {
    stopMemoryTimer();
    state.memory.timerSec = 180;
    $("#memoryTimer").textContent = fmtTime(state.memory.timerSec);

    state.memory.timerId = setInterval(() => {
      state.memory.timerSec -= 1;
      $("#memoryTimer").textContent = fmtTime(state.memory.timerSec);

      if (state.memory.timerSec <= 0) {
        stopMemoryTimer();
        $("#memoryInfo").textContent = "Tempo encerrado. Nova rodada iniciada.";
        state.stats.wins += 1;
        saveStats();
        renderStats();
        startMemory();
      }
    }, 1000);
  };

  const buildMemoryDeck = () => {
    const pairs = window.SAV_DATA.MEMORY_PAIRS;
    const chosen = shuffle(pairs).slice(0, state.memory.sizePairs);

    const deck = [];
    chosen.forEach((p, idx) => {
      deck.push({ id: "p" + idx, type: "term", text: p.term, emoji: p.emoji || "🏥", revealed: false, matched: false });
      deck.push({ id: "p" + idx, type: "def", text: p.def, emoji: p.emoji || "🏥", revealed: false, matched: false });
    });

    state.memory.deck = shuffle(deck);
    state.memory.first = null;
    state.memory.second = null;
    state.memory.lock = false;
    state.memory.matched = 0;
  };

  const renderMemory = () => {
    const grid = $("#memoryGrid");
    grid.innerHTML = "";

    state.memory.deck.forEach((card, index) => {
      const el = document.createElement("button");
      el.className = "mem-card";
      el.type = "button";

      if (card.matched) el.classList.add("matched");
      if (card.revealed) el.classList.add("revealed");

      if (card.revealed || card.matched) {
        const emo = document.createElement("div");
        emo.className = "mem-emoji";
        emo.textContent = card.emoji || "🏥";

        const txt = document.createElement("div");
        txt.textContent = card.text;

        el.innerHTML = "";
        el.appendChild(emo);
        el.appendChild(txt);
      } else {
        el.innerHTML = `<div class="mem-emoji">🏥</div><div>SAV</div>`;
      }

      el.disabled = card.matched;
      el.addEventListener("click", () => flipMemory(index));
      grid.appendChild(el);
    });
  };

  const flipMemory = (index) => {
    if (state.memory.lock) return;
    const card = state.memory.deck[index];
    if (card.revealed || card.matched) return;

    card.revealed = true;
    renderMemory();

    if (state.memory.first === null) { state.memory.first = index; return; }

    state.memory.second = index;
    state.memory.lock = true;

    const c1 = state.memory.deck[state.memory.first];
    const c2 = state.memory.deck[state.memory.second];
    const isMatch = c1.id === c2.id && c1.type !== c2.type;

    setTimeout(() => {
      if (isMatch) {
        c1.matched = true; c2.matched = true;
        state.memory.matched += 1;

        if (state.memory.matched >= state.memory.sizePairs) {
          $("#memoryInfo").textContent = "Rodada concluída! Nova rodada em seguida.";
          state.stats.wins += 1; saveStats(); renderStats();
          setTimeout(() => startMemory(), 900);
          return;
        } else {
          $("#memoryInfo").textContent = `Acerto. Pares: ${state.memory.matched}/${state.memory.sizePairs}`;
        }
      } else {
        c1.revealed = false; c2.revealed = false;
        $("#memoryInfo").textContent = "Não combinou. Continue.";
      }

      state.memory.first = null; state.memory.second = null; state.memory.lock = false;
      renderMemory();
    }, 650);
  };

  const startMemory = () => {
    $("#memoryInfo").textContent = "Combine termo ↔ definição (com ícones).";
    buildMemoryDeck();
    renderMemory();
    startMemoryTimer();
  };

  const resetMemoryRound = () => {
    state.memory.deck.forEach((c) => { if (!c.matched) c.revealed = false; });
    state.memory.first = null; state.memory.second = null; state.memory.lock = false;
    $("#memoryInfo").textContent = "Rodada reiniciada.";
    renderMemory();
  };

  // ===== HANGMAN =====
  const newHangman = () => {
    const pool = window.SAV_DATA.HANGMAN_WORDS;
    const pick = shuffle(pool)[0];

    state.hang.word = pick.w.toUpperCase();
    state.hang.hint = pick.hint;
    state.hang.guessed = new Set();
    state.hang.wrong = 0;
    state.hang.active = true;

    $("#hangFeedback").classList.add("hidden");
    renderHangman();
    renderKeyboard();
  };

  const renderHangman = () => {
    const w = state.hang.word;
    const out = w.split("").map((ch) => (state.hang.guessed.has(ch) ? ch : "_")).join(" ");

    $("#hangWord").textContent = out;
    $("#hangStatus").textContent = `Tentativas restantes: ${state.hang.maxWrong - state.hang.wrong}`;

    const done = !out.includes("_");
    if (done && state.hang.active) {
      state.hang.active = false;
      const fb = $("#hangFeedback");
      fb.className = "feedback good";
      fb.textContent = "Você acertou!";
      fb.classList.remove("hidden");

      state.stats.wins += 1; saveStats(); renderStats();
      disableKeyboard();
    }

    if (state.hang.wrong >= state.hang.maxWrong && state.hang.active) {
      state.hang.active = false;
      const fb = $("#hangFeedback");
      fb.className = "feedback bad";
      fb.textContent = `Fim de jogo. Palavra: ${state.hang.word}`;
      fb.classList.remove("hidden");
      disableKeyboard();
    }
  };

  const renderKeyboard = () => {
    const kb = $("#hangKeyboard");
    kb.innerHTML = "";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    letters.split("").forEach((L) => {
      const b = document.createElement("button");
      b.className = "key";
      b.type = "button";
      b.textContent = L;
      b.addEventListener("click", () => guessLetter(L, b));
      kb.appendChild(b);
    });
  };

  const disableKeyboard = () => $$("#hangKeyboard .key").forEach((b) => (b.disabled = true));

  const guessLetter = (L, btn) => {
    if (!state.hang.active) return;
    if (state.hang.guessed.has(L)) return;

    state.hang.guessed.add(L);

    if (state.hang.word.includes(L)) btn.classList.add("good");
    else { btn.classList.add("bad"); state.hang.wrong += 1; }

    btn.disabled = true;
    renderHangman();
  };

  const hangmanHint = () => {
    if (!state.hang.word) return;
    const fb = $("#hangFeedback");
    fb.className = "feedback warn";
    fb.textContent = "Dica: " + state.hang.hint;
    fb.classList.remove("hidden");
  };

  // ===== WORDSEARCH =====
  const stopWsTimer = () => { if (state.ws.timerId) clearInterval(state.ws.timerId); state.ws.timerId = null; };
  const startWsTimer = () => {
    stopWsTimer();
    state.ws.timerSec = 180;
    $("#wsTimer").textContent = fmtTime(state.ws.timerSec);

    state.ws.timerId = setInterval(() => {
      state.ws.timerSec -= 1;
      $("#wsTimer").textContent = fmtTime(state.ws.timerSec);
      if (state.ws.timerSec <= 0) {
        stopWsTimer();
        showWsFeedback("Tempo encerrado. Novo caça-palavras iniciado.", "warn");
        state.stats.wins += 1; saveStats(); renderStats();
        newWordSearch();
      }
    }, 1000);
  };

  const randLetter = () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];

  const placeWord = (grid, word) => {
    const n = state.ws.size;
    const dirs = shuffle([{ dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }]);

    for (const d of dirs) {
      for (let tries = 0; tries < 80; tries++) {
        const x0 = Math.floor(Math.random() * n);
        const y0 = Math.floor(Math.random() * n);
        const x1 = x0 + d.dx * (word.length - 1);
        const y1 = y0 + d.dy * (word.length - 1);
        if (x1 < 0 || x1 >= n || y1 < 0 || y1 >= n) continue;

        let ok = true;
        for (let i = 0; i < word.length; i++) {
          const x = x0 + d.dx * i;
          const y = y0 + d.dy * i;
          const cell = grid[y][x];
          if (cell !== "" && cell !== word[i]) { ok = false; break; }
        }
        if (!ok) continue;

        for (let i = 0; i < word.length; i++) {
          const x = x0 + d.dx * i;
          const y = y0 + d.dy * i;
          grid[y][x] = word[i];
        }
        return true;
      }
    }
    return false;
  };

  const renderWsList = () => {
    const box = $("#wsList");
    box.innerHTML = "";
    state.ws.words.forEach(w => {
      const tag = document.createElement("div");
      tag.className = "ws-tag" + (state.ws.found.has(w) ? " done" : "");
      tag.textContent = w;
      box.appendChild(tag);
    });
  };

  const renderWsGrid = () => {
    const gridEl = $("#wsGrid");
    gridEl.innerHTML = "";
    for (let y = 0; y < state.ws.size; y++) {
      for (let x = 0; x < state.ws.size; x++) {
        const cell = document.createElement("button");
        cell.className = "ws-cell";
        cell.type = "button";
        cell.textContent = state.ws.grid[y][x];
        cell.dataset.x = String(x);
        cell.dataset.y = String(y);
        cell.addEventListener("click", () => wsSelectCell(x, y, cell));
        gridEl.appendChild(cell);
      }
    }
  };

  const wsClearSelection = () => {
    state.ws.selected = [];
    $("#wsCurrent").textContent = "—";
    $$(".ws-cell").forEach(c => c.classList.remove("sel"));
  };

  const showWsFeedback = (msg, kind) => {
    const fb = $("#wsFeedback");
    fb.className = "feedback " + (kind === "good" ? "good" : kind === "bad" ? "bad" : "warn");
    fb.textContent = msg;
    fb.classList.remove("hidden");
    setTimeout(() => fb.classList.add("hidden"), 1400);
  };

  const wsSelectedString = () => state.ws.selected.map(p => state.ws.grid[p.y][p.x]).join("");

  const wsMarkFound = () => {
    state.ws.selected.forEach(p => {
      const selector = `.ws-cell[data-x="${p.x}"][data-y="${p.y}"]`;
      const el = document.querySelector(selector);
      if (el) {
        el.classList.remove("sel");
        el.classList.add("found");
        el.disabled = true;
      }
    });
  };

  const wsSelectCell = (x, y, el) => {
    if (el.classList.contains("found")) return;
    if (state.ws.selected.some(p => p.x === x && p.y === y)) return;

    state.ws.selected.push({ x, y });
    el.classList.add("sel");

    const current = wsSelectedString();
    $("#wsCurrent").textContent = current || "—";

    if (state.ws.words.includes(current) && !state.ws.found.has(current)) {
      state.ws.found.add(current);
      wsMarkFound();
      renderWsList();
      showWsFeedback("Encontrou: " + current, "good");

      state.ws.selected = [];
      $("#wsCurrent").textContent = "—";

      if (state.ws.found.size === state.ws.words.length) {
        showWsFeedback("Você concluiu o caça-palavras! Novo em seguida.", "good");
        state.stats.wins += 1; saveStats(); renderStats();
        setTimeout(() => newWordSearch(), 1200);
      }
    } else {
      if (state.ws.selected.length >= 14) showWsFeedback("Seleção longa. Limpe e tente novamente.", "warn");
    }
  };

  const newWordSearch = () => {
    wsClearSelection();
    state.ws.found = new Set();

    const all = window.SAV_DATA.WORDSEARCH_WORDS || [];
    state.ws.words = shuffle(all).slice(0, 8).map(w => String(w).toUpperCase().replace(/[^A-Z0-9]/g, ""));
    renderWsList();

    const n = state.ws.size;
    const grid = Array.from({ length: n }, () => Array.from({ length: n }, () => ""));

    state.ws.words.forEach(w => placeWord(grid, w));

    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (grid[y][x] === "") grid[y][x] = randLetter();
      }
    }

    state.ws.grid = grid;
    renderWsGrid();
    startWsTimer();
    $("#wsCurrent").textContent = "—";
  };

  // ===== QR =====
  const updateQRLink = () => { $("#qrLink").textContent = window.location.href; };

  const makeQR = () => {
    updateQRLink();
    const link = window.location.href;
    const box = $("#qrBox");
    box.innerHTML = "";
    // eslint-disable-next-line no-undef
    new QRCode(box, { text: link, width: 220, height: 220, correctLevel: QRCode.CorrectLevel.M });
  };

  const copyLink = async () => {
    const link = window.location.href;
    try { await navigator.clipboard.writeText(link); alert("Link copiado."); }
    catch (e) { alert("Copie manualmente:\n\n" + link); }
  };

  // ===== RESET =====
  const resetAll = () => {
    const ok = confirm("Reiniciar estatísticas locais?");
    if (!ok) return;
    state.stats = { answered: 0, correct: 0, wins: 0 };
    saveStats();
    renderStats();
  };

  // ===== EVENTS =====
  const bindEvents = () => {
    $("#toggleSidebar").addEventListener("click", toggleSidebar);

    $$(".nav-item").forEach((b) => b.addEventListener("click", () => showView(b.dataset.view)));
    $$("[data-go]").forEach((b) => b.addEventListener("click", () => showView(b.dataset.go)));

    // Quiz
    $("#btnStartQuiz").addEventListener("click", startQuiz);
    $("#btnQuizNext").addEventListener("click", nextQuiz);
    $("#btnQuizStop").addEventListener("click", stopQuiz);
    $("#btnExitQuiz").addEventListener("click", () => showView("home"));

    // Cases
    $("#btnNewCase").addEventListener("click", newCase);
    $("#btnCaseHint").addEventListener("click", caseHint);

    // Sims
    $("#btnStartSim").addEventListener("click", startSim);
    $("#btnSimNext").addEventListener("click", nextSim);
    $("#btnSimHint").addEventListener("click", simHint);

    // Games tabs
    $$(".tab").forEach(t => t.addEventListener("click", () => setGameTab(t.dataset.game)));

    // Memory
    $("#btnStartMemory").addEventListener("click", startMemory);
    $("#btnMemoryReset").addEventListener("click", resetMemoryRound);

    // Hangman
    $("#btnNewHangman").addEventListener("click", newHangman);
    $("#btnHangmanHint").addEventListener("click", hangmanHint);

    // Wordsearch
    $("#btnWsNew").addEventListener("click", newWordSearch);
    $("#btnWsClear").addEventListener("click", () => wsClearSelection());

    // QR
    $("#btnMakeQR").addEventListener("click", makeQR);
    $("#btnCopyLink").addEventListener("click", copyLink);

    // reset
    $("#btnResetAll").addEventListener("click", resetAll);

    // Ajusta comportamento ao girar tela / mudar tamanho
    window.addEventListener("resize", applySidebarMode);
  };

  // ===== INIT =====
  const init = () => {
    loadStats();
    renderStats();
    renderAreaChips();
    fillQuizAreas();
    fillSimFilters();
    applySidebarMode();          // ✅ aqui está a correção principal
    showView("home");
    $("#year").textContent = String(new Date().getFullYear());
    bindEvents();

    $("#memoryTimer").textContent = "03:00";
    $("#wsTimer").textContent = "03:00";
  };

  document.addEventListener("DOMContentLoaded", init);
})();
