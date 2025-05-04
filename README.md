# Tabelas Criadas no Banco de Dados

## Tabela: Vendas
A tabela abaixo descreve a estrutura utilizada para armazenar informações sobre as vendas.

| Nome           | Tipo                          | Formato  |
|---------------|-----------------------------|---------|
| id_venda      | integer                      | int4    |
| data          | date                         | date    |
| formaPagamento | text                         | text    |
| quantidade_12 | integer                      | int4    |
| quantidade_20 | integer                      | int4    |
| total         | numeric                      | numeric |
| hora          | time without time zone       | time    |


Cada coluna representa um atributo essencial para o registro das vendas realizadas, incluindo:
- **id_venda**: Identificador único da venda.
- **data**: Data da venda.
- **formaPagamento**: Forma de pagamento utilizada.
- **quantidade_12**: Quantidade de itens do tipo 12 vendidos.
- **quantidade_20**: Quantidade de itens do tipo 20 vendidos.
- **total**: Valor total da venda.
- **hora**: Horário em que a venda foi realizada.

### Tabela: Gastos
A tabela abaixo descreve a estrutura utilizada para armazenar informações sobre os gastos.

| Nome        | Tipo                          | Formato  |
|------------|-----------------------------|---------|
| id         | bigint                        | int8    |
| data       | date                          | date    |
| hora       | time without time zone       | time    |
| quantidade | double precision             | float8  |
| descricao  | text                          | text    |

Cada coluna representa um atributo essencial para o registro dos gastos realizados, incluindo:
- **id**: Identificador único do gasto.
- **data**: Data do gasto.
- **hora**: Horário do gasto.
- **quantidade**: Valor do gasto.
- **descricao**: Descrição detalhada do gasto.

### Tabela: Fornecedor
A tabela abaixo descreve a estrutura utilizada para armazenar informações sobre os fornecedores.

| Nome         | Tipo                 | Formato  |
|-------------|---------------------|---------|
| cnpj        | character varying   | varchar |
| nome        | character varying   | varchar |
| telefone    | character varying   | varchar |
| descricao   | text                | text    |
| id_fornecedor | bigint              | int8    |

Cada coluna representa um atributo essencial para o registro das informações dos fornecedores, incluindo:
- **cnpj**: Número do CNPJ do fornecedor.
- **nome**: Nome do fornecedor.
- **telefone**: Contato do fornecedor.
- **descricao**: Descrição sobre o fornecedor.
- **id_fornecedor**: Identificador único do fornecedor.

