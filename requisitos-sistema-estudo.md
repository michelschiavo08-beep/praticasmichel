# 📚 StudyFlow — Documento de Requisitos do Sistema

**Versão:** 1.0  
**Data:** Abril de 2026  
**Plataforma:** Web + Mobile (iOS / Android)  
**Público-alvo:** Qualquer pessoa que estuda

---

## 1. Visão Geral do Produto

O **StudyFlow** é uma plataforma de organização de estudos que centraliza cronogramas, anotações, tarefas e estatísticas de desempenho em um único lugar. O objetivo é ajudar qualquer estudante — do ensino médio ao autodidata — a estudar com mais foco, consistência e clareza sobre seu progresso.

---

## 2. Objetivos do Sistema

- Permitir que o usuário planeje e acompanhe seus estudos com cronogramas personalizados
- Centralizar anotações e resumos por matéria/disciplina
- Controlar tarefas e metas de estudo com prazos e prioridades
- Apresentar estatísticas de desempenho e evolução ao longo do tempo
- Estar disponível em web e mobile com sincronização em tempo real

---

## 3. Requisitos Funcionais

### 3.1 Autenticação e Perfil

| ID | Requisito |
|----|-----------|
| RF01 | O sistema deve permitir cadastro com e-mail e senha |
| RF02 | O sistema deve suportar login via Google e Apple |
| RF03 | O usuário deve poder editar nome, foto de perfil e fuso horário |
| RF04 | O sistema deve suportar recuperação de senha por e-mail |

### 3.2 Cronograma / Plano de Estudos

| ID | Requisito |
|----|-----------|
| RF05 | O usuário deve poder criar matérias/disciplinas com cor e ícone personalizados |
| RF06 | O sistema deve permitir criar sessões de estudo no calendário (data, hora, duração, matéria) |
| RF07 | O usuário deve poder definir metas semanais de horas por matéria |
| RF08 | O sistema deve exibir visualização semanal e mensal do cronograma |
| RF09 | O sistema deve enviar notificações/lembretes antes das sessões agendadas |
| RF10 | O usuário deve poder marcar uma sessão como concluída ou reagendá-la |

### 3.3 Controle de Tarefas e Metas

| ID | Requisito |
|----|-----------|
| RF11 | O usuário deve poder criar tarefas com título, descrição, prazo e prioridade (alta/média/baixa) |
| RF12 | As tarefas devem ser vinculadas a uma matéria |
| RF13 | O sistema deve exibir tarefas em lista com filtros por status, matéria e prazo |
| RF14 | O usuário deve poder marcar tarefas como concluídas |
| RF15 | O sistema deve alertar sobre tarefas próximas do prazo |
| RF16 | O usuário deve poder criar metas de longo prazo (ex: "terminar capítulo X até dia Y") |

### 3.4 Anotações e Resumos

| ID | Requisito |
|----|-----------|
| RF17 | O usuário deve poder criar notas de texto vinculadas a uma matéria |
| RF18 | O editor de notas deve suportar formatação rica (negrito, itálico, listas, títulos) |
| RF19 | O sistema deve suportar upload de imagens nas notas |
| RF20 | O usuário deve poder organizar notas em pastas/subpastas por matéria e tópico |
| RF21 | O sistema deve oferecer busca full-text nas anotações |
| RF22 | O usuário deve poder exportar notas em PDF |

### 3.5 Desempenho e Estatísticas

| ID | Requisito |
|----|-----------|
| RF23 | O sistema deve registrar automaticamente o tempo de cada sessão de estudo concluída |
| RF24 | O dashboard deve exibir horas estudadas por dia, semana e mês |
| RF25 | O sistema deve exibir gráficos de distribuição de tempo por matéria |
| RF26 | O sistema deve calcular e exibir a taxa de conclusão de tarefas |
| RF27 | O sistema deve exibir sequência de dias estudados (streak) |
| RF28 | O usuário deve poder comparar o planejado vs. o realizado por semana |

---

## 4. Requisitos Não Funcionais

| ID | Requisito |
|----|-----------|
| RNF01 | A aplicação deve funcionar nos navegadores Chrome, Firefox, Safari e Edge (versões recentes) |
| RNF02 | O app mobile deve ser compatível com iOS 15+ e Android 10+ |
| RNF03 | A sincronização entre dispositivos deve ocorrer em menos de 5 segundos |
| RNF04 | O sistema deve suportar uso offline no mobile com sincronização ao reconectar |
| RNF05 | Dados do usuário devem ser criptografados em repouso e em trânsito (TLS 1.2+) |
| RNF06 | O tempo de carregamento inicial da aplicação deve ser inferior a 3 segundos |
| RNF07 | A interface deve ser responsiva e adaptada para telas de 320px a 2560px |
| RNF08 | O sistema deve estar disponível 99,5% do tempo (SLA) |

---

## 5. Perfis de Usuário

### 5.1 Usuário Padrão (gratuito)
- Acesso a até 5 matérias
- Até 30 notas
- Estatísticas dos últimos 30 dias
- Sincronização em 2 dispositivos

### 5.2 Usuário Premium
- Matérias e notas ilimitadas
- Histórico completo de estatísticas
- Export de notas em PDF
- Sincronização em dispositivos ilimitados
- Notificações avançadas

---

## 6. Telas do Sistema

### 6.1 Tela de Onboarding
- Apresentação do produto em 3 slides
- Seleção do perfil de estudo (concurso, faculdade, idioma, geral)
- Cadastro/login

