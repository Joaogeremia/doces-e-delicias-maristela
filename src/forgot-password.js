import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cmldypvguivwwymnpnyl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-QKdsvhcZskCvEREagS_LA_ThZ1oGBW';
const supabaseReset = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const STYLE_ID = 'maristela-forgot-password-style';

function addForgotPasswordLink() {
  const form = document.querySelector('.auth-form');
  if (!form || document.getElementById('maristela-forgot-password')) return;

  const passwordInput = form.querySelector('input[type="password"]');
  const emailInput = form.querySelector('input[type="email"]');
  if (!passwordInput || !emailInput) return;

  const link = document.createElement('button');
  link.type = 'button';
  link.id = 'maristela-forgot-password';
  link.textContent = 'Esqueci minha senha';

  link.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!email) {
      emailInput.focus();
      emailInput.setCustomValidity('Digite seu e-mail para recuperar a senha.');
      emailInput.reportValidity();
      emailInput.setCustomValidity('');
      return;
    }

    link.disabled = true;
    link.textContent = 'Enviando...';

    const { error } = await supabaseReset.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });

    if (error) {
      console.error('[Maristela Password Reset]', error);
      link.disabled = false;
      link.textContent = 'Esqueci minha senha';
      alert(`Não foi possível enviar o e-mail: ${error.message}`);
      return;
    }

    link.textContent = 'E-mail enviado!';
    alert('Enviamos o link de recuperação para seu e-mail. Verifique também a caixa de spam.');
    setTimeout(() => {
      link.disabled = false;
      link.textContent = 'Esqueci minha senha';
    }, 3000);
  });

  passwordInput.closest('label')?.insertAdjacentElement('afterend', link);
}

function addStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #maristela-forgot-password {
      display:block;width:100%;margin:-3px 0 12px;padding:0;border:0;
      background:transparent;color:#a45c64;font-size:11px;font-weight:700;
      text-align:right;cursor:pointer;
    }
    #maristela-forgot-password:hover{text-decoration:underline}
    #maristela-forgot-password:disabled{opacity:.6;cursor:wait}
  `;
  document.head.appendChild(style);
}

function init() {
  addStyle();
  addForgotPasswordLink();
}

function start() {
  init();
  const observer = new MutationObserver(init);
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
