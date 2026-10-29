# Capturas historicas do SeCuida / BemTeVi

## Origem e uso no relatorio

Estas oito imagens foram reproduzidas localmente em 21/10/2026 a partir dos commits abaixo. Nao sao capturas feitas em maio, junho ou julho. As datas nos nomes dos arquivos sao as datas de autoria registradas no Git, com fuso -03:00, e nao as datas das capturas ou uma comprovacao independente da data de publicacao.

O nome SeCuida foi preservado conforme cada revisao. A mudanca para BemTeVi consta no commit `739fbe7`, de 19/07/2026. Nao houve alteracao da interface ou do codigo para atualizar a marca nas imagens antigas.

As capturas mostram funcionalidades presentes no codigo selecionado; nao comprovam, por si, sua apresentacao em reuniao, disponibilizacao publica ou uso por usuarios naquele dia.

## Commits selecionados

| Entrega | Data do commit | Hash completo | Assunto |
| --- | --- | --- | --- |
| a. Base do aplicativo, 12 a 15/05 | 2026-05-15 | `666158c63e029ef97107b7ca3587fd5a83f33f60` | feat: add project assets including hero image for support |
| b. Motor de fluxos, 16 a 17/05 | 2026-05-17 | `b522110cb2cae9465248b85c94f3f67e269652f1` | fix: polish orientation intro copy and privacy note |
| c. PWA, 18 a 21/05 | 2026-05-19 | `468999a0476107c9ff8058f7a714d152f72813d1` | fix: correct Portuguese accent in manifest description, add lang field, remove duplicate includeAssets |
| d. Painel e editores, 22 a 24/05 | 2026-05-23 | `77951e130b60a534a71e3d50bc217105ebc4da68` | fix: pass VITE_ENABLE_DEV_DASHBOARD to build step in deploy workflow |
| e. Grupos e redirecionamentos, 24/06 | 2026-06-24 | `d8c181e1870f716d9dbd2669f03b256bec9a530b` | fix: use public path for respiracao images and update tests for new material |
| f. Ramificacoes e contatos, 29/06 a 15/07 | 2026-07-12 | `1713548c0ad5f3be63d534e923d8643ce72337c5` | fix: suppress ambiguous contact patch matches |

Foram escolhidos os estados finais das funcionalidades no respectivo dia, nao necessariamente commits cujo assunto descreva toda a entrega acumulada. A revisao de 12/07 inclui a edicao de redirecionamentos implementada em `0fd0691` (29/06) e a consolidacao do editor de contatos de 12/07. Ela precede a autenticacao e a publicacao em banco introduzidas em 15/07, dispensando credenciais e acesso a dados remotos.

## Inventario das imagens

Todas as imagens usam somente a interface local e conteudo de demonstracao. Nenhum cadastro, conversa real, email, chave ou credencial foi utilizado.

| Arquivo | Commit | Data do commit | Dimensoes | O que mostra | Dado de demonstracao |
| --- | --- | --- | --- | --- | --- |
| [2026-05-15_666158c_tela-inicial.png](2026-05-15_666158c_tela-inicial.png) | `666158c` | 2026-05-15 | 390 x 844 | Tela inicial, identidade SeCuida, aviso de anonimato, acoes de acolhimento/orientacao e navegacao inferior. | Sim: conteudo estatico do prototipo; sem usuario real. |
| [2026-05-17_b522110_motor-fluxo-guiado.png](2026-05-17_b522110_motor-fluxo-guiado.png) | `b522110` | 2026-05-17 | 390 x 844 | Chatbot em execucao, mensagens do fluxo e opcoes de resposta. | Sim: a frase inicial foi escolhida pelo operador apenas para simular uma conversa; nao e relato pessoal. |
| [2026-05-19_468999a_pwa-inicio-offline.png](2026-05-19_468999a_pwa-inicio-offline.png) | `468999a` | 2026-05-19 | 390 x 844 | Tela inicial do build PWA, recarregada com o servidor local desligado. | Sim: build local e conteudo estatico; sem usuario real. |
| [2026-05-23_77951e1_painel-editor-fluxos.png](2026-05-23_77951e1_painel-editor-fluxos.png) | `77951e1` | 2026-05-23 | 1440 x 900 | Painel de desenvolvimento, abas Fluxos/Materiais/Exportar, lista de fluxos, titulo, uso e frases de entrada editaveis. | Sim: fluxos de exemplo incluidos no repositorio; sem edicoes publicadas. |
| [2026-06-24_d8c181e_gestao-grupos-educacionais.png](2026-06-24_d8c181e_gestao-grupos-educacionais.png) | `d8c181e` | 2026-06-24 | 1440 x 900 | Aba Materiais com gerenciamento de grupos expandido, grupo padrao, campos editaveis e controles de ordenacao/remocao. | Sim: grupos de exemplo do repositorio; nenhum dado pessoal. |
| [2026-06-24_d8c181e_mapa-redirecionamentos.png](2026-06-24_d8c181e_mapa-redirecionamentos.png) | `d8c181e` | 2026-06-24 | 1440 x 900 | Mapa visual e inspetor de uma etapa, com os fluxos de destino de cada escolha. | Sim: fluxo de exemplo; nenhum percurso ou resposta de usuario real. |
| [2026-07-12_1713548_editor-redirecionamentos-ramificacao.png](2026-07-12_1713548_editor-redirecionamentos-ramificacao.png) | `1713548` | 2026-07-12 | 1440 x 900 | Editor de ramificacao por pontuacao, chave, faixas, limites, destino do resultado e destino de pagina apos o resultado. | Sim: configuracao incluida no prototipo; nenhum questionario respondido ou resultado pessoal. |
| [2026-07-12_1713548_editor-contatos-demonstracao.png](2026-07-12_1713548_editor-contatos-demonstracao.png) | `1713548` | 2026-07-12 | 1440 x 900 | Aba Contatos, lista selecionavel e formulario de edicao de um servico ficticio. | Sim: os tres servicos foram substituidos em rascunhos locais por nomes, cidade, endereco e telefone ficticios, identificados como exemplo/demonstracao. |

