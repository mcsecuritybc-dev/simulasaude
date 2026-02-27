# Plataforma de Simulação em Saúde
Criador: **DR. MOACIR CARRION – FISIOTERAPEUTA**

## Estrutura
plataforma/
- index.html
- ecg.html
- assets/
  - css/styles.css
  - js/data.js
  - js/app.js
- README.md

## Testar no computador (antes de publicar)
1) Abra a pasta do projeto  
2) Clique duas vezes em `index.html`  
3) Use Chrome para melhor compatibilidade

## Publicar no GitHub Pages
1) Crie um repositório (ex.: `simulacao-saude`)
2) **Upload** dos arquivos:
   - `index.html`
   - `ecg.html`
   - pasta `assets/` inteira
   - `README.md`
3) **Settings → Pages**
   - Source: Deploy from a branch
   - Branch: main / (root)
4) Salve e use o link do Pages

## QR Code para os alunos
1) Abra o link do GitHub Pages
2) Menu **QR Code de Acesso**
3) Clique **Gerar / Atualizar QR Code**
4) Alunos escaneiam e entram pelo celular

## Editar conteúdo (perguntas/justificativas)
- Quizzes: `assets/js/data.js` → `BANKS` (campo `explain` é a justificativa)
- Casos clínicos: `assets/js/data.js` → `CASES`
- Simulações: `assets/js/data.js` → `SIMS`
- Jogos: `assets/js/data.js` → `MEMORY_PAIRS`, `HANGMAN_WORDS`, `WORDSEARCH_WORDS`
