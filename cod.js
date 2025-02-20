import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Configuração do Supabase
const SUPABASE_URL = 'https://vvrjzlsaizsbttinnoyy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cmp6bHNhaXpzYnR0aW5ub3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNjc0ODMsImV4cCI6MjA0ODg0MzQ4M30.ZYx6PMvp96VVaKptEMIIBHEHOsI23MzKbuqkl4awn3A';
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
    alert("Por favor, insira pelo menos um valor válido para registrar uma venda.");
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
    alert(`Erro ao registrar a venda: ${error.message}`);
  } else {
    console.log("Venda inserida com sucesso:", data);
    alert("Venda registrada com sucesso!");
    carregarVendas(); // Atualiza a tabela com os dados mais recentes
    limparCampos();   // Limpa os campos e os valores exibidos
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
  } catch (err) {
    console.error("Erro ao carregar vendas:", err);
    alert("Erro ao carregar as vendas.");
  }
}





// Função para imprimir
function imprimir() {
  try {
    window.print();
  } catch (err) {
    console.error("Erro ao imprimir:", err);
  }
}

// Event Listeners para cálculos automáticos
document.querySelector(".valor12").addEventListener("input", somarValores);
document.querySelector(".valor20").addEventListener("input", somarValores);
document.querySelector(".recebido").addEventListener("input", descontarValores);

// Chamada inicial para carregar vendas ao carregar a página
window.onload = () => carregarVendas();