# Casal Financeiro 💰❤️

Este projeto é uma plataforma de gestão financeira voltada para casais, permitindo o acompanhamento de despesas pessoais e compartilhadas, com suporte a diferentes tipos de parcelamento e visibilidade.

---

## 🇧🇷 Português

### 🚀 Sobre o Projeto
O **Casal Financeiro** foi desenvolvido para facilitar a organização das finanças entre duas pessoas. Ele permite registrar gastos, categorizá-los e decidir se uma despesa é individual ou compartilhada com o parceiro.

### ✨ Funcionalidades Principais
- **Gestão de Despesas:** Criação, edição e exclusão de gastos.
- **Tipos de Despesa:** Suporte para despesas únicas, parceladas e recorrentes.
- **Visibilidade:** Controle se um gasto é `PESSOAL` (visível apenas para quem criou) ou `COMPARTILHADO`.
- **Autenticação:** Integração robusta via AWS Amplify/Cognito.
- **Filtros Temporais:** Consulta de gastos por mês e ano.

### 🛠️ Tecnologias Utilizadas

#### **Backend**
- **Java 21**: Linguagem principal.
- **Spring Boot 4.0.x**: Framework para a construção da API REST.
- **Spring Data JPA / Hibernate**: Persistência de dados.
- **PostgreSQL**: Banco de dados relacional.
- **Spring Security & OAuth2 Resource Server**: Proteção de rotas integrada ao AWS Cognito.
- **Lombok**: Redução de código boilerplate.
- **Maven**: Gerenciador de dependências.

#### **Frontend (Mobile)**
- **React Native 0.81.x**: Framework mobile.
- **Expo 54.x**: Plataforma e SDK para desenvolvimento acelerado.
- **TypeScript**: Tipagem estática para maior segurança.
- **Expo Router**: Navegação baseada em arquivos.
- **AWS Amplify**: Integração direta para autenticação e serviços cloud.
- **React Native Reanimated**: Animações fluidas na interface.
- **Native Stack / Bottom Tabs**: Estrutura de navegação nativa.

---

### 📦 Como Executar

#### **Pré-requisitos**
- Java 21 instalado.
- Node.js instalado (v18+ recomendado).
- Docker (para o banco de dados) ou PostgreSQL local.
- Expo Go instalado no celular (para testar o mobile).

#### **1. Configuração do Backend**
1. Acesse a pasta `backend/`.
2. Configure as credenciais do banco de dados em `src/main/resources/application.properties`.
3. Execute:
   ```bash
   ./mvnw spring-boot:run
   ```

#### **2. Configuração do Frontend**
1. Acesse a pasta `frontend/`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o Expo:
   ```bash
   npx expo start
   ```

---

## 🇺🇸 English

### 🚀 About the Project
**Casal Financeiro** (Financial Couple) is a platform designed to simplify financial organization between couples. It allows users to log expenses, categorize them, and decide whether an expense is individual or shared with their partner.

### ✨ Key Features
- **Expense Management:** Create, edit, and delete expenses.
- **Expense Types:** Support for single, installment, and recurring expenses.
- **Visibility:** Control if an expense is `PERSONAL` (only visible to the creator) or `SHARED`.
- **Authentication:** Robust integration via AWS Amplify/Cognito.
- **Time Filters:** Query expenses by month and year.

### 🛠️ Tech Stack

#### **Backend**
- **Java 21**: Core language.
- **Spring Boot 4.0.x**: REST API framework.
- **Spring Data JPA / Hibernate**: Data persistence.
- **PostgreSQL**: Relational database.
- **Spring Security & OAuth2 Resource Server**: Route protection integrated with AWS Cognito.
- **Lombok**: Boilerplate code reduction.
- **Maven**: Dependency management.

#### **Frontend (Mobile)**
- **React Native 0.81.x**: Mobile framework.
- **Expo 54.x**: Platform and SDK for accelerated development.
- **TypeScript**: Static typing for enhanced safety.
- **Expo Router**: File-based navigation.
- **AWS Amplify**: Direct integration for authentication and cloud services.
- **React Native Reanimated**: Fluid UI animations.
- **Native Stack / Bottom Tabs**: Native navigation structure.

---

### 📦 How to Run

#### **Prerequisites**
- Java 21 installed.
- Node.js installed (v18+ recommended).
- Docker (for the database) or local PostgreSQL.
- Expo Go installed on your phone (for mobile testing).

#### **1. Backend Setup**
1. Navigate to the `backend/` folder.
2. Configure database credentials in `src/main/resources/application.properties`.
3. Run:
   ```bash
   ./mvnw spring-boot:run
   ```

#### **2. Frontend Setup**
1. Navigate to the `frontend/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Expo:
   ```bash
   npx expo start
   ```
