// ─────────────────────────────────────────────────────────────────────────
// Workshop em IA · Ranqia — script.js
// ─────────────────────────────────────────────────────────────────────────

const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxiD1BMgyqlS5xg0DNJ_0ppd8a1cNsBfF2ctI-t0JpaTpPiReylZu4V1LL622EfA0sY/exec';

// ─── 1. IntersectionObserver — animações de entrada ───────────────────
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-in').forEach(function (el) {
    observer.observe(el);
  });
})();

// ─── 2. Máscara de WhatsApp ────────────────────────────────────────────
function applyWppMask(e) {
  var v = e.target.value.replace(/\D/g, '').substring(0, 11);
  if (v.length > 6) {
    v = '(' + v.substring(0, 2) + ') ' + v.substring(2, 7) + '-' + v.substring(7);
  } else if (v.length > 2) {
    v = '(' + v.substring(0, 2) + ') ' + v.substring(2);
  } else if (v.length > 0) {
    v = '(' + v;
  }
  e.target.value = v;
}

document.querySelectorAll('input[name="whatsapp"]').forEach(function (el) {
  el.addEventListener('input', applyWppMask);
});

// ─── 3. Helpers de validação ───────────────────────────────────────────
function getVal(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(field, msg) {
  var errEl   = document.getElementById('error-' + field);
  var inputEl = document.getElementById(field);
  if (errEl)   { errEl.textContent = msg; }
  if (inputEl) { inputEl.classList.toggle('is-err', msg !== ''); }
}

// ─── 4. Limpar erros ao corrigir ──────────────────────────────────────
['nome', 'whatsapp', 'email'].forEach(function (id) {
  var el = document.getElementById(id);
  if (el) { el.addEventListener('input', function () { setFieldError(id, ''); }); }
});

var autorizacaoEl = document.getElementById('autorizacao');
if (autorizacaoEl) {
  autorizacaoEl.addEventListener('change', function () { setFieldError('autorizacao', ''); });
}

// ─── 5. Envio do formulário ────────────────────────────────────────────
var form         = document.getElementById('aviso-form');
var submitBtn    = document.getElementById('btn-submit');
var networkError = document.getElementById('form-network-error');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  ['nome', 'whatsapp', 'email', 'autorizacao'].forEach(function (f) { setFieldError(f, ''); });

  networkError.hidden      = true;
  networkError.textContent = '';

  var nome       = getVal('nome');
  var whatsapp   = getVal('whatsapp');
  var email      = getVal('email');
  var autorizacao = document.getElementById('autorizacao').checked;
  var wppDigits  = whatsapp.replace(/\D/g, '');

  var firstErrorField = null;
  function markError(field, msg) {
    setFieldError(field, msg);
    if (!firstErrorField) firstErrorField = field;
  }

  if (nome.length < 3)
    markError('nome', 'Por favor, informe seu nome completo (mínimo 3 caracteres).');

  if (wppDigits.length < 10 || wppDigits.length > 11)
    markError('whatsapp', 'Por favor, informe um WhatsApp válido com DDD.');

  if (!isValidEmail(email))
    markError('email', 'Por favor, informe um e-mail válido.');

  if (!autorizacao)
    markError('autorizacao', 'É necessário autorizar as comunicações para prosseguir.');

  if (firstErrorField) {
    var errEl = document.getElementById('error-' + firstErrorField);
    if (errEl) { errEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    return;
  }

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Enviando...';

  var dados = {
    nome:        nome,
    whatsapp:    whatsapp,
    email:       email,
    tipo:        'aviso-proximas-turmas',
    autorizacao: true
  };

  var fetchPromise = fetch(ENDPOINT, {
    method:  'POST',
    mode:    'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(dados)
  });

  var timeoutPromise = new Promise(function (resolve) {
    setTimeout(function () { resolve('timeout'); }, 5000);
  });

  try {
    await Promise.race([fetchPromise, timeoutPromise]);
  } catch (err) {
    console.warn('Ranqia — erro de rede:', err);
    networkError.textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
    networkError.hidden      = false;
    networkError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Me avisem';
    return;
  }

  document.getElementById('inscricao').style.display = 'none';
  var conf = document.getElementById('confirmacao');
  conf.style.display = 'block';
  conf.scrollIntoView({ behavior: 'smooth' });
});
