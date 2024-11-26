import Vendas from "../models/vendas_model.js";

export const getVendas = async (req, res) => {
    try {
        // Buscando todas as vendas na tabela 'Vendas'
        const vendas = await Vendas.findAll(); // Renomeado para evitar conflito
        console.log(vendas)
        res.json(vendas); // Retorna todas as vendas em formato JSON
    } catch (e) {
        console.error("Erro ao acessar a tabela Vendas:", e);
        res.status(500).json({ error: "Erro ao acessar a tabela Vendas" });
    }
};



// Função para criar uma nova venda
export const createVenda = async (req, res) => {
    try {
        console.log("Corpo da requisição recebido:", req.body); // Log 1
        const novaVenda = await Vendas.create(req.body); // Definição correta da variável
        console.log("Venda criada:", novaVenda); // Log 2
        res.json({ message: "Uma nova venda foi registrada", venda: novaVenda });
    } catch (e) {
        console.error("Erro ao criar venda:", e); // Log 3
        res.status(500).json({ error: "Erro ao inserir a venda" });
    }
};

