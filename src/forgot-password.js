import { supabase } from './supabase.js';

const STYLE_ID = 'maristela-forgot-password-style';

function addForgotPasswordLink() {
  const form = document.querySelector('.auth-form');
  if (!form || document.getElementById('maristela-forgot-password')) return;

  const passwordInput = form.querySelector('input[type="password"]');
  if (!passwordInput) return;

  const link = document.createElement('button');
  link.type = 'button';
  link.id = 'maristela-forgot-password';
  link.textContent = 'Esqueci minha senha';
  link.addEventListener('click', async () => {
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput?.value.trim();

    if (!email) {
      emailInput?.focus();
      alert('Digite seu e-mail primeiro para receber o link de recuperação.');
      return;
    }

    link.disabled = true;
    link.textContent = 'Enviando...';

    const redirectTo = `${window.location.origin}/`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      console.error('[Maristela Password Reset]', error);
      alert(`Não foi possível enviar o e-mail: ${error.message}`);
      link.disabled = false;
      link.textContent = 'Esqueci minha senha';
      return;
    }

    link.textContent = 'E-mail enviado!';
    alert('Enviamos um link de recuperação para seu e-mail. Verifique também a caixa de spam.');
    setTimeout(() => {
      link.disabled = false;
      link.textContent = 'Esqueci minha senha';
    }, 3000);
  });

  password.closest('label')?.insertAdjacentElement('afterend', link);
}

function addStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #maristela-forgot-password{display:block;width:100%;margin:-3px 0 12px;padding:0;border:0;background:transparent;color:#a45c64;font-size:11px;font-weight:700;text-align:right;cursor:pointer}
    #maristela-forgot-password:hover{text-decoration:underline}
    #maristela-forgot-password:disabled{opacity:.6;cursor:wait}
  `;
  document.head.appendChild(style);
}

function init() {
  addStyle();
  addForgotPasswordLink();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

const observer = new MutationObserver(init);
observer.observe(document.body, { childList: true, subtree: true });
