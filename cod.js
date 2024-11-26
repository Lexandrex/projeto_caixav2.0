var soma = 0

function somarValores() {
    // Pegar os valores dos inputs
    var valor1 = document.querySelector(".valor12").value || 0;
    var valor2 = document.querySelector(".valor20").value || 0;

    // Somar os valores
    soma = parseInt(valor1) * 12 + parseInt(valor2) * 20;

    // Atualizar o texto do resultado
    document.querySelector(".resultado").innerHTML = soma;
}

function descontarValores() {

    //pega o valor do imput
    var din = document.querySelector(".recebido").value || 0;

    var troco = parseInt(din) - parseInt(soma)

    document.querySelector(".troco").innerHTML = troco

}

function imprimir() {
    window.print()
}

function gerarPDF() {
    // Cria um novo documento PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Adiciona algum conteúdo
    doc.text( valor1);

    // Salva o PDF com o nome 'documento.pdf'
    doc.save("Relatorio.pdf");
}

let formaPagamento = ""
function selecionarPagamento(tipo) {
    formaPagamento = tipo;// Função para enviar uma venda ao backend
}
async function enviarVenda() {
    const valor12 = parseInt(document.querySelector(".valor12").value || 0);
    const valor20 = parseInt(document.querySelector(".valor20").value || 0);

    if (!formaPagamento) {
        alert("Por favor, selecione uma forma de pagamento.");
        return;
    }
    if (valor12 == 0 && valor20 == 0){
        alert("Não é possivel registrar uma venda vazia")
        return;
    }

    const dadosVenda = {
        quantidade_12: valor12,
        quantidade_20: valor20,
        formaPagamento: formaPagamento, // Usa a variável formaPagamento
    };
    try {
        const response = await fetch("http://localhost:3001/vendas", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosVenda),
        });

        const data = await response.json();
        alert("Venda registrada com sucesso!");
        carregarVendas();
    } catch (error) {
        console.error("Erro ao registrar venda:", error);
    }
}




// Chamada inicial ao carregar a página (mostra todas as vendas)
window.onload = () => carregarVendas();

function carregarVendas() {
    fetch("http://localhost:3001/vendas")
        .then(response => response.json())
        .then(data => {
            const tabelaVendas = document.querySelector("#tabela-vendas tbody");
            tabelaVendas.innerHTML = ""; // Limpa o conteúdo atual

            data.forEach(venda => {
                let total = parseFloat(venda.total); // Garante que seja um número decimal
                if (isNaN(total)) total = 0; // Se for inválido, define como 0

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${venda.quantidade_12}</td>
                    <td>${venda.quantidade_20}</td>
                    <td>R$${total.toFixed(2)}</td> <!-- Exibe com 2 casas decimais -->
                    <td>${new Date(venda.data_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td> <!-- Exibe somente a hora e os minutos -->
                `;
                tabelaVendas.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar vendas:", error);
        });
}