## Condicoes e limites

- Aplicativo em viewport de celular de 390 x 844; painel em viewport desktop de 1440 x 900. Os PNGs foram conferidos nessas mesmas dimensoes.
- As capturas sao do viewport, nao da pagina inteira. Alguns paineis foram rolados para destacar os campos relevantes.
- O navegador fornece a captura em JPEG. Os arquivos foram convertidos para PNG sem redimensionamento, montagem, retoque ou alteracao de conteudo. Essa conversao nao transforma a captura original em uma fonte sem perdas.
- Dependencias instaladas com `pnpm install --frozen-lockfile`; nenhum lockfile foi alterado. Os servidores ficaram restritos a `127.0.0.1`.
- Painel habilitado somente nos processos locais com `VITE_ENABLE_DEV_DASHBOARD=true`; nenhum arquivo de ambiente foi criado e nao houve acesso a banco ou login.
- PWA: `pnpm build` concluiu com manifesto `display: standalone`, icones de 192/512 pixels, `registerSW.js`, `sw.js` e precache de 14 entradas. O build foi servido na porta 4174; apos encerrar o servidor, a pagina foi recarregada com sucesso pelo cache. A imagem evidencia a tela em funcionamento nessa condicao, mas nao mostra nem comprova instalacao em um celular ou janela instalada do sistema operacional.
- O aviso de versao de teste foi verificado na revisao `1713548`: apos editar o titulo de um material em rascunho e abrir Estudos, apareceu o aviso de que o conteudo nao esta salvo no site oficial. Esse aviso e condicional a previa educacional local, nao um banner global permanente. Para respeitar o limite de oito imagens, ele nao tem captura separada neste conjunto.
- A imagem de maio privilegia o editor de fluxos; a gestao educacional aparece no painel de junho. As imagens sao uma selecao representativa, nao cobertura visual de todas as telas e subfuncionalidades.
- Somente rascunhos do navegador foram usados para os contatos ficticios e o teste do aviso. Nenhuma mudanca de demonstracao foi aplicada aos arquivos versionados ou publicada.

## Restauracao do ambiente

- Branch original e final: `main`.
- HEAD original e final: `739fbe74e53d2d6280fa582be58344a3cc18bde0`.
- Estado inicial: arvore de trabalho limpa. Nao foi necessario criar nem aplicar stash.
- Os checkouts historicos foram feitos em HEAD destacado e revertidos para a branch original.
- Todos os servidores iniciados para esta tarefa foram encerrados; portas 4173 a 4177 sem processos em escuta ao final.
- As abas temporarias foram fechadas e o override de viewport foi removido.
- As pastas geradas `node_modules/` e `dist/`, ausentes no inicio, permanecem ignoradas pelo Git: a limpeza opcional foi bloqueada pela politica da ferramenta. `node_modules/` corresponde a uma revisao historica e `dist/` ao build PWA de 19/05; nao devem ser tratados como build/dependencias atuais de `main`. O cache normal do gerenciador de pacotes tambem pode permanecer fora do projeto.
- Estado final do Git: somente `prints-bemtevi-mai-jul/` como pasta nova nao rastreada; nenhum arquivo versionado modificado.
- Nao foram feitos commit, push, merge ou reset.
