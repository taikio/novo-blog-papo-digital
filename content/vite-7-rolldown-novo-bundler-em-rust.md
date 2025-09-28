---
title: Vite 7 e Rolldown - Como o novo bundler acelera builds em até 16x
lowercaseTitle: vite 7 e rolldown - como o novo bundler acelera builds em até 16x
description: O ecossistema JavaScript está prestes a viver uma das maiores transformações dos últimos anos. Com o lançamento do Vite 7 e a introdução do Rolldown - um bundler escrito em Rust - estamos testemunhando uma mudança de paradigma na forma como fazemos build de aplicações web.
cover: cover-vite-7-rolldown.png
coverAlt: Vite 7 e Rolldown
publishDate: 2025-09-28T12:30:00.003Z
tag: Build Tools
---

O ecossistema JavaScript está prestes a viver uma das maiores transformações dos últimos anos. Com o lançamento do Vite 7 e a introdução do Rolldown - um bundler escrito em Rust - estamos testemunhando uma mudança de paradigma na forma como fazemos build de aplicações web.

Se você já sofreu com builds lentos em projetos grandes, prepare-se: os números que vou compartilhar vão fazer você querer migrar hoje mesmo.

# O que é o Rolldown e por que ele importa?

O Rolldown não é apenas mais um bundler. É uma reimplementação completa do conceito de bundling, escrita do zero em Rust pela equipe da VoidZero em parceria com o time do Vite.

Enquanto o Vite tradicionalmente usa o esbuild para o dev server e o Rollup para production builds, o Rolldown vem para unificar tudo em uma única ferramenta, mantendo total compatibilidade com a API do Rollup e os plugins existentes do Vite.

O mais impressionante? Ele é de 10 a 30 vezes mais rápido que o Rollup e está no mesmo nível de performance do esbuild, mas com recursos adicionais que o esbuild não oferece, como controle avançado de chunks e Module Federation nativo.

# Números que impressionam: Performance real em produção

Sabe aquela sensação de esperar minutos para um build terminar? Com o Rolldown, isso pode virar coisa do passado. Veja alguns resultados reais de empresas que já testaram:

- **GitLab**: Build time reduzido de 2.5 minutos para 40 segundos (3.75x mais rápido) e uso de memória cortado em 100x
- **Excalidraw**: De 22.9 segundos para 1.4 segundos (16x mais rápido)
- **Appwrite**: De mais de 12 minutos para 3 minutos, com uso de memória 4x menor

Esses não são benchmarks sintéticos - são aplicações reais, em produção, com milhares de módulos e dependências complexas.

# Como testar o Rolldown no seu projeto hoje

A melhor parte é que você não precisa esperar o Vite 8 para experimentar o Rolldown. O pacote `rolldown-vite` já está disponível como um drop-in replacement do Vite padrão.

**Instalação rápida**

Para projetos Vite existentes, simplesmente substitua o pacote vite pelo rolldown-vite no seu `package.json`:

```json
{
  "dependencies": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

Se você usa um meta-framework como Nuxt, ou o VitePress, use overrides:

Para npm:

```json
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

Para pnpm:

```json
{
  "pnpm": {
    "overrides": {
      "vite": "npm:rolldown-vite@latest"
    }
  }
}
```

Para yarn:

```json
{
  "resolutions": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

E pronto! Seu projeto já está rodando com Rolldown. Você pode ver algumas mensagens de warning sobre opções ainda não suportadas, mas a grande maioria dos projetos funciona sem modificações.

# O que muda por baixo dos panos

**Bye bye, esbuild (ou quase)**

No rolldown-vite, o esbuild não é mais uma dependência obrigatória. Todas as transformações internas e minificação são feitas pelo Oxc (o conjunto de ferramentas Rust que alimenta o Rolldown).

Isso significa:

- Uma única camada de ferramentas (menos complexidade)
- Melhor performance por não haver mudança de contexto entre diferentes tools
- Menor uso de memória no geral

O esbuild só será necessário se algum plugin específico ainda depender dele e não tiver suporte ao Oxc.

**Compatibilidade com plugins**

A boa notícia é que a maioria dos plugins Vite e Rollup funciona sem modificações. O Rolldown implementa a mesma API de plugins do Rollup, garantindo compatibilidade com o ecossistema existente.

Se você é autor de plugins, vale testar com o rolldown-vite e fazer ajustes se necessário. A tendência é que os plugins migrem para usar as transformações do Oxc quando detectarem o Rolldown, melhorando ainda mais a performance.

# Environment API: O futuro dos builds multi-ambiente

O Vite 7 também introduz melhorias na Environment API (ainda experimental), que permite coordenar builds para diferentes ambientes (browser, SSR, edge workers) de forma mais eficiente.

Com o novo hook `buildApp`, plugins podem coordenar melhor a construção de múltiplos ambientes, abrindo caminho para arquiteturas mais complexas e otimizadas.

# O roadmap: Três fases para a revolução

A equipe do Vite planejou uma transição gradual em três fases:

- **Fase 1 (atual)**: rolldown-vite disponível como pacote separado para early adopters
- **Fase 2**: Integração do Rolldown no Vite principal como opção opt-in
- **Fase 3**: Rolldown se torna o bundler padrão do Vite

Cada fase deve durar alguns meses, dependendo do feedback da comunidade e da estabilidade alcançada.

# Pontos de atenção na migração

Embora a migração seja geralmente tranquila, alguns pontos merecem atenção:

1. **Node.js 20+**: O Vite 7 requer Node.js 20.19+ ou 22.12+. Se você ainda está no Node 18, é hora de atualizar.

2. **Browser targeting**: O target padrão mudou para browsers mais modernos. Isso pode afetar a compatibilidade se você precisa suportar browsers muito antigos.

3. **Opções avançadas**: Algumas opções muito específicas do Rollup podem não estar implementadas ainda no Rolldown. A maioria tem alternativas melhores.

4. **Manual chunks**: O Rolldown marca `manualChunks` como deprecated, oferecendo em vez disso o `advancedChunks`, mais poderoso e similar ao splitChunks do webpack.

# Vale a pena migrar agora?

Se você tem um projeto muito grande e quer reduzir o tempo de build, a resposta é: **sim**.

Os ganhos de performance são reais e imediatos. Mesmo projetos pequenos podem se beneficiar da redução no uso de memória e da maior velocidade de build.

Para projetos enterprise com centenas de milhares de linhas de código, a diferença é ainda mais dramática - estamos falando de builds que levavam minutos sendo concluídos em segundos.

Outro ponto que vale ressaltar é que em breve este será o bundler padrão, então é interessante já ir planejando esta adequação.

# Conclusão

O Rolldown não é apenas uma evolução incremental - é uma revolução na forma como pensamos sobre build tools. A combinação de Rust + compatibilidade com o ecossistema existente é o melhor dos dois mundos.

Se você estava esperando um motivo para atualizar seu setup de build, este é o momento. O futuro do desenvolvimento web está sendo escrito em Rust, e o Rolldown está liderando essa transformação.

E aí, pronto para ver seus builds voarem? 🚀

Espero que este post tenha sido útil. Até a próxima! 😉
