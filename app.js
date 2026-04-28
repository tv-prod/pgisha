'use strict';

// ── Quiz State ─────────────────────────────────────────────
let currentQuestion = 1;
const totalQuestions = 5;

let quizPhase, loadingScreen, vslPhase, progressBar, stepLabel, loadingFill, stickyCta;

document.addEventListener('DOMContentLoaded', function () {
  quizPhase     = document.getElementById('quiz-phase');
  loadingScreen = document.getElementById('loading-screen');
  vslPhase      = document.getElementById('vsl-phase');
  progressBar   = document.getElementById('quizProgressBar');
  stepLabel     = document.getElementById('quizStepLabel');
  loadingFill   = document.getElementById('loadingFill');
  stickyCta     = document.getElementById('stickyCta');

  updateProgress(1);
});

// ── Quiz ──────────────────────────────────────────────────
function selectOption(btn, questionNum) {
  btn.closest('.quiz-options').querySelectorAll('.quiz-option')
     .forEach(o => o.classList.remove('selected'));
  btn.classList.add('selected');
  setTimeout(() => {
    if (questionNum < totalQuestions) goToQuestion(questionNum + 1);
    else showLoadingScreen();
  }, 360);
}

function goToQuestion(num) {
  const cur = document.getElementById(`q${currentQuestion}`);
  const nxt = document.getElementById(`q${num}`);
  cur.classList.remove('active');
  cur.classList.add('exit');
  setTimeout(() => {
    cur.classList.remove('exit');
    cur.style.display = 'none';
    nxt.style.display = 'block';
    requestAnimationFrame(() => nxt.classList.add('active'));
    currentQuestion = num;
    updateProgress(num);
  }, 300);
}

function updateProgress(num) {
  progressBar.style.width = (num / totalQuestions * 100) + '%';
  stepLabel.textContent = `שאלה ${num} מתוך ${totalQuestions}`;
}

// ── Loading ───────────────────────────────────────────────
function showLoadingScreen() {
  quizPhase.classList.add('hidden');
  loadingScreen.classList.remove('hidden');
  let pct = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 4 + 1.5;
    if (pct >= 100) { pct = 100; clearInterval(iv); setTimeout(showVslPage, 350); }
    loadingFill.style.width = pct + '%';
  }, 75);
}

function showVslPage() {
  loadingScreen.classList.add('hidden');
  vslPhase.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });

  startCountdown();
  initStickyCta();
  initUrgencyBarScroll();
  initScrollReveal();
  initParallax();
  initCounters();
  animateHeroEntrance();
  startVslVideo();
}

// ── COUNTDOWN ─────────────────────────────────────────────
function startCountdown() {
  const KEY = 'hls_deadline';
  let deadline = parseInt(sessionStorage.getItem(KEY) || '0', 10);
  const now = Date.now();
  if (!deadline || deadline <= now) {
    deadline = now + 24 * 60 * 60 * 1000;
    sessionStorage.setItem(KEY, deadline);
  }
  function tick() {
    const diff = Math.max(0, deadline - Date.now());
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    const fmt = n => String(n).padStart(2, '0');
    const [hS, mS, sS] = [fmt(h), fmt(m), fmt(s)];

    const cdH = document.getElementById('cdH'); if (cdH) cdH.textContent = hS;
    const cdM = document.getElementById('cdM'); if (cdM) cdM.textContent = mS;
    const cdS = document.getElementById('cdS'); if (cdS) cdS.textContent = sS;
    const sTime = document.getElementById('stickyTime'); if (sTime) sTime.textContent = `${hS}:${mS}:${sS}`;
    const cTimer = document.getElementById('couponTimer'); if (cTimer) cTimer.textContent = `${hS}:${mS}:${sS}`;

    if (diff > 0) setTimeout(tick, 1000);
  }
  tick();
}

// ── Sticky CTA ────────────────────────────────────────────
function initStickyCta() {
  const heroCta  = document.getElementById('hero-cta');
  const buySection = document.getElementById('buy-section');
  if (!stickyCta) return;

  // Show sticky bar once hero CTA scrolls out of view
  if (heroCta) {
    const heroIo = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) stickyCta.classList.add('visible');
        else stickyCta.classList.remove('visible');
      },
      { threshold: 0.1 }
    );
    heroIo.observe(heroCta);
  }

  // Hide sticky bar when buy-section is visible (user is at bottom)
  if (buySection) {
    const buyIo = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) stickyCta.classList.remove('visible');
        else if (!document.getElementById('hero-cta') ||
                 !document.getElementById('hero-cta').getBoundingClientRect().bottom > 0)
          stickyCta.classList.add('visible');
      },
      { threshold: 0.15 }
    );
    buyIo.observe(buySection);
  }
}

// ── Urgency bar auto-hide on scroll ───────────────────────
function initUrgencyBarScroll() {
  const bar = document.getElementById('urgencyBar');
  if (!bar) return;
  let hidden = false;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled   = window.scrollY;
      const half       = pageHeight * 0.5;
      if (!hidden && scrolled > half) {
        bar.classList.add('bar-hidden');
        hidden = true;
      } else if (hidden && scrolled <= half) {
        bar.classList.remove('bar-hidden');
        hidden = false;
      }
      ticking = false;
    });
  }, { passive: true });
}

// ── SCROLL REVEAL ─────────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('[data-scroll-reveal]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || '0', 10);
        setTimeout(() => {
          e.target.classList.add('revealed');
        }, delay);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

