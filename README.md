# Sistema de Agendamento para Salão de Beleza

Sistema web desenvolvido como projeto de extensão universitária com o objetivo de auxiliar na organização de agendamentos e serviços de um salão de beleza.

A aplicação permite que clientes consultem os serviços disponíveis, seus respectivos preços e realizem agendamentos. O sistema também possui uma área administrativa para gerenciamento dos serviços e dos agendamentos.

## Funcionalidades

### Área do cliente

- Visualização dos serviços disponíveis
- Exibição de preços e duração dos serviços
- Agendamento de atendimento
- Cadastro de informações do cliente
- Seleção de data e horário
- Verificação de horários disponíveis

### Área administrativa

- Autenticação de acesso
- Visualização dos agendamentos
- Marcação de atendimento como realizado
- Cancelamento de agendamentos
- Exclusão de agendamentos
- Cadastro de serviços
- Edição de serviços
- Exclusão de serviços
- Definição de preço, duração e descrição dos serviços
- Atualização automática dos serviços exibidos na área do cliente

## Tecnologias utilizadas

- **Next.js** — Framework utilizado para desenvolvimento da aplicação
- **React** — Construção das interfaces e componentes
- **TypeScript** — Tipagem estática e maior segurança durante o desenvolvimento
- **MySQL** — Banco de dados relacional
- **mysql2** — Conexão e execução de consultas no banco de dados
- **Better Auth** — Autenticação e gerenciamento de sessões
- **Tailwind CSS** — Estilização da interface
- **Lucide React** — Biblioteca de ícones

## Arquitetura

A aplicação foi desenvolvida utilizando o **App Router do Next.js**, com separação entre componentes, páginas, rotas de API e lógica de acesso ao banco de dados.

O sistema possui uma comunicação entre a interface da aplicação e as APIs responsáveis pelo processamento das operações no banco de dados.

Fluxo simplificado:

```text
Interface (React)
       ↓
API Routes (Next.js)
       ↓
Consultas SQL
       ↓
MySQL
