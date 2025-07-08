Sistema de Agendamento para Clínica Escola de Nutrição
Este projeto é uma solução completa para a gestão de agendamentos da clínica de nutrição da faculdade, desenvolvida para modernizar e otimizar o processo de marcação de consultas, beneficiando clientes, alunos e coordenadores.

📋 Índice
O Problema

A Solução

✨ Funcionalidades Principais

🛠️ Tecnologias Utilizadas

🚀 Como Executar o Projeto

📂 Estrutura de Ficheiros

🤝 Equipa

⚖️ Licença

🎯 O Problema
O processo de agendamento de consultas nutricionais na clínica da faculdade era realizado de forma manual, através de ligações, e-mails ou mensagens de WhatsApp. Este método gerava ineficiência, desorganização, longos tempos de espera para os clientes e uma sobrecarga de trabalho para a coordenação.

💡 A Solução
Para resolver este problema, desenvolvemos uma plataforma completa com um backend robusto e uma aplicação móvel intuitiva. O sistema centraliza todo o fluxo de agendamento, permitindo que:

Clientes visualizem horários e façam um pré-agendamento de forma autónoma.

Coordenadores aprovem ou rejeitem solicitações com um clique, além de gerirem alunos e horários.

Alunos tenham uma visão clara da sua agenda de atendimentos.

✨ Funcionalidades Principais
Para Coordenadores
[x] Dashboard com resumo de alunos, horários e solicitações pendentes.

[x] Cadastrar, listar e editar alunos.

[x] Adicionar e remover horários de atendimento, associando-os a um aluno.

[x] Aprovar ou rejeitar pré-agendamentos solicitados por clientes.

[x] Editar o seu próprio perfil.

Para Clientes
[x] Visualizar horários disponíveis com detalhes (aluno, data, hora).

[x] Realizar um pré-agendamento (solicitação).

[x] Acompanhar o estado das suas consultas (pendente, confirmada).

[x] Cancelar uma consulta agendada.

[x] Editar o seu próprio perfil.

Para Alunos
[x] Visualizar a sua agenda completa, com horários disponíveis e consultas marcadas.

🛠️ Tecnologias Utilizadas
O projeto é dividido em duas partes principais:

Backend (API RESTful)

Node.js: Ambiente de execução JavaScript no servidor.

Express.js: Framework para a construção da API.

MongoDB: Banco de dados NoSQL para armazenar os dados.

Mongoose: ODM para modelar os dados da aplicação.

JSON Web Tokens (JWT): Para autenticação e proteção de rotas.

bcrypt.js: Para encriptação de senhas.

Dotenv: Para gestão de variáveis de ambiente.

Frontend (Aplicação Móvel)

React Native: Framework para o desenvolvimento de aplicações móveis multiplataforma.

Expo: Plataforma e conjunto de ferramentas para facilitar o desenvolvimento com React Native.

React Navigation: Para a gestão de navegação entre telas (Stack e Drawer).

Axios: Cliente HTTP para fazer requisições à API do backend.

🚀 Como Executar o Projeto
Para executar este projeto localmente, siga os passos abaixo.

Pré-requisitos
Node.js (versão 16 ou superior)

MongoDB ou uma conta no MongoDB Atlas (Cloud).

Um gestor de pacotes como npm ou yarn.

Aplicação Expo Go no seu smartphone para testar a aplicação móvel.

1. Configuração do Backend
# Clone o repositório
git clone [https://github.com/seu-usuario/nome-do-repositorio.git](https://github.com/seu-usuario/nome-do-repositorio.git)

# Navegue para a pasta do backend
cd nome-do-repositorio/backend

# Instale as dependências
npm install

# Crie um ficheiro .env na raiz da pasta 'backend' e adicione as seguintes variáveis:
MONGO_URI=sua_string_de_conexao_com_o_mongodb
JWT_SECRET=sua_chave_secreta_para_jwt
PORT=3001

# Inicie o servidor backend
npm start

2. Configuração do Frontend
# Num novo terminal, navegue para a pasta do frontend
cd ../frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento do Expo
npx expo start

Após iniciar o frontend, um QR Code aparecerá no terminal. Leia-o com a aplicação Expo Go no seu smartphone para abrir a aplicação.

Importante: Certifique-se de que o seu computador e o seu smartphone estão conectados à mesma rede Wi-Fi. Além disso, atualize a constante API_URL nos ficheiros do frontend com o endereço IP local do seu computador.

📂 Estrutura de Ficheiros
A estrutura do projeto foi organizada da seguinte forma para manter o código limpo e escalável:

/
├── backend/
│   ├── models/       # Modelos de dados (Mongoose Schemas)
│   ├── routes/       # Definição das rotas da API
│   ├── .env          # Variáveis de ambiente
│   └── app.js        # Ficheiro principal do servidor Express
│
└── frontend/
    └── screens/      # Todas as telas da aplicação React Native
    └── App.js        # Ponto de entrada e configuração da navegação

🤝 Equipa
Matheus Assis: Organização geral do projeto, redação técnica e prototipagem da interface.

Bernardo Ivo e Carlos Eduardo: Levantamento de requisitos, elaboração de histórias de utilizador e casos de uso.

⚖️ Licença
Este projeto está sob a licença MIT. Veja o ficheiro LICENSE para mais detalhes.
