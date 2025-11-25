# Zapera – Assistente de IA via WhatsApp

O **Zapera** é um sistema que conecta um **aplicativo mobile** (Android/iOS) com um **agente de inteligência artificial** que conversa com o usuário pelo **WhatsApp**.  

A ideia é simples para o usuário final, mas organizada por trás:

- O usuário baixa o app na loja (Play Store / App Store).
- Cria uma conta e informa o número de WhatsApp.
- Ganha um **período de teste grátis**.
- Depois do teste, o acesso ao bot continua apenas com **login + plano pago**.
- Toda a lógica “pesada” roda em **Python**, orquestrada pelo **Kestra.io**, com código versionado no **GitHub**.

Este repositório será a base do projeto Zapera, contendo:

- **backend/** → API em Python (FastAPI).
- **frontend/** → App mobile (inicialmente Android).
- **kestra-flows/** → Fluxos de orquestração no Kestra.
- **docs/** → Documentação, UML, links para o Miro etc.

---

## 1. Objetivo do Zapera

O Zapera será um **assistente inteligente via WhatsApp** que ajuda o usuário a resolver vários tipos de problemas e dúvidas usando IA (LLM).

Principais pontos:

- Interface de uso principal: **WhatsApp**.
- Interface de configuração e planos: **aplicativo mobile**.
- Backend e lógica de negócio: **Python**.
- Orquestração de tarefas: **Kestra.io**.
- Todo código versionado e atualizado via **GitHub**.

---

## 2. Arquitetura Geral

A arquitetura do Zapera é composta pelos seguintes componentes principais:

1. **Frontend (App Mobile)**
   - Aplicativo simples que o usuário baixa da loja.
   - Funcionalidades:
     - Explicações sobre o Zapera.
     - Cadastro e login (e-mail/senha).
     - Cadastro do número de WhatsApp.
     - Exibição de status da conta (teste, plano ativo, plano expirado).
     - Exibição dos planos disponíveis e botão de pagamento.

2. **Backend (Python – FastAPI)**
   - Responsável por:
     - APIs para cadastro/login de usuário.
     - Gestão de planos e assinaturas.
     - Registro do número de WhatsApp do usuário.
     - Comunicação com o Kestra (iniciar fluxos).
     - Receber webhooks do WhatsApp (mensagens recebidas).
     - Receber webhooks do gateway de pagamento.
   - Será desenvolvido em **Python** (FastAPI), com banco de dados relacional (ex: PostgreSQL).

3. **Orquestrador – Kestra.io**
   - Responsável por coordenar fluxos de trabalho:
     - Fluxo de ativação de usuário (envio da primeira mensagem no WhatsApp).
     - Fluxo de processamento de mensagens (mensagem → IA → resposta).
     - Fluxos futuros (análises, relatórios, tarefas recorrentes etc.).
   - Os arquivos de fluxo (YAML) serão salvos na pasta `kestra-flows/` deste repositório.

4. **WhatsApp Business API**
   - Canal de comunicação com o usuário.
   - Dispara webhooks para o backend sempre que o usuário enviar uma mensagem.
   - O backend, com ajuda do Kestra, responde usando a API do WhatsApp.

5. **Serviço de IA (LLM)**
   - Serviço externo de IA (ex: OpenAI, etc.).
   - Recebe o texto da mensagem do usuário + contexto (plano, histórico, etc.) e devolve a resposta inteligente.

6. **Gateway de Pagamento**
   - Responsável por cobrar os planos (mensal, anual, créditos etc.).
   - Quando o pagamento é aprovado, envia webhook para o backend.
   - O backend atualiza o status da conta do usuário.

---

## 3. Fluxo do Usuário (Experiência Final)

### 3.1. Passo a passo da jornada

1. **Download do app**
   - Usuário baixa o Zapera na loja (Android primeiro).

2. **Onboarding**
   - Ao abrir o app, o usuário vê:
     - O que é o Zapera.
     - Como funciona o atendimento via WhatsApp.
     - Benefícios e exemplos de uso.

3. **Cadastro / Login**
   - Usuário cria uma conta com:
     - Nome
     - E-mail
     - Senha
   - Depois de criado, pode fazer login com e-mail/senha.

4. **Cadastro do WhatsApp**
   - Após login, o app pede o **número de WhatsApp** do usuário.
   - O app envia esse número para o backend.

5. **Ativação do teste grátis**
   - O backend marca o usuário com um **status de teste ativo**.
   - O backend aciona o **Kestra**, que dispara um fluxo de ativação.
   - O fluxo de ativação envia uma mensagem de boas-vindas no WhatsApp.
   - Exemplo de mensagem:
     > “Olá, eu sou o Zapera! Você tem um período de teste para me usar. Pergunte o que quiser!”

6. **Uso via WhatsApp**
   - A partir daqui, o usuário conversa com o Zapera diretamente no WhatsApp.
   - Cada mensagem recebida:
     - Chega via webhook no backend.
     - O backend chama um fluxo no Kestra.
     - O fluxo consulta IA + regras de plano.
     - O backend envia a resposta de volta pelo WhatsApp.

7. **Fim do teste e planos**
   - Quando o período de teste acaba:
     - O backend marca a conta como **inativa** para uso do bot.
   - No app:
     - O usuário vê que o teste acabou.
     - São exibidos os **planos pagos**.
   - Após o pagamento ser confirmado:
     - O gateway de pagamento avisa o backend via webhook.
     - O backend ativa o plano do usuário.
     - O bot no WhatsApp volta a funcionar normalmente.

---

## 4. Fluxo Técnico (Simplificado)

### 4.1. Cadastro e ativação no WhatsApp

- App chama `POST /usuarios` → Backend cria usuário no banco.
- App chama `POST /usuarios/{id}/ativar-whatsapp` com o número do usuário.
- Backend:
  - Salva/atualiza o número do usuário.
  - Define data de início e fim do teste grátis.
  - Chama o Kestra (inicia fluxo `zapera_activate_user`).
- Kestra:
  - Executa tarefas de integração com WhatsApp.
  - Envia mensagem de boas-vindas.
- Usuário começa a ver o Zapera no WhatsApp.

### 4.2. Mensagens do usuário no WhatsApp

- Usuário manda mensagem para o número do Zapera.
- WhatsApp → envia webhook → Backend.
- Backend:
  - Identifica o usuário (pelo número).
  - Verifica se o plano/teste está ativo.
  - Chama o fluxo do Kestra (`zapera_process_message`) com:
    - Texto da mensagem
    - Dados do usuário
- Kestra:
  - Chama o serviço de IA (LLM).
  - Aplica regras de negócio (limites, planos, etc.).
  - Devolve a resposta processada para o Backend.
- Backend:
  - Envia a resposta para o usuário via API do WhatsApp.

---

## 5. Arquitetura de Código e Pastas

A organização inicial do repositório será:

```bash
zapera/
  backend/        # Código do backend em Python (FastAPI)
  frontend/       # Código do app mobile (React Native/Expo ou similar)
  kestra-flows/   # Arquivos YAML dos fluxos do Kestra
  docs/           # Documentação e UML
  README.md       # Este arquivo
