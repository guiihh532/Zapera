5.1. backend/

Serviço em Python com FastAPI.

Vai conter:

Rotas de API (usuarios, auth, planos, webhooks).

Regras de negócio básicas.

Conexão com banco de dados.

Cliente para comunicar com o Kestra.

Integrações com WhatsApp API e gateway de pagamento.

5.2. frontend/

Aplicativo mobile.

Inicialmente focado em Android (depois iOS).

Funcionalidades principais:

Onboarding (explicações).

Tela de login/cadastro.

Tela de status de conta (teste, ativo, expirado).

Tela de planos e botão “Assinar/Pagar”.

Tela para informar e editar o número de WhatsApp.

5.3. kestra-flows/

Arquivos YAML que definem os fluxos do Kestra.

Exemplos futuros:

zapera_activate_user.yaml

zapera_process_message.yaml

zapera_billing_sync.yaml (futuro)

5.4. docs/

Documentação do projeto.

Poderá conter:

Diagramas UML (PlantUML, imagens).

Prints exportados do Miro.

Especificações técnicas adicionais.

6. Tecnologias Principais

Linguagem backend: Python

Framework backend: FastAPI

Orquestrador: Kestra.io

Banco de dados: PostgreSQL (ou outro relacional, a definir)

Canal de comunicação: WhatsApp Business API

Serviço de IA: API de LLM (ex: OpenAI)

App Mobile: (a definir na implementação, exemplo: React Native + Expo)

Controle de versão: Git + GitHub

7. Ideia de Evolução do Projeto

Criar estrutura básica das pastas (backend/, frontend/, kestra-flows/, docs/).

Subir o backend Python com uma API mínima (ex.: /health).

Criar primeiro fluxo simples no Kestra (ex.: logar um evento de ativação).

Integrar WhatsApp (receber uma mensagem de teste).

Adicionar IA (chamada simples a um modelo de linguagem).

Implementar telas básicas do app (Onboarding, Login, Cadastro, Status).

Implementar cadastro real com banco de dados.

Adicionar sistemas de plano, teste grátis e cobrança.