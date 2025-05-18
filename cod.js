import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = 'https://npvyxmorsaitlpscbcgq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdnl4bW9yc2FpdGxwc2NiY2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTAyMDEsImV4cCI6MjA2MTAyNjIwMX0.VSLgSvLOYgEhul-QbXXIb4r91HD6_r76__QzElzOulM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
let salvando = false;
let contadorCliques = 0;
let tempoUltimoClique = 0;
const LIMITE_CLIQUES = 5;
const INTERVALO_MAX = 3000; // 3 segundos entre cliques
let lojaSelecionadaId = null;

document.getElementById("btn-lojas").addEventListener("click", () => {
  const agora = Date.now();

  // Reinicia se demorar demais
  if (agora - tempoUltimoClique > INTERVALO_MAX) {
    contadorCliques = 0;
  }

  contadorCliques++;
  tempoUltimoClique = agora;

  if (contadorCliques === LIMITE_CLIQUES) {
    contadorCliques = 0;
    document.getElementById("dropdown-lojas").classList.remove("d-none");
    carregarLojas();
  }
});

async function carregarLojas() {
  const { data: lojas, error } = await supabase.from("lojas").select("*");

  if (error) {
    mostrarAlerta("Erro ao carregar lojas", "error");
    return;
  }

  const lista = document.getElementById("lista-lojas");
  lista.innerHTML = ""; // limpa

  lojas.forEach(loja => {
    const item = document.createElement("button");
    item.classList.add("dropdown-item");
    item.textContent = loja.nome;

    item.onclick = () => {
      lojaSelecionadaId = loja.id;
      carregarVendas();

      // Atualiza o texto do botão
      document.getElementById("lojaSelecionadaLabel").textContent = `Loja: ${loja.nome}`;

      // Oculta novamente o dropdown
      document.getElementById("dropdown-lojas").classList.add("d-none");

      // Alerta de seleção
      mostrarAlerta(`Loja "${loja.nome}" selecionada com sucesso!`, "padrao");

      // Reset contador por segurança
      contadorCliques = 0;
    };

    lista.appendChild(item);
  });
 }


 // Variáveis globais
 let soma = 0;
 let formaPagamento = "";

 // Função para calcular o total
 function somarValores() {
  const valor12 = document.querySelector(".valor12").value || 0;
  const valor20 = document.querySelector(".valor20").value || 0;

  soma = parseInt(valor12) * 12 + parseInt(valor20) * 20;
  document.querySelector(".resultado").innerHTML = soma;
 }

 // Função para calcular o troco
 function descontarValores() {
  const recebido = document.querySelector(".recebido").value || 0;
  const troco = parseInt(recebido) - parseInt(soma);
  document.querySelector(".troco").innerHTML = troco;
 }

 function limparCampos(){
  document.querySelector(".valor12").value = "";
  document.querySelector(".valor20").value = "";
  document.querySelector(".recebido").value = "";
 }

 document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnCartao").addEventListener("click", () => {
    selecionarPagamento("cartão");
    enviarVenda();
    limparCampos();
  });

  document.getElementById("btnDinheiro").addEventListener("click", async () => {
    selecionarPagamento("dinheiro");
    const vendaRegistrada = await enviarVenda();
    if (vendaRegistrada) {
      imprimir();
      limparCampos();
    }
    limparCampos();
  });
 });
 // Função para selecionar o tipo de pagamento
 function selecionarPagamento(tipo) {
  formaPagamento = tipo;
 }

 async function enviarVenda() {
const cod = crypto.randomUUID();
  if (salvando) return;
  salvando = true;
  btnCartao.disabled = true;
  btnDinheiro.disabled = true;

  // Obtem os valores dos campos
  const valor12 = parseInt(document.querySelector(".valor12").value || 0);
  const valor20 = parseInt(document.querySelector(".valor20").value || 0);

  // Verifica se os valores de quantidade são inválidos
  if (valor12 === 0 && valor20 === 0) {
    mostrarAlerta("Por favor, insira pelo menos um valor válido para registrar uma venda.", "error");
    salvando = false;
  btnCartao.disabled = false;
  btnDinheiro.disabled = false;
    return; // Interrompe a execução da função
  }

  if (!lojaSelecionadaId) {
    mostrarAlerta("Selecione uma loja antes de registrar uma venda.", "error");
    salvando = false;
  btnCartao.disabled = false;
  btnDinheiro.disabled = false;
    return;
  }

  // Obtem a hora e a data atual
  const horaAtual = new Date().toLocaleTimeString();
  const agora = new Date();
  const dataAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
  const total = (valor12 * 12) + (valor20 * 20);

  // Insere no Supabase
  const { data, error } = await supabase.from("vendas").insert([
    {
      cod: cod,
      quantidade_12: valor12,
      quantidade_20: valor20,
      total: total,
      formaPagamento: formaPagamento,
      hora: horaAtual,
      data: dataAtual,
      loja: lojaSelecionadaId
    },
  ]);

  // Verifica erros ou sucesso
  if (error) {
    mostrarAlerta("Erro ao registrar a venda", "error");
  } else {
    mostrarAlerta("Venda registrada com sucesso!", "padrao");
    carregarVendas(); // Atualiza a tabela com os dados mais recentes
  }

  salvando = false;
  btnCartao.disabled = false;
  btnDinheiro.disabled = false;
  return true;
 }

 document.addEventListener("DOMContentLoaded", () => {
  // Adiciona o event listener ao botão
  document.getElementById("btn-filtrar").addEventListener("click", carregarVendas);
 });

 async function carregarVendas() {
  const tabelaBody = document.querySelector(".tabela-body");
  tabelaBody.innerHTML = ""; // Limpa a tabela antes de preencher

  // Captura o valor do campo de data no formato YYYY-MM-DD
  let dataFiltro = document.querySelector("#data-filtro").value;

  // Se nenhuma data foi informada, utiliza a data atual
  if (!dataFiltro) {
    const agora = new Date();
    dataFiltro = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
    document.querySelector("#data-filtro").value = dataFiltro;
  }

  if (!lojaSelecionadaId) {
    mostrarAlerta("selecione uma loja","error");
    return;
  }

  try {
    let query = supabase.from("vendas").select("*");

    // Aplica os filtros de data e loja
    query = query.eq("data", dataFiltro);

    if (lojaSelecionadaId) {
      query = query.eq("loja", lojaSelecionadaId); // Certifique-se de que essa coluna exista no Supabase
    }

    const { data, error } = await query.order("hora", { ascending: false });

    if (error) throw error;

    if (data.length === 0) {
      tabelaBody.innerHTML = `<tr><td colspan="4" class="text-center">Nenhuma venda encontrada para a data e loja selecionadas.</td></tr>`;
      return;
    }

    data.forEach((venda) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${venda.quantidade_12}</td>
        <td>${venda.quantidade_20}</td>
        <td>R$ ${!isNaN(venda.total) ? parseFloat(venda.total).toFixed(2): venda.total}</td>
        <td>${venda.hora}</td>
      `;
      tabelaBody.appendChild(linha);
    });
  } catch (error) {
    setTimeout(() => {
      mostrarAlerta("Erro ao carregar vendas.", "error");
    }, 15000);
  }
 }


 function mostrarAlerta(mensagem, tipo = 'padrao') {
  const alertBox = document.querySelector(".dropbar");
  const alertMessage = document.getElementById("AlertMensagem");

  alertMessage.textContent = mensagem; // Define a mensagem

  // Remove as classes anteriores de erro ou padrao
  alertBox.classList.remove("show", "hide", "padrao", "error");

  // Adiciona a classe correspondente ao tipo de mensagem
  if (tipo === 'error') {
      alertBox.classList.add("error"); // Adiciona a classe de erro
  } else {
      alertBox.classList.add("padrao"); // Adiciona a classe padrao 
  }

  // Faz a barra expandir
  alertBox.classList.add("show");

  // Após 3 segundos, esconde a barra
  setTimeout(() => {
      alertBox.classList.add("hide"); // Encolhe a barra
      setTimeout(() => {
          alertBox.classList.remove("show", "hide"); // Reseta o estado
      }, 500); // Tempo da animação
  }, 3000);
 }




 //Função para imprimir
 function imprimir() {
  try {
    window.print();
  } catch (error) {
    console.error("Erro ao imprimir:", error);
  }
 }

 // Event Listeners para cálculos automáticos
 document.querySelector(".valor12").addEventListener("input", somarValores);
 document.querySelector(".valor20").addEventListener("input", somarValores);
 document.querySelector(".recebido").addEventListener("input", descontarValores);

 // Chamada inicial para carregar vendas ao carregar a página
 //window.onload = () => carregarVendas();
 window.onload = () => mostrarAlerta("selecione uma loja", "error");



document.addEventListener("DOMContentLoaded", () => {
  const dropbar = document.getElementById("bordinha-dropbar");
  const botao = document.getElementById("btndividi");
  const confirmar = document.getElementById("confirmarDivisao");

  // Alterna a visibilidade do dropbar ao clicar no botão
  botao.addEventListener("click", () => {
    dropbar.classList.toggle("d-none");
  });

  // Fecha o dropbar ao clicar fora dele
  document.addEventListener("click", (event) => {
    if (!dropbar.classList.contains("d-none")) {
      if (!dropbar.contains(event.target) && !botao.contains(event.target)) {
        dropbar.classList.add("d-none");
      }
    }
  });

  // Quando clicar no botão "Confirmar" da divisão de valores
  confirmar.addEventListener("click", async () => {
    await enviarVendamista();  
    limparCampos();            
    carregarVendas();          
  });
});



async function enviarVendamista() {
 const cod = crypto.randomUUID();
  const btn = document.getElementById("confirmarDivisao");
  if (salvando) return;
  salvando = true;
  btn.disabled = true;

  try {
    const valorCartao = parseFloat(document.getElementById("valorCartao").value || 0);
    const valorDinheiro = parseFloat(document.getElementById("valorDinheiro").value || 0);
    const valor12 = parseInt(document.querySelector(".valor12").value || 0);
    const valor20 = parseInt(document.querySelector(".valor20").value || 0);

    if (valor12 === 0 && valor20 === 0) {
      mostrarAlerta("Insira uma quantidade válida", "error");
      return;
    }

    if (!lojaSelecionadaId) {
      mostrarAlerta("Selecione uma loja antes de registrar a venda.", "error");
      return;
    }

    const totalCalculado = valor12 * 12 + valor20 * 20;
    const totalInformado = valorCartao + valorDinheiro;

    if (totalCalculado > totalInformado) {
      mostrarAlerta(`Total calculado (R$${totalCalculado.toFixed(2)}) diferente do valor pago (R$${totalInformado.toFixed(2)}).`, "error");
      return;
    }

    let formaPagamento = "";
    let total = "";

    if (valorCartao > 0 && valorDinheiro === 0) {
      formaPagamento = "cartão";
      total = valorCartao;
      selecionarPagamento("cartão");
    } else if (valorDinheiro > 0 && valorCartao === 0) {
      formaPagamento = "dinheiro";
      total = valorDinheiro;
      selecionarPagamento("dinheiro");
      imprimir();
    } else if (valorCartao > 0 && valorDinheiro > 0) {
      formaPagamento = "mista";
      total = `${valorCartao} / ${valorDinheiro}`;
      selecionarPagamento("mista");
      imprimir();
    } else {
      mostrarAlerta("Informe um valor válido em dinheiro ou cartão.", "error");
      return;
    }

    const horaAtual = new Date().toLocaleTimeString();
    const agora = new Date();
    const dataAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;

    const { data, error } = await supabase.from("vendas").insert([{
      cod: cod,
      quantidade_12: valor12,
      quantidade_20: valor20,
      total: total,
      formaPagamento: formaPagamento,
      hora: horaAtual,
      data: dataAtual,
      loja: lojaSelecionadaId
    }]);

    if (error) {
      mostrarAlerta("Erro ao registrar a venda", "error");
    } else {
      mostrarAlerta("Venda registrada com sucesso!", "padrao");
      limparCampos();
      document.getElementById("bordinha-dropbar").classList.add("d-none");
    }

  } finally {
    salvando = false;
    btn.disabled = false;
  }
}
