import { LivrosService } from "#src/services/livros.service.js";
import test, { after, before, describe } from "node:test";
import conexao from "#db/singleton-connection.js";
import { limparBanco } from "#commands/limpar-banco.command.js";
import assert from "node:assert";
import { criarLivro } from "../factories/livro.factory.js";


//npm run test:int /**/livros.service.int-spec.js

describe('LivrosService', () => {

  const sut = new LivrosService(conexao)

  before(async () => {
    await limparBanco()
  })


  after(async () => {
    await conexao.destroy()
  })


  describe('listarLivros', () => {
    test('retorna uma lista vazia quando nao tem livro cadastrado', async () => {
      const resultado = await sut.listarLivros()
      assert.deepStrictEqual(resultado, [])

    })
    test('retorna uma lista de livros', async () => {

      //arrange
      const livro1 = await criarLivro({ titulo: 'livro 1' })
      const livro2 = await criarLivro({ titulo: 'livro 2' })

      //act
      const response = await sut.listarLivros()

      //assert
      assert.deepStrictEqual(response, [livro1, livro2])

    })
  })

  describe('buscarLivrosPorId', async () => {
    test('retorna undefined quando o livro nao existe', async () => {

      const randomId = 55449

      const resultado = await sut.pegarPeloId(randomId)

      assert.deepEqual(resultado, undefined)
    })

    test('retorna os dados do livro quando ele existe', async () => {
      //arrange
      const livro = await criarLivro({ titulo: 'como fazer testes efetivos', paginas: 380 })

      const result = await sut.pegarPeloId(livro.id)

      assert.deepStrictEqual(result, livro)
    })
  })
})