### 6.2 Dashboard (Tela Inicial)
- Saudação personalizada com nome do usuário
- Resumo do dia: sessões agendadas, tarefas pendentes, horas estudadas
- Streak atual de dias estudados
- Atalhos rápidos para: nova sessão, nova tarefa, nova nota
- Mini gráfico semanal de horas estudadas

### 6.3 Cronograma
- Calendário semanal/mensal com sessões de estudo coloridas por matéria
- Botão para adicionar nova sessão
- Modal de criação de sessão: matéria, data, hora início/fim, observação
- Indicador de meta semanal por matéria (barra de progresso)

### 6.4 Tarefas
- Lista de tarefas agrupadas por: hoje, esta semana, futuras, concluídas
- Filtros por matéria e prioridade
- Card de tarefa com: título, matéria (cor), prazo, prioridade, checkbox de conclusão
- Tela de criação/edição de tarefa com todos os campos

### 6.5 Anotações
- Listagem de matérias como cards
- Ao selecionar matéria: lista de notas com data e prévia do conteúdo
- Editor de notas com barra de formatação (negrito, itálico, lista, título, imagem)
- Busca global nas anotações

### 6.6 Estatísticas
- Gráfico de barras: horas estudadas por dia nos últimos 7/30 dias
- Gráfico de pizza: distribuição por matéria
- Card de streak (sequência de dias)
- Tabela planejado vs. realizado na semana
- Taxa de conclusão de tarefas

### 6.7 Configurações
- Edição de perfil
- Gerenciamento de matérias (criar, editar, excluir, reordenar)
- Preferências de notificação
- Tema claro/escuro
- Plano (gratuito/premium)
- Logout

---

## 7. Fluxos Principais

### 7.1 Fluxo de Cadastro e Onboarding

```
Tela Inicial
    └── [Criar conta] ──► Formulário de cadastro (nome, e-mail, senha)
                              └── Confirmação de e-mail
                                    └── Seleção de perfil de estudo
                                          └── Criar primeira matéria
                                                └── Dashboard
```

### 7.2 Fluxo de Planejamento Semanal

```
Dashboard
    └── [Ir para Cronograma]
              └── Visualização semanal
                    └── [+ Nova Sessão]
                              └── Modal: selecionar matéria, data, hora, duração
                                    └── [Salvar]
                                          └── Sessão aparece no calendário
                                                └── Notificação agendada automaticamente
```

### 7.3 Fluxo de Estudo (Dia a Dia)

```
Notificação de lembrete de sessão
    └── Usuário abre o app
          └── Dashboard mostra sessão do dia
                └── [Iniciar sessão]
                      └── Tela de foco (timer, matéria, opção de pausa)
                            └── [Concluir]
                                  └── Tempo registrado nas estatísticas
                                        └── Sessão marcada como concluída no calendário
```

### 7.4 Fluxo de Criação de Nota

```
Aba Anotações
    └── Selecionar matéria
          └── [+ Nova nota]
                └── Editor abre em branco
                      └── Usuário digita, formata, insere imagens
                            └── [Salvar] (automático ou manual)
                                  └── Nota aparece na lista da matéria
```

### 7.5 Fluxo de Acompanhamento de Desempenho

```
Dashboard ──► [Ver estatísticas completas]
    └── Tela de Estatísticas
          ├── Selecionar período (7d / 30d / total)
          ├── Visualizar gráfico de horas por dia
          ├── Visualizar distribuição por matéria
          └── Comparar planejado vs. realizado
```

---

## 8. Modelo de Dados (Entidades Principais)

| Entidade | Atributos principais |
|----------|----------------------|
| **Usuário** | id, nome, email, foto, fuso_horário, plano, streak |
| **Matéria** | id, nome, cor, ícone, usuario_id |
| **Sessão de Estudo** | id, materia_id, data, hora_inicio, hora_fim, status (agendada/concluída) |
| **Tarefa** | id, titulo, descricao, materia_id, prazo, prioridade, status |
| **Meta** | id, titulo, materia_id, prazo, progresso |
| **Nota** | id, titulo, conteudo, materia_id, pasta_id, data_criacao |
| **Pasta** | id, nome, materia_id, pasta_pai_id |
| **Registro de Tempo** | id, sessao_id, duracao_minutos, data |

---

## 9. Integrações Futuras (Roadmap)

- **Google Calendar** — importar/exportar sessões de estudo
- **Notion** — importar notas existentes
- **Spotify / YouTube Music** — playlist de foco integrada
- **Revisão espaçada** — flashcards com algoritmo SM-2
- **IA para sugestão de cronograma** — com base no desempenho histórico

---

## 10. Stack Tecnológica Sugerida

| Camada | Tecnologia sugerida |
|--------|---------------------|
| Frontend Web | React + TypeScript |
| App Mobile | React Native (código compartilhado) |
| Backend | Node.js + Express ou NestJS |
| Banco de dados | PostgreSQL (relacional) + Redis (cache/sessões) |
| Autenticação | Firebase Auth ou Auth0 |
| Armazenamento de arquivos | AWS S3 ou Cloudflare R2 |
| Sincronização offline | WatermelonDB (mobile) |
| Notificações | Firebase Cloud Messaging (FCM) |
| Hospedagem | Vercel (web) + Railway ou Render (API) |

---

*Documento gerado em Abril de 2026 — StudyFlow v1.0*
