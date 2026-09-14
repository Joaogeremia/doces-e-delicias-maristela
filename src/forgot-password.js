import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cmldypvguivvwymnpnyl.supabase.co';
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
    const redirectTo = `${window.location.origin}/`;

    if (!email) {
      emailInput.focus();
      emailInput.setCustomValidity('Digite seu e-mail para recuperar a senha.');
      emailInput.reportValidity();
      emailInput.setCustomValidity('');
      return;
    }

    link.disabled = true;
    link.textContent = 'Enviando...';

    try {
      console.info('[Maristela Password Reset] Iniciando recuperação', {
        email,
        redirectTo,
        origin: window.location.origin,
        online: navigator.onLine,
        supabaseUrl: SUPABASE_URL,
      });

      const result = await supabaseReset.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      console.info('[Maristela Password Reset] Resposta do Supabase', {
        ok: !result.error,
        errorName: result.error?.name ?? null,
        errorMessage: result.error?.message ?? null,
        errorStatus: result.error?.status ?? null,
        errorCode: result.error?.code ?? null,
      });

      if (result.error) {
        throw result.error;
      }

      link.textContent = 'E-mail enviado!';
      alert('Enviamos o link de recuperação para seu e-mail. Verifique também a caixa de spam.');
      setTimeout(() => {
        link.disabled = false;
        link.textContent = 'Esqueci minha senha';
      }, 3000);
    } catch (error) {
      const diagnostic = {
        name: error?.name ?? 'UnknownError',
        message: error?.message ?? String(error),
        status: error?.status ?? null,
        code: error?.code ?? null,
        online: navigator.onLine,
        origin: window.location.origin,
        redirectTo,
        supabaseUrl: SUPABASE_URL,
      };

      console.error('[Maristela Password Reset] ERRO COMPLETO', error);
      console.error('[Maristela Password Reset] DIAGNÓSTICO', diagnostic);

      link.disabled = false;
      link.textContent = 'Esqueci minha senha';

      const details = [
        `Erro: ${diagnostic.name}`,
        `Mensagem: ${diagnostic.message}`,
        `Status: ${diagnostic.status ?? 'não informado'}`,
        `Código: ${diagnostic.code ?? 'não informado'}`,
        `Online: ${diagnostic.online ? 'sim' : 'não'}`,
        `Origem: ${diagnostic.origin}`,
      ].join('\n');

      alert(`Não foi possível enviar o e-mail.\n\n${details}\n\nAbra o console do navegador (F12 > Console) se precisarmos investigar mais.`);
    }
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
