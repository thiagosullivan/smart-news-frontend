# Atividade Prática - Smart New System

Sou o Thiago Santos e esse é meu projeto para o teste prático.

✉️: thiago.sullivan.dev@gmail.com <br>
🔗: https://thiagosullivanportfolio.vercel.app/ <br>
ℹ️: https://www.linkedin.com/in/thiagosullivan/
____

### Link para acesso ao live project:
https://thiagosullivan.github.io/smart-news-frontend/

---

### Preview
#### Home
![Home Page](https://i.ibb.co/C5hcGdvX/Captura-de-tela-2025-11-05-235354.png "Home Page")

#### Contas a pagar
![Contas a pagar](https://i.ibb.co/BHYQ8L0b/Captura-de-tela-2025-11-05-235948.png "Contas a Pagar page")

#### Modais
![Modais](https://i.ibb.co/n8PkvrDy/modais.jpg "Modais")

#### Mobile
![Mobile](https://i.ibb.co/9k6sQf9M/mobile.jpg "Mobile")

## Frontend
O projeto foi criado no Vite com TypeScript. Os componentes de select utilizam infinite scroll, onde os dados são buscados do backend utilizando paginação para carregamento parcial até finalizar a lista. O botão de PDF captura o estado atual da página inicial e gera um arquivo PDF com as informações filtradas pelo formulário de pesquisa e indicando quais informações foram buscadas no momento do registro. O botão à esquerda do formulário serve para limpar os filtros de busca.

Ao clicar no botão de cadastro, um popup é aberto permitindo cadastrar uma nova empresa ou selecionar uma empresa existente para lançar uma conta a pagar ou a receber no sistema.

O projeto possui duas páginas específicas: Contas a Pagar e Contas a Receber. Cada página filtra os cards exibidos conforme o tipo de conta. Ambas incluem um componente de select com infinite scroll (que acontecerá se os dados ainda não tiverem sido carregados na homepage') e oferecem funcionalidades de edição - permitindo alterar o status das contas entre Pendente, Pago e Vencido - além da opção de excluir contas. O projeto é totalmente responsivo.

### Bibliotecas usadas no frontend:
- Vite: Escolhido por não exigir SSR e SEO neste projeto
- Tailwind CSS: Framework moderno para agilidade no desenvolvimento e estilização
- Shadcn: Utilizado para componentes complexos como sidebar, tooltips, formulários e popups
- React Query (TanStack Query): Gerencia estados eficientemente, melhora performance e atualiza componentes automaticamente
- Rechart: Biblioteca para renderização de gráficos na homepage
- Sonner: Responsável pelos toasters de feedback após envio de formulários
- Lucide React Icons: Fornece todos os ícones utilizados no projeto
- Html2Canvas-pro e JsPDF: Capturam a tela e convertem para PDF

## Backend
Desenvolvido em Node.js com Fastify para receber e enviar informações do projeto. Utiliza configuração personalizada de CORS permitindo requisições apenas de URLs pré-determinadas. O ORM escolhido foi Prisma com PostgreSQL, utilizando Supabase como banco de dados. O backend está hospedado no Railway e disponível em: https://smart-news-backend-production-a4be.up.railway.app/
