// JS puro (sem bibliotecas).
// Pontos avaliativos:
// - Menu mobile (aparece/desaparece) ok
// - Alternância de tema claro/escuro com persistência em localStorage ok
// - Validação do formulário de contato com regex simples para e-mail ok
// - Simulação de envio: feedback ao usuário e limpeza dos campos ok

(function(){
  const $ = (sel)=>document.querySelector(sel);

  // Mostra ano atual no rodapé
  $("#ano").textContent = new Date().getFullYear();

  // Menu mobile
  const botaoMenu = $("#botaoMenu");
  const menuNavegacao = $("#menuNavegacao");
  botaoMenu.addEventListener("click", () => {
    const ativo = menuNavegacao.classList.toggle("ativo");
    botaoMenu.setAttribute("aria-expanded", String(ativo));
  });

  // Tema claro/escuro com persistência
  const botaoTema = $("#botaoTema");
  function aplicarTema(escuro){
    document.documentElement.classList.toggle("escuro", escuro);
    botaoTema.setAttribute("aria-pressed", String(escuro));
    localStorage.setItem("temaEscuro", escuro ? "1" : "0");
  }
  aplicarTema(localStorage.getItem("temaEscuro")==="1");
  botaoTema.addEventListener("click", ()=> aplicarTema(!document.documentElement.classList.contains("escuro")));

  // Validação do formulário
  const formularioContato = $("#formularioContato");
  const retornoContato = $("#retornoContato");
  const reEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i;

  formularioContato.addEventListener("submit", (ev)=>{
    ev.preventDefault();
    const campoNome = $("#campoNome").value.trim();
    const campoEmail = $("#campoEmail").value.trim();
    const campoMensagem = $("#campoMensagem").value.trim();

    if(!campoNome || !campoEmail || !campoMensagem){
      alert("Por favor, preencha todos os campos.");
      return;
    }
    if(!reEmail.test(campoEmail)){
      alert("Informe um e-mail válido (ex.: usuario@dominio.com).");
      return;
    }

    // "Envio" simulado
    retornoContato.hidden = false;
    retornoContato.textContent = "Mensagem enviada com sucesso! Obrigado pelo contato, " + campoNome + ".";
    formularioContato.reset();
  });

  // Rolagem suave para âncoras (experiência)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener("click", (e)=>{
      const id = a.getAttribute("href");
      const alvo = document.querySelector(id);
      if(alvo){
        e.preventDefault();
        alvo.scrollIntoView({behavior:"smooth"});
        // Fecha o menu em telas pequenas após o clique
        menuNavegacao.classList.remove("ativo");
        botaoMenu.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Gerenciamento da gaveta lateral
  const gatilho = document.querySelector('.botaoVerDetalhesProjeto3');
  const gaveta = document.querySelector('.gavetaProjeto');
  const conteudo = document.querySelector('.gavetaConteudo');
  const backdrop = document.querySelector('.gavetaBackdrop');
  const fechar = document.querySelector('.gavetaFechar');
  let ultimoFoco = null;

  function abrirGaveta(e) {
    e.preventDefault();
    ultimoFoco = document.activeElement;
    gaveta.classList.add('aberta');
    backdrop.classList.add('visivel');
    gaveta.setAttribute('aria-hidden', 'false');
    const primeiroFocavel = conteudo.querySelector('h3');
    if (primeiroFocavel) primeiroFocavel.focus();
  }

  function fecharGaveta() {
    gaveta.classList.remove('aberta');
    backdrop.classList.remove('visivel');
    gaveta.setAttribute('aria-hidden', 'true');
    if (ultimoFoco) ultimoFoco.focus();
  }

  gatilho?.addEventListener('click', abrirGaveta);
  fechar?.addEventListener('click', fecharGaveta);
  backdrop?.addEventListener('click', fecharGaveta);

  // Trap focus dentro da gaveta
  conteudo?.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focaveis = conteudo.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        }
      } else {
        if (document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    }
  });

  // Fechar tbm com o Esc
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gaveta.classList.contains('aberta')) {
      fecharGaveta();
    }
  });

  // Gerenciamento de interação por toque nos cards
  const projetos = document.querySelectorAll('.projeto');
  let projetoAtivo = null;

  function desativarProjeto() {
    if (projetoAtivo) {
      projetoAtivo.classList.remove('ativo');
      projetoAtivo = null;
    }
  }

  projetos.forEach(projeto => {
    projeto.addEventListener('touchstart', (e) => {
      if (projeto === projetoAtivo) {
        return; // Permite o segundo toque seguir para o link
      }
      
      e.preventDefault();
      desativarProjeto();
      projeto.classList.add('ativo');
      projetoAtivo = projeto;
    });
  });

  // Desativar card ao click fora
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.projeto')) {
      desativarProjeto();
    }
  });

  // Desativar card ao pressionar Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      desativarProjeto();
    }
  });

  // Adicionar rolagem suave
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function atualizarComportamentoRolagem() {
    document.documentElement.style.scrollBehavior = 
      prefersReducedMotion.matches ? 'auto' : 'smooth';
  }
  
  prefersReducedMotion.addEventListener('change', atualizarComportamentoRolagem);
  atualizarComportamentoRolagem();
})();