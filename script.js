document.addEventListener("DOMContentLoaded", () => {
  const chavePix = "SUA_CHAVE_PIX_AQUI";

  const capa = document.getElementById("capa");
  const btnAbrir = document.getElementById("btnAbrir");
  const video = document.getElementById("video");
  const musica = document.getElementById("musica");
  const toast = document.getElementById("toast");
  const elementosFinais = document.getElementById("elementosFinais");
  const fotoFinal = document.getElementById("fotoFinal");

  // Botões principais
  const btnPresentes = document.getElementById("btnPresentes");
  const btnComoChegar = document.getElementById("btnComoChegar");
  const btnAgenda = document.getElementById("btnAgenda");
  const btnRsvp = document.getElementById("btnRsvp");
  const btnDressCode = document.getElementById("btnDressCode");

  // Modais
  const modalPresentes = document.getElementById("modalPresentes");
  const modalComoChegar = document.getElementById("modalComoChegar");
  const modalAgenda = document.getElementById("modalAgenda");
  const modalRsvp = document.getElementById("modalRsvp");
  const modalDressCode = document.getElementById("modalDressCode");
  const todosModais = document.querySelectorAll(".modal");

  // Elementos internos dos modais
  const boxCopiarPix = document.getElementById("boxCopiarPix");
  const btnGoogleCalendar = document.getElementById("btnGoogleCalendar");
  const btnAppleCalendar = document.getElementById("btnAppleCalendar");

  // Elementos da contagem regressiva
  const elDias = document.getElementById("dias");
  const elHoras = document.getElementById("horas");
  const elMinutos = document.getElementById("minutos");
  const elSegundos = document.getElementById("segundos");

  // Data do evento: 31 de Outubro de 2026 às 19:30 (horário de Brasília UTC-3)
  const dataEvento = new Date("2026-10-31T19:30:00-03:00").getTime();

  function atualizarContagem() {
    const agora = new Date().getTime();
    const diferenca = dataEvento - agora;

    if (diferenca <= 0) {
      if (elDias) elDias.textContent = "00";
      if (elHoras) elHoras.textContent = "00";
      if (elMinutos) elMinutos.textContent = "00";
      if (elSegundos) elSegundos.textContent = "00";
      return;
    }

    const d = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const h = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diferenca % (1000 * 60)) / 1000);

    if (elDias) elDias.textContent = String(d).padStart(2, "0");
    if (elHoras) elHoras.textContent = String(h).padStart(2, "0");
    if (elMinutos) elMinutos.textContent = String(m).padStart(2, "0");
    if (elSegundos) elSegundos.textContent = String(s).padStart(2, "0");
  }

  // Inicia a contagem imediatamente e atualiza a cada segundo
  atualizarContagem();
  setInterval(atualizarContagem, 1000);

  // Garante que o primeiro frame do vídeo seja renderizado no fundo enquanto a capa está visível
  video.currentTime = 0;
  video.load();

  let toastTimer = null;

  // Função para exibir o toast
  function exibirToast(msg) {
    if (!toast) return;
    if (toastTimer) clearTimeout(toastTimer);
    if (msg) toast.textContent = msg;
    toast.classList.add("visivel");
    toastTimer = setTimeout(() => {
      toast.classList.remove("visivel");
    }, 2400);
  }

  // Função para revelar o nome, contagem e botões
  function exibirElementosFinais() {
    if (elementosFinais) {
      elementosFinais.classList.add("visivel");
    }
    if (fotoFinal) {
      fotoFinal.classList.add("visivel");
    }
  }

  // Elementos do palco e vagalumes
  const canvasVagalumes = document.getElementById("canvasVagalumes");
  let vagalumesAtivos = false;

  // Sistema de partículas de Vagalumes Mágicos
  function iniciarVagalumes() {
    if (!canvasVagalumes || vagalumesAtivos) return;
    vagalumesAtivos = true;
    canvasVagalumes.classList.add("ativo");

    const ctx = canvasVagalumes.getContext("2d");
    let largura, altura;

    function redimensionar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = canvasVagalumes.offsetWidth;
      altura = canvasVagalumes.offsetHeight;
      canvasVagalumes.width = largura * dpr;
      canvasVagalumes.height = altura * dpr;
      ctx.scale(dpr, dpr);
    }

    redimensionar();
    window.addEventListener("resize", redimensionar);

    // Criação de 18 vagalumes distribuídos nas laterais (esquerda e direita)
    const quantidade = 18;
    const particulas = [];

    for (let i = 0; i < quantidade; i++) {
      const ladoEsquerdo = i % 2 === 0;
      particulas.push({
        ladoEsquerdo,
        x: ladoEsquerdo
          ? largura * (0.03 + Math.random() * 0.18)
          : largura * (0.78 + Math.random() * 0.18),
        y: altura * (0.1 + Math.random() * 0.85),
        raio: 1.2 + Math.random() * 1.8,
        velocidadeY: 0.2 + Math.random() * 0.45,
        velocidadeX: (Math.random() - 0.5) * 0.3,
        angulo: Math.random() * Math.PI * 2,
        velocidadeAngulo: 0.015 + Math.random() * 0.02,
        amplitude: 0.4 + Math.random() * 0.8,
        brilho: Math.random(),
        velocidadeBrilho: 0.02 + Math.random() * 0.03,
      });
    }

    function animar() {
      ctx.clearRect(0, 0, largura, altura);

      for (const p of particulas) {
        p.angulo += p.velocidadeAngulo;
        p.x += Math.sin(p.angulo) * p.amplitude + p.velocidadeX;
        p.y -= p.velocidadeY;

        p.brilho += p.velocidadeBrilho;
        const opacidade = 0.2 + (Math.sin(p.brilho) + 1) * 0.4;

        if (p.y < -20) {
          p.y = altura + 10;
          p.x = p.ladoEsquerdo
            ? largura * (0.03 + Math.random() * 0.18)
            : largura * (0.78 + Math.random() * 0.18);
        }

        const gradiente = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.raio * 4.5
        );
        gradiente.addColorStop(0, `rgba(255, 250, 180, ${opacidade})`);
        gradiente.addColorStop(0.3, `rgba(255, 215, 80, ${opacidade * 0.75})`);
        gradiente.addColorStop(0.7, `rgba(255, 180, 40, ${opacidade * 0.25})`);
        gradiente.addColorStop(1, "rgba(255, 180, 40, 0)");

        ctx.fillStyle = gradiente;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.raio * 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${opacidade})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.raio * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);
  }

  // =========================================
  // PADRÃO TÁTIL CINEMATOGRÁFICO DOS VAGALUMES
  // =========================================
  // 0s a 3s: Bater de asas suave e alternado
  // 3s a 4s: Aceleração do bater de asas
  // 4s a 6s: Pausa / Silêncio
  // 6s a 8s: Crescendo de brilho mágico cintilante
  const padraoVagalumesVideo = [
    // 0s a 3s (asas alternadas)
    18, 130, 14, 160, 22, 140, 16, 150, 20, 130, 14, 160, 22, 140, 18, 150, 16, 140, 20, 150, 14, 160, 22, 140, 18, 150,
    // 3s a 4s (aceleração)
    15, 65, 18, 70, 15, 60, 20, 65, 15, 70, 18, 65, 15, 60, 22, 70,
    // 4s a 6s (pausa de aprox. 2s)
    0, 1900,
    // 6s a 8s (brilho subindo em crescendo)
    12, 130, 15, 100, 18, 80, 22, 65, 26, 50, 32, 40, 40, 30, 55, 20, 80, 15, 140
  ];

  function iniciarExperienciaTatelVagalumes() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(padraoVagalumesVideo);
      } catch (e) {
        console.warn("Vibração tátil não suportada neste dispositivo:", e);
      }
    }
  }

  function pararVibracao() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(0);
      } catch (e) {}
    }
  }

  // Abertura do convite com transição suave, áudio e experiência tátil
  btnAbrir.addEventListener("click", async () => {
    capa.style.opacity = "0";
    setTimeout(() => {
      capa.style.display = "none";
    }, 500);

    // Inicia a sinfonia tátil dos vagalumes sincronizada
    iniciarExperienciaTatelVagalumes();

    try {
      video.muted = false;
      await video.play();
    } catch {
      video.muted = true;
      video.play();
    }

    try {
      musica.volume = 0;
      await musica.play();
      musica.pause(); // Pausa imediatamente, apenas para liberar o autoplay do navegador
    } catch (e) {
      console.warn("Autoplay de áudio bloqueado:", e);
    }
  });

  // Congela o vídeo no último frame ao terminar e ativa os vagalumes
  video.addEventListener("ended", () => {
    video.pause();
    exibirElementosFinais();
    iniciarVagalumes();
  });

  let musicaIniciada = false;
  let videoFadeIniciado = false;

  // Exibe os elementos aos 17 segundos e controla os áudios
  video.addEventListener("timeupdate", () => {
    // Fade out do som do vídeo a partir dos 5 segundos (durando 2s até zerar)
    if (video.currentTime >= 5 && !videoFadeIniciado) {
      videoFadeIniciado = true;
      try {
        let volVideo = 1.0;
        const fadeVideo = setInterval(() => {
          volVideo -= 0.05; // Diminui de 5 em 5%
          video.volume = Math.max(volVideo, 0); // Garante que não fique negativo
          if (volVideo <= 0) clearInterval(fadeVideo);
        }, 100); // 20 passos * 100ms = 2000ms (2 segundos)
      } catch (e) {
        console.warn("Erro ao fazer fade-out do vídeo:", e);
      }
    }

    if (video.currentTime >= 6 && !musicaIniciada) {
      musicaIniciada = true;
      try {
        musica.volume = 0;
        musica.play();
        let vol = 0;
        const fade = setInterval(() => {
          vol += 0.05;
          musica.volume = Math.min(vol, 1.0);
          if (vol >= 1.0) clearInterval(fade);
        }, 60); // Aprox. 1 segundo de fade-in
      } catch (e) {
        console.warn("Erro ao iniciar a música:", e);
      }
    }

    if (video.currentTime >= 17) {
      exibirElementosFinais();
    }
  });

  // Pausar/retomar áudio e vídeo quando o usuário sai ou volta para a aba/aplicativo
  let audioEstavaTocando = false;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pararVibracao();
      if (musica && !musica.paused) {
        audioEstavaTocando = true;
        musica.pause();
      }
      if (video && !video.paused) {
        video.pause();
      }
    } else {
      if (audioEstavaTocando && musica && musicaIniciada) {
        musica.play().catch((e) => console.warn("Retomada de áudio em segundo plano impedida:", e));
        audioEstavaTocando = false;
      }
      // Se o vídeo ainda não acabou e foi pausado ao sair
      if (video && video.currentTime > 0 && !video.ended && video.currentTime < 17) {
        video.play().catch(() => {});
      }
    }
  });

  window.addEventListener("pagehide", () => {
    pararVibracao();
    if (musica) musica.pause();
    if (video) video.pause();
  });

  // =========================================
  // CONTROLADOR DO GRAVADOR / ESTÚDIO TÁTIL (#gravador)
  // =========================================
  const gravadorTatel = document.getElementById("gravadorTatel");
  const btnFecharGravador = document.getElementById("btnFecharGravador");
  const btnPadVibracao = document.getElementById("btnPadVibracao");
  const btnIniciarGravacao = document.getElementById("btnIniciarGravacao");
  const btnTestarGravacao = document.getElementById("btnTestarGravacao");
  const btnCopiarGravacao = document.getElementById("btnCopiarGravacao");
  const tempoGravador = document.getElementById("tempoGravador");
  const txtCodigoGravado = document.getElementById("txtCodigoGravado");

  let gravando = false;
  let gravacaoInicio = 0;
  let eventosVibracao = [];
  let padPressionado = false;
  let gravadorTimerId = null;

  function abrirGravador() {
    if (!gravadorTatel) return;
    gravadorTatel.style.display = "flex";
  }

  function fecharGravador() {
    if (!gravadorTatel) return;
    gravadorTatel.style.display = "none";
    if (gravando) pararGravacao();
  }

  // Abre automaticamente se a URL tiver #gravador ou ?gravador
  if (window.location.hash.includes("gravador") || window.location.search.includes("gravador")) {
    abrirGravador();
  }

  // Atalho secreto: 4 toques rápidos em qualquer lugar da capa abrem o estúdio
  let toquesAtalho = 0;
  let timerAtalho = null;
  document.addEventListener("click", () => {
    toquesAtalho++;
    if (timerAtalho) clearTimeout(timerAtalho);
    timerAtalho = setTimeout(() => { toquesAtalho = 0; }, 1200);
    if (toquesAtalho >= 4) {
      toquesAtalho = 0;
      abrirGravador();
    }
  });

  if (btnFecharGravador) btnFecharGravador.addEventListener("click", fecharGravador);

  function formatarTempoMs(ms) {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const msec = ms % 1000;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(msec).padStart(3, '0')}`;
  }

  function iniciarGravacao() {
    gravando = true;
    eventosVibracao = [];
    padPressionado = false;
    gravacaoInicio = performance.now();
    btnIniciarGravacao.textContent = "⏹ Parar Gravação";
    btnTestarGravacao.disabled = true;
    btnCopiarGravacao.disabled = true;
    txtCodigoGravado.value = "Gravando ritmo... Toque e segure no botão grande!";

    // Reinicia o vídeo no fundo para você acompanhar visualmente
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }

    gravadorTimerId = setInterval(() => {
      const decorrido = Math.round(performance.now() - gravacaoInicio);
      if (tempoGravador) tempoGravador.textContent = formatarTempoMs(decorrido);
      if (decorrido >= 18000) {
        pararGravacao();
      }
    }, 30);
  }

  function pararGravacao() {
    gravando = false;
    if (gravadorTimerId) clearInterval(gravadorTimerId);
    btnIniciarGravacao.textContent = "▶ Iniciar Gravação";
    pararVibracao();

    if (padPressionado) {
      eventosVibracao.push({ time: Math.round(performance.now() - gravacaoInicio), type: "end" });
      padPressionado = false;
    }

    const arrayPadrao = compilarEventosEmPadrao(eventosVibracao);
    if (arrayPadrao.length > 0) {
      btnTestarGravacao.disabled = false;
      btnCopiarGravacao.disabled = false;
      txtCodigoGravado.value = JSON.stringify(arrayPadrao);
      exibirToast("Gravação concluída! Pronto para testar 📳");
    } else {
      txtCodigoGravado.value = "Nenhum toque foi registrado. Clique em Iniciar e segure o botão!";
    }
  }

  function compilarEventosEmPadrao(eventos) {
    if (eventos.length === 0) return [];
    const padrao = [];
    let tempoAtual = 0;

    for (let i = 0; i < eventos.length; i++) {
      const ev = eventos[i];
      if (ev.type === "start") {
        const pausaAntes = ev.time - tempoAtual;
        if (tempoAtual === 0 && ev.time > 0) {
          padrao.push(0);
          padrao.push(pausaAntes);
        } else if (pausaAntes > 0 && padrao.length > 0) {
          padrao.push(pausaAntes);
        }
        tempoAtual = ev.time;
      } else if (ev.type === "end") {
        const duracaoVibracao = Math.max(10, ev.time - tempoAtual);
        padrao.push(duracaoVibracao);
        tempoAtual = ev.time;
      }
    }
    return padrao;
  }

  if (btnIniciarGravacao) {
    btnIniciarGravacao.addEventListener("click", () => {
      if (gravando) pararGravacao();
      else iniciarGravacao();
    });
  }

  if (btnPadVibracao) {
    const aoPressionarPad = (e) => {
      e.preventDefault();
      btnPadVibracao.classList.add("ativo");
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(5000); } catch (err) {}
      }
      if (gravando && !padPressionado) {
        padPressionado = true;
        eventosVibracao.push({ time: Math.round(performance.now() - gravacaoInicio), type: "start" });
      }
    };

    const aoSoltarPad = (e) => {
      e.preventDefault();
      btnPadVibracao.classList.remove("ativo");
      pararVibracao();
      if (gravando && padPressionado) {
        padPressionado = false;
        eventosVibracao.push({ time: Math.round(performance.now() - gravacaoInicio), type: "end" });
      }
    };

    btnPadVibracao.addEventListener("pointerdown", aoPressionarPad);
    btnPadVibracao.addEventListener("pointerup", aoSoltarPad);
    btnPadVibracao.addEventListener("pointerleave", aoSoltarPad);
    btnPadVibracao.addEventListener("pointercancel", aoSoltarPad);
  }

  if (btnTestarGravacao) {
    btnTestarGravacao.addEventListener("click", () => {
      try {
        const padrao = JSON.parse(txtCodigoGravado.value);
        if (Array.isArray(padrao) && navigator.vibrate) {
          navigator.vibrate(padrao);
          exibirToast("Sentindo a vibração gravada... ✨");
        }
      } catch (err) {
        exibirToast("Erro ao ler o padrão gravado.");
      }
    });
  }

  if (btnCopiarGravacao) {
    btnCopiarGravacao.addEventListener("click", async () => {
      if (txtCodigoGravado.value) {
        try {
          await navigator.clipboard.writeText(txtCodigoGravado.value);
          exibirToast("Padrão copiado com sucesso! 📋");
        } catch (err) {
          txtCodigoGravado.select();
          document.execCommand("copy");
          exibirToast("Padrão copiado! 📋");
        }
      }
    });
  }

  // =========================================
  // SISTEMA DE VAGALUMES MÁGICOS NOS MODAIS
  // =========================================
  let modalVagalumesAnimId = null;
  let canvasModalAtual = null;
  let ctxModalAtual = null;
  let particulasModal = [];
  let larguraModal = 0;
  let alturaModal = 0;

  function redimensionarCanvasModal() {
    if (!canvasModalAtual || !ctxModalAtual) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    larguraModal = canvasModalAtual.offsetWidth || window.innerWidth;
    alturaModal = canvasModalAtual.offsetHeight || window.innerHeight;
    canvasModalAtual.width = larguraModal * dpr;
    canvasModalAtual.height = alturaModal * dpr;
    ctxModalAtual.setTransform(1, 0, 0, 1, 0, 0);
    ctxModalAtual.scale(dpr, dpr);
  }

  function criarParticulasModal(qtd = 26) {
    const arr = [];
    const w = larguraModal || window.innerWidth;
    const h = alturaModal || window.innerHeight;

    for (let i = 0; i < qtd; i++) {
      arr.push({
        x: Math.random() * w,
        y: Math.random() * h,
        raio: 1.2 + Math.random() * 2.2,
        velocidadeY: 0.18 + Math.random() * 0.45,
        velocidadeX: (Math.random() - 0.5) * 0.35,
        angulo: Math.random() * Math.PI * 2,
        velocidadeAngulo: 0.012 + Math.random() * 0.022,
        amplitude: 0.5 + Math.random() * 1.0,
        brilho: Math.random() * Math.PI * 2,
        velocidadeBrilho: 0.02 + Math.random() * 0.035,
        tomDourado: Math.random() > 0.45,
      });
    }
    return arr;
  }

  function iniciarVagalumesModal(modal) {
    pararVagalumesModal();
    if (!modal) return;
    const canvas = modal.querySelector(".canvas-vagalumes-modal");
    if (!canvas) return;

    canvasModalAtual = canvas;
    ctxModalAtual = canvas.getContext("2d");
    redimensionarCanvasModal();

    const qtd = window.innerWidth < 600 ? 20 : 30;
    particulasModal = criarParticulasModal(qtd);

    function animarModal() {
      if (!ctxModalAtual || !canvasModalAtual) return;
      ctxModalAtual.clearRect(0, 0, larguraModal, alturaModal);

      for (let i = 0; i < particulasModal.length; i++) {
        const p = particulasModal[i];
        p.angulo += p.velocidadeAngulo;
        p.x += Math.sin(p.angulo) * p.amplitude + p.velocidadeX;
        p.y -= p.velocidadeY;

        p.brilho += p.velocidadeBrilho;
        const opacidade = 0.22 + (Math.sin(p.brilho) + 1) * 0.39;

        if (p.y < -25) {
          p.y = alturaModal + 15;
          p.x = Math.random() * larguraModal;
        }
        if (p.x < -25) p.x = larguraModal + 15;
        if (p.x > larguraModal + 25) p.x = -15;

        // Halo radiante do vagalume
        const tamanhoHalo = p.raio * 5.2;
        const gradiente = ctxModalAtual.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, tamanhoHalo
        );

        if (p.tomDourado) {
          gradiente.addColorStop(0, `rgba(255, 250, 190, ${opacidade})`);
          gradiente.addColorStop(0.25, `rgba(255, 218, 95, ${opacidade * 0.78})`);
          gradiente.addColorStop(0.65, `rgba(255, 175, 45, ${opacidade * 0.25})`);
          gradiente.addColorStop(1, "rgba(255, 175, 45, 0)");
        } else {
          gradiente.addColorStop(0, `rgba(255, 255, 220, ${opacidade * 1.05})`);
          gradiente.addColorStop(0.3, `rgba(248, 232, 140, ${opacidade * 0.72})`);
          gradiente.addColorStop(0.7, `rgba(218, 195, 85, ${opacidade * 0.22})`);
          gradiente.addColorStop(1, "rgba(218, 195, 85, 0)");
        }

        ctxModalAtual.fillStyle = gradiente;
        ctxModalAtual.beginPath();
        ctxModalAtual.arc(p.x, p.y, tamanhoHalo, 0, Math.PI * 2);
        ctxModalAtual.fill();

        // Ponto central branco cintilante
        ctxModalAtual.fillStyle = `rgba(255, 255, 255, ${Math.min(opacidade * 1.25, 1)})`;
        ctxModalAtual.beginPath();
        ctxModalAtual.arc(p.x, p.y, p.raio * 0.65, 0, Math.PI * 2);
        ctxModalAtual.fill();
      }

      modalVagalumesAnimId = requestAnimationFrame(animarModal);
    }

    modalVagalumesAnimId = requestAnimationFrame(animarModal);
  }

  function pararVagalumesModal() {
    if (modalVagalumesAnimId) {
      cancelAnimationFrame(modalVagalumesAnimId);
      modalVagalumesAnimId = null;
    }
    if (ctxModalAtual && canvasModalAtual) {
      ctxModalAtual.clearRect(0, 0, larguraModal, alturaModal);
    }
    canvasModalAtual = null;
    ctxModalAtual = null;
  }

  window.addEventListener("resize", () => {
    if (canvasModalAtual && ctxModalAtual) {
      redimensionarCanvasModal();
    }
  });

  // =========================================
  // FEEDBACK TÁTIL (VIBRATION API)
  // =========================================
  function vibrar(ms = 15) {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (e) {}
    }
  }

  // Ativa vibração suave em botões e elementos interativos
  document.querySelectorAll("button, .btn-link, .btn-acao-jasmine, .pix-card, #btnAbrir").forEach((el) => {
    el.addEventListener("pointerdown", () => vibrar(12), { passive: true });
  });

  // Controle de abertura de Modais
  let ultimoFoco = null;

  function abrirModal(modal) {
    // Não abre modais se o Modo Ajuste estiver ativo
    if (document.body.classList.contains("modo-ajuste-ativo")) return;
    if (!modal) return;

    vibrar(14);
    ultimoFoco = document.activeElement;
    fecharTodosModais(false);

    const card = modal.querySelector(".modal-card");
    if (card) {
      card.style.transform = "";
      card.style.opacity = "";
      card.classList.remove("arrastando", "fechando-swipe");
    }

    modal.classList.add("ativo");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-aberto");

    iniciarVagalumesModal(modal);

    requestAnimationFrame(() => {
      const fechar = modal.querySelector(".btn-fechar");
      if (fechar) fechar.focus({ preventScroll: true });
    });
  }

  function fecharTodosModais(devolverFoco = true) {
    pararVagalumesModal();
    todosModais.forEach((m) => {
      m.classList.remove("ativo");
      m.setAttribute("aria-hidden", "true");
      const card = m.querySelector(".modal-card");
      if (card) {
        card.style.transform = "";
        card.style.opacity = "";
        card.classList.remove("arrastando", "fechando-swipe");
      }
    });
    document.body.classList.remove("modal-aberto");

    if (devolverFoco && ultimoFoco && typeof ultimoFoco.focus === "function") {
      ultimoFoco.focus({ preventScroll: true });
      ultimoFoco = null;
    }
  }

  // =========================================
  // GESTO DE SWIPE DOWN PARA FECHAR MODAIS
  // =========================================
  document.querySelectorAll(".modal-card").forEach((card) => {
    let startY = 0;
    let currentY = 0;
    let deltaY = 0;
    let isDragging = false;
    const conteudo = card.querySelector(".modal-conteudo");

    card.addEventListener("touchstart", (e) => {
      // Inicia apenas com 1 dedo e se o scroll interno estiver no topo
      if (e.touches.length > 1) return;
      if (conteudo && conteudo.scrollTop > 6) return;

      startY = e.touches[0].clientY;
      currentY = startY;
      deltaY = 0;
      isDragging = true;
      card.classList.remove("fechando-swipe");
    }, { passive: true });

    card.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      deltaY = currentY - startY;

      // Arrasta apenas para baixo
      if (deltaY > 0) {
        if (conteudo && conteudo.scrollTop > 0) {
          conteudo.scrollTop = 0;
        }
        card.classList.add("arrastando");
        const fatorEscala = Math.max(0.88, 1 - deltaY * 0.0004);
        const opacidade = Math.max(0.25, 1 - deltaY / 360);
        card.style.transform = `translateY(${deltaY}px) scale(${fatorEscala})`;
        card.style.opacity = opacidade;
      } else {
        card.classList.remove("arrastando");
        card.style.transform = "";
        card.style.opacity = "";
      }
    }, { passive: true });

    const finalizarArrasto = () => {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove("arrastando");

      if (deltaY > 75) {
        // Dispara fechamento por swipe
        vibrar(20);
        card.classList.add("fechando-swipe");
        setTimeout(() => {
          fecharTodosModais();
          card.classList.remove("fechando-swipe");
          card.style.transform = "";
          card.style.opacity = "";
          deltaY = 0;
        }, 210);
      } else {
        // Retorno suave à posição original
        card.style.transform = "";
        card.style.opacity = "";
        deltaY = 0;
      }
    };

    card.addEventListener("touchend", finalizarArrasto, { passive: true });
    card.addEventListener("touchcancel", finalizarArrasto, { passive: true });
  });

  if (btnPresentes) btnPresentes.addEventListener("click", () => abrirModal(modalPresentes));
  if (btnComoChegar) btnComoChegar.addEventListener("click", () => abrirModal(modalComoChegar));
  if (btnAgenda) btnAgenda.addEventListener("click", () => abrirModal(modalAgenda));
  if (btnRsvp) btnRsvp.addEventListener("click", () => abrirModal(modalRsvp));
  if (btnDressCode) btnDressCode.addEventListener("click", () => abrirModal(modalDressCode));

  // Botões de fechar e clique fora do card (backdrop)
  document.querySelectorAll(".btn-fechar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      vibrar(12);
      fecharTodosModais();
    });
  });

  todosModais.forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target === m) {
        fecharTodosModais();
      }
    });
  });

  // Fechar com tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fecharTodosModais();
    }
  });

  // Copiar chave Pix (mouse, toque e teclado)
  async function copiarPix() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(chavePix);
      } else {
        throw new Error("Fallback para input");
      }
    } catch {
      const input = document.createElement("input");
      input.value = chavePix;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    exibirToast("Chave Pix copiada ✦");
  }

  if (boxCopiarPix) {
    boxCopiarPix.addEventListener("click", copiarPix);
    boxCopiarPix.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        copiarPix();
      }
    });
  }

  // Ação: Google Calendar
  if (btnGoogleCalendar) {
    btnGoogleCalendar.addEventListener("click", () => {
      const titulo = encodeURIComponent("15 Anos da Keylla ✨");
      const detalhes = encodeURIComponent("Uma noite mágica e inesquecível! Aniversário de 15 Anos da Keylla. Contamos com você!");
      const localizacao = encodeURIComponent(
        "Espaço 26 Festas - R. João Augusto de Oliveira Filho, 26 - Loteamento Samambaia, Petrópolis - RJ, 25710-259"
      );
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=20261031T223000Z/20261101T060000Z&details=${detalhes}&location=${localizacao}`;
      window.open(url, "_blank");
    });
  }

  // Ação: Apple / Outlook (.ics)
  if (btnAppleCalendar) {
    btnAppleCalendar.addEventListener("click", () => {
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//15 Anos Keylla//PT",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        "SUMMARY:15 Anos da Keylla ✨",
        "DESCRIPTION:Uma noite mágica e inesquecível! Aniversário de 15 Anos da Keylla.",
        "DTSTART:20261031T223000Z",
        "DTEND:20261101T060000Z",
        "LOCATION:Espaço 26 Festas - R. João Augusto de Oliveira Filho, 26 - Loteamento Samambaia, Petrópolis - RJ, 25710-259",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "15_anos_Keylla.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      exibirToast("Evento salvo para a sua agenda! 📅");
    });
  }


});