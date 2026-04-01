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

// Aplica máscara em todos os campos WhatsApp já presentes no DOM
document.querySelectorAll('input[name="whatsapp"], .wpp-mask').forEach(function (el) {
  el.addEventListener('input', applyWppMask);
});

// ─── 3. Seleção de turmas — múltipla seleção, sincronizada ───────────
var turmasInput = document.getElementById('turmas-selecionadas');

// Mapa de turmaId → value para manter estado
var turmasSelecionadas = {};

function updateTurmasInput() {
  turmasInput.value = Object.values(turmasSelecionadas).join(', ');
}

function toggleTurma(turmaId, value) {
  if (turmasSelecionadas[turmaId]) {
    // Já selecionado — remove
    delete turmasSelecionadas[turmaId];
    document.querySelectorAll('[data-turma-id="' + turmaId + '"]').forEach(function (c) {
      c.classList.remove('selected');
    });
  } else {
    // Não selecionado — adiciona
    turmasSelecionadas[turmaId] = value;
    document.querySelectorAll('[data-turma-id="' + turmaId + '"]').forEach(function (c) {
      c.classList.add('selected');
    });
  }
  updateTurmasInput();
  // Limpa erro de turma
  setFieldError('turma', '');
}

document.querySelectorAll('.turma-card').forEach(function (card) {
  card.addEventListener('click', function () {
    toggleTurma(card.dataset.turmaId, card.dataset.value);
  });
});

// ─── 4. Toggle de amigos ───────────────────────────────────────────────
var toggleAmigos    = document.getElementById('toggle-amigos');
var amigosBloco     = document.getElementById('amigos-bloco');
var amigosContainer = document.getElementById('amigos-container');
var btnAddAmigo     = document.getElementById('btn-add-amigo');
var amigoCount      = 1;

toggleAmigos.addEventListener('change', function () {
  if (this.checked) {
    amigosBloco.style.maxHeight = amigosBloco.scrollHeight + 'px';
    amigosBloco.style.opacity   = '1';
  } else {
    amigosBloco.style.maxHeight = '0';
    amigosBloco.style.opacity   = '0';
  }
});

btnAddAmigo.addEventListener('click', function () {
  if (amigoCount >= 3) return;
  amigoCount++;

  var entry = document.createElement('div');
  entry.className = 'amigo-entry';
  entry.innerHTML =
    '<p class="amigo-entry__label">AMIGO ' + amigoCount + '</p>' +
    '<div class="form__group">' +
      '<label class="form__label">Nome</label>' +
      '<input type="text" name="amigo_nome_' + amigoCount + '" class="form__input" placeholder="Nome do amigo">' +
    '</div>' +
    '<div class="form__group">' +
      '<label class="form__label">E-mail</label>' +
      '<input type="email" name="amigo_email_' + amigoCount + '" class="form__input" placeholder="email@exemplo.com">' +
    '</div>' +
    '<div class="form__group" style="margin-bottom:0">' +
      '<label class="form__label">WhatsApp</label>' +
      '<input type="tel" name="amigo_whatsapp_' + amigoCount + '" class="form__input wpp-mask" placeholder="(11) 99999-9999">' +
    '</div>';

  // Aplica máscara nos campos de amigo recém-criados
  entry.querySelectorAll('.wpp-mask').forEach(function (el) {
    el.addEventListener('input', applyWppMask);
  });

  amigosContainer.appendChild(entry);

  // Atualiza a altura do bloco expandido
  amigosBloco.style.maxHeight = amigosBloco.scrollHeight + 'px';

  if (amigoCount >= 3) {
    btnAddAmigo.style.display = 'none';
  }
});

