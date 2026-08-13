import { LivrosController } from "#controllers/livros.controller.js";
import test, { describe, before, after, mock } from "node:test";
import conexao from "#db/singleton-connection.js";
import { criarLivro } from "../factories/livro.factory.js";
import { limparBanco } from "#commands/limpar-banco.command.js";
import assert from "node:assert";
import { assertMock } from "../utils/mock.assertions.js";



describe('LivrosController', () => {
  const sut = new LivrosController(conexao)

  before(async () => {
    await limparBanco()
  })

  after(async () => {
    await conexao.destroy()
  })

  describe('listarLivros', () => {
    test('Retorna uma lista de livros', async () => {
      //arrange

      //esses testes na controller foram criados pra testar a integração com o bnco
      //OBS - precisar saber esses detalhes de implementação pra fazer o teste da controler indica um problema de design
      //um dos pontos que da problema: implementação muda minimamente e os testes quebram
      const livro = await criarLivro()
      const reqDummy = {} //dummy é um tipo de test double que precisa ser criado por ser uma dependencia, mas nao é usado
      const resSpy = {
        status: mock.fn(() => resSpy),
        json: mock.fn(() => resSpy),
        send: mock.fn(() => resSpy),
      }

      //act
      await sut.listarLivros(reqDummy, resSpy)


      //assert
      const response = resSpy.json.mock.calls[0].arguments[0]
      assert.deepStrictEqual(response, [livro])

      //função criada pra substituir as 2 linhas acima
      assertMock(resSpy.status).wasCalledWith(200)//OBS - se o usuario mudar a função de json pra send no controller, mesmo que o comportamento nao mude no e2e, esse teste falha, por conta desse acoplamento com implementação q precisa saber os metodos do controller

    })
  })

  //npm run test:int:all


  // describe('buscarLivroPorId', () => { })
  // describe('cadastrarLivro', () => { })
})