// ── PARALLAX (hero dots + bg move slowly on scroll) ───────
function initParallax() {
  const heroBg   = document.getElementById('heroBg');
  const heroDots = document.getElementById('heroDots');
  if (!heroBg && !heroDots) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        if (heroBg)   heroBg.style.transform   = `translateY(${sy * 0.3}px)`;
        if (heroDots) heroDots.style.transform  = `translateY(${sy * 0.15}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ── COUNTER ANIMATION ─────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  const step = ts => {
    const elapsed = ts - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── HERO ENTRANCE ─────────────────────────────────────────
function animateHeroEntrance() {
  // Hero elements already handled by data-scroll-reveal which is
  // triggered on first paint since the hero is visible immediately
  document.querySelectorAll('.hero-section [data-scroll-reveal]').forEach((el, i) => {
    const delay = parseInt(el.dataset.delay || String(i * 80), 10);
    setTimeout(() => el.classList.add('revealed'), delay + 80);
  });
}

// —— VSL Video —————————————————————————————————————————————
function startVslVideo() {
  const iframe = document.getElementById('vsl-hero-iframe');
  if (!iframe) return;
  const src = iframe.dataset.src;
  if (src) iframe.src = src; // טוען רק עכשיו + autoplay=1
}

// ── Copy coupon ───────────────────────────────────────────
function copyCoupon() {
  navigator.clipboard.writeText('HOOK20').then(() => {
    const el = document.getElementById('copyCoupon');
    if (!el) return;
    const orig = el.textContent;
    el.textContent = '✅ הועתק!';
    setTimeout(() => { el.textContent = orig; }, 2000);
  }).catch(() => {});
}

// ── FAQ accordion ─────────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  // Open clicked if it was closed
  if (!isOpen) item.classList.add('open');
}

// ── Smooth anchor scroll ──────────────────────────────────
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const t = document.querySelector(a.getAttribute('href'));
  if (!t) return;
  e.preventDefault();
  t.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ── Background Parallax ──────────────────────────────────────
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.orb-parallax').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-speed'));
    if (!isNaN(speed)) {
      el.style.transform = `translateY(${scrollY * speed}px)`;
    }
  });
});

// ── Aggressive Elfsight Branding Removal ────────────────────
(function() {
  function removeElfsightBranding(root) {
    if (!root) return;
    // Remove in light DOM or within shadow root
    const badLinks = root.querySelectorAll('a[href*="elfsight.com"], .eapps-link, [class*="eapps-instagram-feed-title"]');
    badLinks.forEach(el => el.remove());
  }

  const observer = new MutationObserver(mutations => {
    // Check main document
    removeElfsightBranding(document);
    // Check inside any Elfsight app containers that might have shadow DOM
    const widgetWrappers = document.querySelectorAll('[class*="elfsight-app"]');
    widgetWrappers.forEach(wrap => {
      if (wrap.shadowRoot) removeElfsightBranding(wrap.shadowRoot);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial check
  setTimeout(() => removeElfsightBranding(document), 1000);
  setTimeout(() => removeElfsightBranding(document), 3000);
  setTimeout(() => removeElfsightBranding(document), 5000);
})();

// ── Form Submission ─────────────────────────────────────────
async function submitBooking(event) {
  event.preventDefault();
  const btn = document.getElementById('main-book-btn');
  const fName = document.getElementById('firstName').value.trim();
  const lName = document.getElementById('lastName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!fName || !lName || !phone || !email) {
    alert('אנא מלא את כל השדות כדי שנוכל לחזור אליך.');
    return;
  }

  const originalText = btn.innerHTML;
  btn.innerHTML = '⏳ שולח פרטים...';
  btn.style.opacity = '0.8';
  btn.style.pointerEvents = 'none';

  try {
    // ⬇️ שני היעדים שאליהם שולחים במקביל ⬇️
    const appsScriptURL = 'https://script.google.com/macros/s/AKfycbx9i2NuESAv_rQl1ftuU1VDoqgASjYNFKG2JHtS3Cx_oWXewS08-mxOT8QH6tsb5Eva/exec';
    const zapierURL     = 'https://hooks.zapier.com/hooks/catch/13094095/uv1vrxp/';

    // שליחה לגוגל שיטס (form data)
    const formData = new URLSearchParams();
    formData.append('firstName', fName);
    formData.append('lastName', lName);
    formData.append('phone', phone);
    formData.append('email', email);

    const sheetsRequest = fetch(appsScriptURL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });

    // שליחה לזאפיאר (JSON)
    const zapierRequest = fetch(zapierURL, {
      method: 'POST',
      body: JSON.stringify({
        fullName: fName + ' ' + lName,
        email: email,
        phone: phone.toString()
      })
    });

    // שולחים את שניהם במקביל ולא מחכים שאחד יסיים לפני השני
    await Promise.allSettled([sheetsRequest, zapierRequest]);

    btn.innerHTML = '✅ תודה רבה נשלח בהצלחה!';
    btn.style.background = '#00ff88';
    btn.style.color = '#001a10';
    btn.style.boxShadow = 'none';
    
    if (!document.getElementById('success-sub-msg')) {
      const subMsg = document.createElement('div');
      subMsg.id = 'success-sub-msg';
      subMsg.className = 'success-msg-sub';
      subMsg.innerHTML = 'ניצור קשר בקרוב.';
      btn.parentNode.insertBefore(subMsg, btn.nextSibling);
    }
    
    // ניקוי שדות
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';

  } catch (error) {
    console.error('Error!', error.message);
    btn.innerHTML = '❌ שגיאה בשליחה, נסה שוב';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    }, 3000);
  }
}
