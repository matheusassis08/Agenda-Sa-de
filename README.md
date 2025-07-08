# Sistema de Agendamento para Clínica de Nutrição

Este projeto é uma solução completa para a gestão de agendamentos da clínica de nutrição da faculdade, desenvolvida para modernizar e otimizar o processo de marcação de consultas, beneficiando clientes, alunos e coordenadores.



## 📋 Índice

- [🎯 O Problema](#🎯-o-problema)  
- [💡 A Solução](#💡-a-solução)  
- [✨ Funcionalidades Principais](#✨-funcionalidades-principais)  
- [🛠️ Tecnologias Utilizadas](#🛠️-tecnologias-utilizadas)  
- [🚀 Como Executar o Projeto](#🚀-como-executar-o-projeto)  
- [📂 Estrutura de Ficheiros](#📂-estrutura-de-ficheiros)  
- [🤝 Equipe](#🤝-equipe)  
- [⚖️ Licença](#⚖️-licença)

---

## 🎯 O Problema

O processo de agendamento de consultas nutricionais na clínica da faculdade era realizado manualmente, por meio de ligações, e-mails ou mensagens via WhatsApp. Esse método gerava ineficiências, desorganização, longos tempos de espera para os clientes e sobrecarga de trabalho para a coordenação.

---

## 💡 A Solução

Para resolver esse problema, desenvolvemos uma plataforma completa com um backend robusto e uma aplicação móvel intuitiva. O sistema centraliza todo o fluxo de agendamento, permitindo que:

- **Clientes** visualizem horários disponíveis e façam pré-agendamentos de forma autônoma.  
- **Coordenadores** aprovem ou rejeitem solicitações com um clique, além de gerenciarem alunos e horários.  
- **Alunos** tenham uma visão clara de suas agendas de atendimento.

---

## ✨ Funcionalidades Principais

### Para Coordenadores:
- ✅ Dashboard com resumo de alunos, horários e solicitações pendentes  
- ✅ Cadastro, listagem e edição de alunos  
- ✅ Adição e remoção de horários de atendimento, associando-os a alunos  
- ✅ Aprovação ou rejeição de pré-agendamentos  
- ✅ Edição do próprio perfil

### Para Clientes:
- ✅ Visualização de horários disponíveis com detalhes (aluno, data, hora)  
- ✅ Realização de pré-agendamentos  
- ✅ Acompanhamento do status das consultas (pendente, confirmada)  
- ✅ Cancelamento de consultas  
- ✅ Edição do próprio perfil

### Para Alunos:
- ✅ Visualização completa da agenda com horários disponíveis e consultas marcadas

---

## 🛠️ Tecnologias Utilizadas

### Backend (API RESTful):
- **Node.js** – Ambiente de execução JavaScript no servidor  
- **Express.js** – Framework para construção da API  
- **MongoDB** – Banco de dados NoSQL  
- **Mongoose** – ODM para modelagem dos dados  
- **JSON Web Tokens (JWT)** – Autenticação e proteção de rotas  
- **bcrypt.js** – Criptografia de senhas  
- **Dotenv** – Gerenciamento de variáveis de ambiente

### Frontend (Aplicativo Móvel):
- **React Native** – Framework para desenvolvimento mobile multiplataforma  
- **Expo** – Plataforma para facilitar o desenvolvimento com React Native  
- **React Navigation** – Gerenciamento de navegação entre telas  
- **Axios** – Cliente HTTP para comunicação com a API

---

## 🚀 Como Executar o Projeto

### Pré-requisitos:
- Node.js (versão 16 ou superior)  
- MongoDB local ou conta no MongoDB Atlas  
- Gerenciador de pacotes (npm ou yarn)  
- Aplicativo Expo Go instalado no smartphone

### 1. Configuração do Backend

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/nome-do-repositorio.git

# Acesse a pasta do backend
cd nome-do-repositorio/backend

# Instale as dependências
npm install

# Crie um arquivo .env com o seguinte conteúdo:
MONGO_URI=sua_string_de_conexao_com_o_mongodb
JWT_SECRET=sua_chave_secreta_para_jwt
PORT=3001

# Inicie o servidor backend
npm start
````

### 2. Configuração do Frontend

```bash
# Em outro terminal, acesse a pasta do frontend
cd ../frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento Expo
npx expo start
```

📱 Após iniciar, um QR Code aparecerá no terminal. Escaneie com o aplicativo **Expo Go** no seu celular para abrir o app.

⚠️ **Importante:** Certifique-se de que o seu computador e o seu celular estejam conectados à mesma rede Wi-Fi.
Atualize a constante `API_URL` nos arquivos do frontend com o IP local da sua máquina.

---

## 📂 Estrutura de Ficheiros

```
/
├── backend/
│   ├── models/       # Modelos de dados (Schemas Mongoose)
│   ├── routes/       # Rotas da API
│   ├── .env          # Variáveis de ambiente
│   └── app.js        # Arquivo principal do servidor
│
└── frontend/
    ├── screens/      # Telas da aplicação móvel
    └── App.js        # Arquivo de entrada e navegação
```

---

## 🤝 Equipe

* **Matheus Assis**: Organização geral do projeto, redação técnica e prototipagem da interface
* **Bernardo Ivo** e **Carlos Eduardo**: Levantamento de requisitos, elaboração de histórias de usuário e casos de uso

---

## ⚖️ Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo `LICENSE` para mais informações.
