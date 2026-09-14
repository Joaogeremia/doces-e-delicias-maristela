import { createClient } from '@supabase/supabase-js';

// URL correta do projeto Supabase.
const SUPABASE_URL = 'https://cmldypvguivvwymnpnyl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-QKdsvhcZskCvEREagS_LA_ThZ1oGBW';

const client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const originalSignInWithPassword = client.auth.signInWithPassword.bind(client.auth);

client.auth.signInWithPassword = async credentials => {
  const result = await originalSignInWithPassword(credentials);
  if (result.error) {
    console.error('[Maristela Auth Diagnostic]', {
      name: result.error.name,
      message: result.error.message,
      status: result.error.status,
      code: result.error.code,
    });
  }
  return result;
};

function showPasswordRecoveryModal() {
  if (document.getElementById('maristela-password-recovery')) return;

  const overlay = document.createElement('div');
  overlay.id = 'maristela-password-recovery';
  overlay.innerHTML = `
    <div class="maristela-recovery-card">
      <div class="maristela-recovery-brand">
        <span>M</span>
        <div><b>Doces e Delícias</b><small>da Maristela</small></div>
      </div>
      <div class="maristela-recovery-eyebrow">SEGURANÇA DA CONTA</div>
      <h2>Redefinir senha</h2>
      <p>Digite uma nova senha para acessar a Área da Maristela.</p>
      <form id="maristela-recovery-form">
        <label>Nova senha<div class="maristela-password-wrap"><input id="maristela-new-password" type="password" autocomplete="new-password" minlength="6" required placeholder="Mínimo de 6 caracteres"><button type="button" class="maristela-password-eye" data-target="maristela-new-password" aria-label="Mostrar senha">◉</button></div></label>
        <label>Confirmar senha<div class="maristela-password-wrap"><input id="maristela-confirm-password" type="password" autocomplete="new-password" minlength="6" required placeholder="Digite novamente"><button type="button" class="maristela-password-eye" data-target="maristela-confirm-password" aria-label="Mostrar senha">◉</button></div></label>
        <div id="maristela-recovery-error" class="maristela-recovery-error" hidden></div>
        <button type="submit" id="maristela-recovery-submit">Salvar nova senha</button>
      </form>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #maristela-password-recovery{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(30,20,18,.58);backdrop-filter:blur(4px)}
    .maristela-recovery-card{width:min(430px,100%);background:#fbf5ee;border:1px solid #e5d7ce;border-radius:22px;box-shadow:0 30px 90px rgba(0,0,0,.28);padding:28px;font-family:Arial,sans-serif;color:#342522}
    .maristela-recovery-brand{display:flex;align-items:center;gap:11px;margin-bottom:24px}
    .maristela-recovery-brand>span{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#b65f68;color:#fff;font-family:Georgia,serif;font-size:22px;font-weight:700}
    .maristela-recovery-brand b,.maristela-recovery-brand small{display:block}
    .maristela-recovery-brand b{font-family:Georgia,serif;font-size:16px}
    .maristela-recovery-brand small{font-size:10px;color:#8a7770;margin-top:2px}
    .maristela-recovery-eyebrow{font-size:10px;font-weight:700;letter-spacing:.12em;color:#a75b63;margin-bottom:7px}
    .maristela-recovery-card h2{font-family:Georgia,serif;font-size:30px;line-height:1.1;margin:0 0 8px}
    .maristela-recovery-card>p{font-size:12px;line-height:1.6;color:#806f68;margin:0 0 22px}
    #maristela-recovery-form label{display:block;font-size:10px;font-weight:700;margin-bottom:14px}
    .maristela-password-wrap{position:relative;margin-top:7px}
    #maristela-recovery-form input{display:block;box-sizing:border-box;width:100%;margin-top:0;border:1px solid #e5d7ce;border-radius:10px;padding:12px 42px 12px 12px;background:#fff;outline:0;color:#342522;font-size:14px}
    #maristela-recovery-form input:focus{border-color:#b65f68;box-shadow:0 0 0 3px rgba(182,95,104,.10)}
    .maristela-password-eye{position:absolute;right:7px;top:50%;transform:translateY(-50%);width:30px;height:30px;border:0;background:transparent;color:#8a7770;cursor:pointer;font-size:15px;padding:0}
    .maristela-password-eye:hover{color:#b65f68}
    #maristela-recovery-submit{width:100%;min-height:46px;margin-top:5px;border:0;border-radius:10px;background:#b65f68;color:#fff;font-weight:700;cursor:pointer}
    #maristela-recovery-submit:disabled{opacity:.65;cursor:wait}
    .maristela-recovery-error{margin:0 0 14px;padding:10px 12px;border-radius:10px;background:#faeeee;color:#a33f48;font-size:11px;line-height:1.5}
    @media(max-width:600px){.maristela-recovery-card{padding:23px 18px;border-radius:18px}}
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);

  overlay.querySelectorAll('.maristela-password-eye').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.target);
      const visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      button.textContent = visible ? '◉' : '◌';
      button.setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha');
    });
  });

  const form = overlay.querySelector('#maristela-recovery-form');
  const password = overlay.querySelector('#maristela-new-password');
  const confirmPassword = overlay.querySelector('#maristela-confirm-password');
  const errorBox = overlay.querySelector('#maristela-recovery-error');
  const submit = overlay.querySelector('#maristela-recovery-submit');

  form.addEventListener('submit', async event => {
    event.preventDefault();
    errorBox.hidden = true;

    if (password.value.length < 6) {
      errorBox.textContent = 'A senha precisa ter pelo menos 6 caracteres.';
      errorBox.hidden = false;
      return;
    }

    if (password.value !== confirmPassword.value) {
      errorBox.textContent = 'As senhas não são iguais.';
      errorBox.hidden = false;
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Salvando...';

    const { error } = await client.auth.updateUser({ password: password.value });

    if (error) {
      console.error('[Maristela Password Recovery]', error);
      errorBox.textContent = error.message || 'Não foi possível atualizar a senha. Solicite um novo link de recuperação.';
      errorBox.hidden = false;
      submit.disabled = false;
      submit.textContent = 'Salvar nova senha';
      return;
    }

    submit.textContent = 'Senha atualizada!';
    await client.auth.signOut();
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.reload();
  });
}

function isRecoveryUrl() {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return query.has('code') || query.get('type') === 'recovery' || hash.get('type') === 'recovery' || hash.has('access_token') || hash.has('refresh_token');
}

async function openRecoveryWhenReady() {
  if (!isRecoveryUrl()) return;

  // Aguarda o Supabase processar o token/código antes de abrir o formulário.
  // Isso evita o falso erro "Falta sessão de autenticação!".
  try {
    let { data } = await client.auth.getSession();

    if (!data.session) {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        const result = await client.auth.exchangeCodeForSession(code);
        if (result.error) console.error('[Maristela Recovery Code]', result.error);
      }
      ({ data } = await client.auth.getSession());
    }

    if (data.session) {
      if (document.body) showPasswordRecoveryModal();
      else window.addEventListener('DOMContentLoaded', showPasswordRecoveryModal, { once: true });
    } else {
      console.error('[Maristela Password Recovery] Link recebido, mas nenhuma sessão foi criada.');
      if (document.body) {
        const existing = document.getElementById('maristela-password-recovery');
        if (!existing) {
          const message = document.createElement('div');
          message.id = 'maristela-recovery-session-error';
          message.textContent = 'O link de recuperação expirou ou não pôde ser validado. Solicite um novo link.';
          message.style.cssText = 'position:fixed;z-index:99999;left:50%;top:30px;transform:translateX(-50%);padding:13px 18px;border-radius:10px;background:#faeeee;color:#a33f48;font:700 12px Arial;box-shadow:0 10px 30px rgba(0,0,0,.15)';
          document.body.appendChild(message);
          setTimeout(() => message.remove(), 7000);
        }
      }
    }
  } catch (error) {
    console.error('[Maristela Password Recovery] Falha ao processar sessão:', error);
  }
}

client.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    if (document.body) showPasswordRecoveryModal();
    else window.addEventListener('DOMContentLoaded', showPasswordRecoveryModal, { once: true });
  }
});

if (typeof window !== 'undefined') {
  openRecoveryWhenReady();
  window.addEventListener('load', openRecoveryWhenReady, { once: true });
}

export const supabase = client;
