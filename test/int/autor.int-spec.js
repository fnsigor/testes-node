import test, { before, after, describe } from "node:test";
import Autor from "#models/autor.js";
import assert from "node:assert";
import conexao from "#db/singleton-connection.js";
import { limparBanco } from "#commands/limpar-banco.command.js";

describe('autor', () => {

  before(async () => {
    Autor.configurarDB(conexao)
    await limparBanco()
  })

  after(async () => {
    await conexao.destroy()
  })
  //npm run test:int:all

  describe('pegarAutores', async () => {
    test('retorna uma lista de autores', async () => {
      //arrange
      const autoresEsperados = await conexao('autores').insert([
        {
          nome: 'luffy',
          nacionalidade: 'brasileiro',

        },
        {
          nome: 'lelouch',
          nacionalidade: 'britanico',
        },
      ]).returning('*')



      //act
      const autoresDoBanco = await Autor.pegarAutores()

      //assert
      assert.deepStrictEqual(autoresDoBanco, autoresEsperados)
    })
  })

  describe('criar', async () => {

    test('cria um novo autor no banco de dados', async () => {
      //arrange 
      const autor = new Autor({
        nome: 'George R. R. Martin',
        nacionalidade: 'Americana'
      })

      const autorCriado = await autor.criar()

      assert.strictEqual(autorCriado.nome, autor.nome)
      assert.strictEqual(autorCriado.nacionalidade, autor.nacionalidade)
      assert(typeof autorCriado.id === 'number')

      const autorNoBanco = await conexao('autores').where({ id: autorCriado.id }).first()

      assert.deepStrictEqual(autorCriado, autorNoBanco)
    })




  })
})