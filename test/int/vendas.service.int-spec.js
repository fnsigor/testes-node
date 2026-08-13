import conexao from "#db/singleton-connection.js";
import test, { after, describe, mock } from "node:test";
import { criarLivro } from "../factories/livro.factory.js";
import { VendasService } from "#services/vendas.service.js";
import assert from "node:assert";
import { assertMock } from "../utils/mock.assertions.js";
import { criarEditora } from "../factories/editora.factory.js";



//npm run test:int:all


describe('VendasService', () => {
  after(async () => {
    await conexao.destroy()
  })


  describe('registraVenda', () => {

    test('registra uma venda com sucesso e envia email para a editora', async () => {

      //ARRANGE
      const emailGatewayMock = {
        enviarEmail: mock.fn() //Mock
      }
      const estoqueApiGateway = {
        //mock do retorno da função. ate agora so mockamos pra consultar como foi chamada
        //mas as vezes eh necessario mockar o retorno de uma função pra garantir o funcionamento
        //para mocks onde o interesse é o retorno, nao precisa validar os argumentos da chamada:
        // - quando o mock é pra se comunicar, enviar algo pra um sistema externo, ai temos que verificar como a função foi chamada
        // - mas quando estamos substituindo um retorno de serviço externo, nao precisa verificar como a função é chamada
        // - Mocks que substituem respostas de apis e outros serviços externos sao chamados de Stub, nao de mock 
        temEstoque: mock.fn(() => Promise.resolve(true)) //Stub
      }
      const sut = new VendasService(conexao, emailGatewayMock, estoqueApiGateway)
      const editora = await criarEditora({ email: 'editorasupernova@dominio.com' })
      const livro = await criarLivro({ titulo: 'livro integração ', editora_id: editora.id })

      //Act
      const dadosVenda = {
        idlivro: livro.id,
        modoPagamento: 'CARTAO_CREDITO',
        valor: 100
      }
      const venda = await sut.registrarVenda(dadosVenda)

      //assert
      assert.strictEqual(venda.idlivro, livro.id)
      assert.strictEqual(venda.valor, 105)
      assert.strictEqual(venda.modoPagamento, 'CARTAO_CREDITO')
      // assert.strictEqual(emailGatewayMock.enviarEmail.mock.calls.length, 1)
      // assert.deepStrictEqual(emailGatewayMock.enviarEmail.mock.calls[0].arguments[0], {
      //   remetente: 'no-reply@dominio.com',
      //   assunto: 'Venda registrada',
      //   destinatario: editora.email,
      //   mensagem: `Uma nova venda foi registrada no valor de R$ ${venda.valor}`
      // })
      assertMock(emailGatewayMock.enviarEmail).wasCalledWith({
        remetente: 'no-reply@dominio.com',
        assunto: 'Venda registrada',
        destinatario: editora.email,
        mensagem: `Uma nova venda foi registrada no valor de R$ 105`
      })
    })

    test('lança erro quando livro nao tem estoque disponivel', async () => {

      //ARRANGE
      const emailGatewayMock = {
        enviarEmail: mock.fn() //Mock
      }
      const estoqueApiGateway = {
        temEstoque: mock.fn(() => Promise.resolve(false)) //Stub
      }
      const sut = new VendasService(conexao, emailGatewayMock, estoqueApiGateway)
      const livro = await criarLivro({ titulo: 'livro integração ' })

      //Act
      const dadosVenda = {
        idlivro: livro.id,
        modoPagamento: 'CARTAO_CREDITO',
        valor: 100
      }
      const resposta = () => sut.registrarVenda(dadosVenda)

      //assert
      assert.rejects(resposta, {
        message: 'Livro sem estoque disponível'
      })
    })
  })
})