/*
Objetivo:
Enviar um texto de um formulário para uma API do n8n e exibir o resultado o código html, css e colocar a animação no fundo da tela do site.

Passos:
1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.
2. Obter o valor digitado pelo usuário no campo de texto.
3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.
5. Receber a resposta da API do n8n (esperando um JSON com o código HTML/CSS do background).
6. Se a resposta for válida, exibir o código HTML/CSS retornado na tela:
  - Mostrar o HTML gerado em uma área de preview.
  - Inserir o CSS retornado dinamicamente na página para aplicar o background.
7. Remover o indicador de carregamento após o recebimento da resposta.
*/

function setLoading(isLoading) {
  const btnSpan = document.getElementById('generate-btn')
  btnSpan.innerHTML = isLoading ? 'Gerando Background...' : 'Gerar Background Mágico'
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form-group')
  const textArea = document.getElementById('description')
  const htmlCode = document.getElementById('html-code')
  const cssCode = document.getElementById('css-code')
  const preview = document.getElementById('preview-card')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const description = textArea.value.trim()

    if (!description) return alert('Por favor, insira uma descrição.')

    setLoading(true)

    try {
      const response = await fetch('https://brunohdorea.app.n8n.cloud/webhook/magik-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      })

      const data = await response.json()
      htmlCode.textContent = data.code || 'Nenhum código HTML retornado.'
      cssCode.textContent = data.style || 'Nenhum código CSS retornado.'

      preview.style.display = 'block'
      preview.innerHTML = data.code || '<p>Nenhum código HTML para exibir.</p>'

      let styleTag = document.getElementById('dynamic-styles')

      if (styleTag) styleTag.remove()

      if (data.style) {
        styleTag = document.createElement('style')
        styleTag.id = 'dynamic-styles'
        styleTag.textContent = data.style
        document.head.appendChild(styleTag)
      }
    } catch (error) {
      console.error('Erro ao gerar o background:', error)
    } finally {
      setLoading(false)
      description.value = ''
    }
  })
})