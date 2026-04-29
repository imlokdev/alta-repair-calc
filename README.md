# 🛠️ Alta Repair - Calculadora de Mecânica

Uma ferramenta web moderna e responsiva desenvolvida para facilitar a vida de mecânicos em servidores de Roleplay (FIVEM). Este projeto permite calcular vendas, gerenciar faturamento localmente e gerar mensagens formatadas para o Discord (focadas em estoque de Kits e Ceras).

## ✨ Funcionalidades

- **Cálculo em Tempo Real:** Formatação monetária padrão brasileiro (`1.000,00`) com ícones de cédulas.
- **Gerador de Logs para Discord:** Gera blocos de texto prontos para copiar e colar em canais de estoque, separados por abas (Kits e Ceras).
- **Histórico Persistente:** Salva as últimas vendas no `LocalStorage` do navegador, permitindo consulta posterior mesmo após fechar a aba.
- **Interface Temática:** Design inspirado em UIs de jogos, com suporte completo a **Modo Claro** e **Modo Escuro**.
- **Compacto e Ágil:** Desenvolvido para ser usado em segunda tela ou via Steam Overlay, focando em produtividade.

## 🚀 Tecnologias Utilizadas

- [Vue.js 3](https://vuejs.org/) - Framework progressivo para interfaces.
- [Vite](https://vitejs.dev/) - Ferramenta de build ultra-rápida.
- [Tailwind CSS v3](https://tailwindcss.com/) - Framework CSS utilitário para design rápido.
- [pnpm](https://pnpm.io/) - Gerenciador de pacotes eficiente.

## 🛠️ Instalação e Execução

Para rodar este projeto localmente, siga os passos abaixo:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/imlokdev/alta-repair-calc.git](https://github.com/imlokdev/alta-repair-calc.git)
   cd alta-repair-calc
   ```

2. **Instale as dependências:**
   (Certifique-se de ter o `pnpm` instalado)
   ```bash
   pnpm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm dev
   ```

4. **Para gerar a versão de produção (Vercel/Netlify):**
   ```bash
   pnpm build
   ```

## 📖 Passo a Passo de Uso

1. **Identifique o Cliente:** Insira o ID (Passaporte) do cliente no campo superior direito.
2. **Monte o Carrinho:** Utilize os botões `+` e `-` na tabela principal para selecionar os serviços ou itens vendidos.
3. **Confira o Valor:** O painel "Resumo da Venda" mostrará o total formatado com ícones de dinheiro.
4. **Finalize:** Clique no botão **FINALIZAR**. Isso irá:
   - Limpar o carrinho e o campo de ID.
   - Gerar os textos formatados nas abas de "Kits" ou "Ceras".
   - Salvar a venda no seu histórico local.
5. **Copie para o Discord:** Vá até o bloco de texto, selecione a aba desejada e clique no ícone de cópia.
6. **Histórico:** Caso esqueça de copiar algo, clique em "Ver Histórico de Vendas" para recuperar os dados.

---

## 🔗 Link do Projeto

Você pode acessar a versão online aqui:
👉 **[Link do Projeto Funcionando](https://alta-repair-calc.vercel.app)**

---

## 👨‍💻 Créditos

Desenvolvido com ❤️ por **Gabriel Santos**.

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/imlokdev)

---
