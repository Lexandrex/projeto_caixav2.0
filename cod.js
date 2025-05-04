import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = 'https://npvyxmorsaitlpscbcgq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdnl4bW9yc2FpdGxwc2NiY2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTAyMDEsImV4cCI6MjA2MTAyNjIwMX0.VSLgSvLOYgEhul-QbXXIb4r91HD6_r76__QzElzOulM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnCartao").addEventListener("click", () => {
    selecionarPagamento("cartao");
    enviarVenda();
  });

  document.getElementById("btnDinheiro").addEventListener("click", async () => {
    selecionarPagamento("dinheiro");
    const vendaRegistrada = await enviarVenda();
    if (vendaRegistrada) {
      imprimir();
    }
  });
});
// Função para selecionar o tipo de pagamento
function selecionarPagamento(tipo) {
  formaPagamento = tipo;
}

async function enviarVenda() {
  // Obtem os valores dos campos
  const valor12 = parseInt(document.querySelector(".valor12").value || 0);
  const valor20 = parseInt(document.querySelector(".valor20").value || 0);

  // Verifica se os valores de quantidade são inválidos
  if (valor12 === 0 && valor20 === 0) {
    mostrarAlerta("Por favor, insira pelo menos um valor válido para registrar uma venda.", "error");
    return; // Interrompe a execução da função
  }

  // Obtem a hora e a data atual
  const horaAtual = new Date().toLocaleTimeString();
  const agora = new Date();
  const dataAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;

  console.log("Enviando venda: ", {
    quantidade_12: valor12,
    quantidade_20: valor20,
    formaPagamento: formaPagamento,
    hora: horaAtual,
    data: dataAtual,
  });

  // Insere no Supabase
  const { data, error } = await supabase.from("vendas").insert([
    {
      quantidade_12: valor12,
      quantidade_20: valor20,
      formaPagamento: formaPagamento,
      hora: horaAtual,
      data: dataAtual,
    },
  ]);

  // Verifica erros ou sucesso
  if (error) {
    console.error("Erro ao inserir venda:", error);
    mostrarAlerta("Erro ao registrar a venda", "error");
  } else {
    console.log("Venda inserida com sucesso:", data);
    mostrarAlerta("Venda registrada com sucesso!", "padrao");
    carregarVendas(); // Atualiza a tabela com os dados mais recentes
    return true;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Adiciona o event listener ao botão
  document.getElementById("btn-filtrar").addEventListener("click", carregarVendas);
});

// Certifique-se de que a função está fora de qualquer bloco
async function carregarVendas() {
  const tabelaBody = document.querySelector(".tabela-body");
  tabelaBody.innerHTML = ""; // Limpa a tabela antes de preencher

  // Captura o valor do campo de data no formato YYYY-MM-DD
  let dataFiltro = document.querySelector("#data-filtro").value;

  // Se nenhuma data foi informada, utiliza a data atual
  if (!dataFiltro) {
    const agora = new Date();
    dataFiltro = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
    document.querySelector("#data-filtro").value = dataFiltro; // Preenche o input com a data atual
  }

  try {
    let query = supabase.from("vendas").select("*");

    // Aplica o filtro de data
    query = query.eq("data", dataFiltro);

    const { data, error } = await query.order("hora", { ascending: false });

    //lança um error
    if (error) throw error;

    // Verifica se há dados retornados
    if (data.length === 0) {
      tabelaBody.innerHTML = `<tr><td colspan="4" class="text-center">Nenhuma venda encontrada para a data selecionada.</td></tr>`;
      return;
    }

    // Popula a tabela com os dados retornados
    data.forEach((venda) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${venda.quantidade_12}</td>
        <td>${venda.quantidade_20}</td>
        <td>R$ ${venda.total ? parseFloat(venda.total).toFixed(2) : '0.00'}</td>
        <td>${venda.hora}</td>
      `;
      tabelaBody.appendChild(linha);
    });
  } catch (error) {
    console.error("Erro ao carregar vendas:", error);
   // Repetir a exibição do erro a cada 15 segundos
   setInterval(() => {
    mostrarAlerta("Erro ao carregar vendas.", "error");
  }, 4000); // 15 segundos
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




// Função para imprimir
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
window.onload = () => carregarVendas();