// ─── 5. Helpers de validação ───────────────────────────────────────────
function getVal(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function getRadio(name) {
  var el = document.querySelector('input[name="' + name + '"]:checked');
  return el ? el.value : '';
}

function getCheckboxArray(name) {
  return Array.from(
    document.querySelectorAll('input[name="' + name + '"]:checked')
  ).map(function (cb) { return cb.value; });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Exibe ou limpa o erro de um campo
function setFieldError(field, msg) {
  var errEl   = document.getElementById('error-' + field);
  var inputEl = document.getElementById(field);

  if (errEl)   { errEl.textContent = msg; }
  if (inputEl) { inputEl.classList.toggle('is-err', msg !== ''); }
}

// ─── 6. Limpar erros ao corrigir ──────────────────────────────────────
['nome', 'whatsapp', 'email', 'empresa', 'profissao', 'expectativas'].forEach(function (id) {
  var el = document.getElementById(id);
  if (el) { el.addEventListener('input', function () { setFieldError(id, ''); }); }
});

['nivel_ia', 'programacao', 'conhece_geo'].forEach(function (name) {
  document.querySelectorAll('input[name="' + name + '"]').forEach(function (el) {
    el.addEventListener('change', function () { setFieldError(name, ''); });
  });
});

document.getElementById('autorizacao').addEventListener('change', function () {
  setFieldError('autorizacao', '');
});

// ─── 7. Coleta de amigos indicados ────────────────────────────────────
function coletarAmigos() {
  if (!toggleAmigos.checked) return '';

  var partes = [];
  for (var i = 1; i <= amigoCount; i++) {
    var nomeEl = document.querySelector('[name="amigo_nome_' + i + '"]');
    var emailEl = document.querySelector('[name="amigo_email_' + i + '"]');
    var wppEl   = document.querySelector('[name="amigo_whatsapp_' + i + '"]');

    var nome  = nomeEl  ? nomeEl.value.trim()  : '';
    var email = emailEl ? emailEl.value.trim() : '';
    var wpp   = wppEl   ? wppEl.value.trim()   : '';

    if (nome || email || wpp) {
      partes.push([nome, email, wpp].filter(Boolean).join('|'));
    }
  }
  return partes.join(' / ');
}

// ─── 8. Envio do formulário ────────────────────────────────────────────
var form         = document.getElementById('inscricao-form');
var submitBtn    = document.getElementById('btn-submit');
var networkError = document.getElementById('form-network-error');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Limpa todos os erros anteriores
  ['nome', 'whatsapp', 'email', 'empresa', 'profissao',
   'nivel_ia', 'programacao', 'conhece_geo', 'expectativas',
   'turma', 'autorizacao'].forEach(function (f) { setFieldError(f, ''); });

  networkError.hidden      = true;
  networkError.textContent = '';

  // ── Coleta de valores ────────────────────────────────────────────────
  var nome         = getVal('nome');
  var whatsapp     = getVal('whatsapp');
  var email        = getVal('email');
  var empresa      = getVal('empresa');
  var profissao    = getVal('profissao');
  var nivel_ia     = getRadio('nivel_ia');
  var ias_usadas   = getCheckboxArray('ias_usadas');
  var programacao  = getRadio('programacao');
  var conhece_geo  = getRadio('conhece_geo');
  var expectativas = getVal('expectativas');
  var turma        = turmasInput.value.trim();
  var autorizacao  = document.getElementById('autorizacao').checked;
  var wppDigits    = whatsapp.replace(/\D/g, '');

  // ── Validação ────────────────────────────────────────────────────────
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

  if (!empresa)
    markError('empresa', 'Por favor, informe sua empresa.');

  if (!profissao)
    markError('profissao', 'Por favor, informe sua profissão.');

  if (!nivel_ia)
    markError('nivel_ia', 'Selecione seu nível de uso de IA.');

  if (!programacao)
    markError('programacao', 'Responda se você tem noções de programação.');

  if (!conhece_geo)
    markError('conhece_geo', 'Responda se você conhece GEO.');

  if (expectativas.length < 20)
    markError('expectativas', 'Descreva suas expectativas (mínimo 20 caracteres).');

  if (!turma)
    markError('turma', 'Selecione ao menos uma data de interesse.');

  if (!autorizacao)
    markError('autorizacao', 'É necessário autorizar as comunicações para prosseguir.');

  // Rola até o primeiro erro
  if (firstErrorField) {
    var errEl = document.getElementById('error-' + firstErrorField);
    if (errEl) { errEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    return;
  }

  // ── Estado de envio ──────────────────────────────────────────────────
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Enviando...';

  // ── Monta objeto de dados ────────────────────────────────────────────
  var dados = {
    nome:         nome,
    whatsapp:     whatsapp,
    email:        email,
    empresa:      empresa,
    profissao:    profissao,
    nivel_ia:     nivel_ia,
    ias_usadas:   ias_usadas,
    programacao:  programacao,
    conhece_geo:  conhece_geo,
    expectativas: expectativas,
    turma:        turma,
    amigos:       coletarAmigos(),
    autorizacao:  true
  };

  // ── Fetch (no-cors) com timeout de 5s ───────────────────────────────
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
    // Erro de rede real — sem acesso à internet
    console.warn('Ranqia — erro de rede:', err);
    networkError.textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
    networkError.hidden      = false;
    networkError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Enviar inscrição';
    return;
  }

  // ── Mostra confirmação (fetch resolveu ou timeout atingido) ──────────
  document.getElementById('inscricao').style.display = 'none';
  var conf = document.getElementById('confirmacao');
  conf.style.display = 'block';
  conf.scrollIntoView({ behavior: 'smooth' });
});
