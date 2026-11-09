# FinControl AI

Sistema administrativo de controle financeiro multiempresas, pensado para centralizar contas a pagar, contas a receber, fluxo de caixa, conciliação bancária, relatórios e apoio de inteligência artificial.

## Estado atual

**Versão 0.1.0 — primeira estrutura de interface.**

O projeto contém:
- Dashboard administrativo responsivo.
- Visão de contas a pagar, receber, valores realizados e vencimentos.
- Cadastro inicial de lançamentos (nesta versão, em memória).
- Busca e filtros de lançamentos.
- Visão inicial da carteira de empresas.
- Navegação preparada para fluxo de caixa, conciliação, relatórios e assistente IA.
- Cliente Supabase preparado para configuração por variáveis de ambiente.

> Importante: os dados que aparecem inicialmente são demonstrativos. Os lançamentos criados na interface ainda não são gravados no banco e podem desaparecer ao atualizar a página. Nenhuma integração bancária, automação ou análise de IA está ativa nesta versão.

## Requisitos

- Node.js 20 ou superior
- npm

## Executar localmente

```bash
npm install
cp .env.example .env
npm run dev
```

Abra o endereço local exibido pelo Vite.

## Conectar ao Supabase

1. Crie um projeto no Supabase.
2. Em Project Settings → API, copie a Project URL e a chave anon/public.
3. Preencha o arquivo `.env`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC
```

4. Reinicie o servidor de desenvolvimento.

**Segurança:** nunca coloque a chave `service_role` no frontend, no GitHub ou em cenários Make acessíveis ao navegador. Use a chave anon/public com políticas RLS corretamente configuradas.

## Próximas etapas de desenvolvimento

1. Aplicar e revisar a migração SQL do banco de dados.
2. Implementar autenticação administrativa e controle de acesso.
3. Conectar empresas e lançamentos ao Supabase com isolamento por empresa.
4. Persistir pagamentos parciais, recorrências e anexos.
5. Implementar fluxo de caixa previsto/realizado e conciliação.
6. Criar relatórios e exportações.
7. Integrar Make.com para captura de documentos e alertas por e-mail.
8. Integrar IA com dados autorizados e trilha de auditoria.

## Estrutura

```
src/
  lib/
    supabase.js
  App.jsx
  main.jsx
  styles.css
index.html
.env.example
```

## Princípios do projeto

- Interface interna administrativa; sem portal de acesso para clientes nesta fase.
- Arquitetura multiempresa, com dados segregados.
- Auditoria para ações financeiras relevantes.
- IA como apoio à análise, nunca como substituta da validação humana.
- Credenciais e dados financeiros protegidos por políticas de acesso.