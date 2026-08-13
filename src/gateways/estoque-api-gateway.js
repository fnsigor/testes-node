export class EstoqueApiGateway {
  async temEstoque(idLivro) {
    //simula chama a serviço externo
    const apiEndoint = `https://livraria.com/api/livros/${idLivro}/estoque`;


    const response = await fetch(apiEndoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const sucesso = response.ok

    return sucesso
  }
}