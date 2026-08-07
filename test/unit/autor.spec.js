import test, { describe } from "node:test";
import Autor from "#models/autor.js";
import assert from "node:assert";

describe('autor', () => {
  describe('constructor', () => {
    //test.todo('cria instancia de autor com todos os campos')
    test('cria instancia de autor com todos os campos', () => {


      //Arrange - preparação dos dados de testes
      const dadoAutor = {
        id: 3,
        nome: 'Hammlet',
        nacionalidade: 'Britanico',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      }


      //Act - ação a ser executada que é o foco do que vai ser testado
      const autor = new Autor(dadoAutor)


      //Assert - que vai ser verificado (nesse caso, se os atributos do autor instanciado sao os mesmos passados pro construtor) 
      assert.strictEqual(autor.id, dadoAutor.id)
      assert.strictEqual(autor.nome, dadoAutor.nome)
      assert.strictEqual(autor.nacionalidade, dadoAutor.nacionalidade)
      assert.strictEqual(autor.created_at, dadoAutor.created_at)
      assert.strictEqual(autor.updated_at, dadoAutor.updated_at)


      /*
      esta sendo comparado propriedade a propriedade pq o deepStrictEqual lanciara erro:
       - deepStrictEqual tambem compara prototypes
        - dadoAutor tem o prototype de um objeto JS e autor tem como prototype a classe Autor
      assert.deepStrictEqual(dadoAutor, autor)
      */

    })
    test('cria instancia de autor com os campos opcionais faltando', () => {

      //arrange 
      const dadoAutor = {
        id: 19,
        nome: 'Sheakspare',
        nacionalidade: 'Irlandes',
      }

      //act
      const autor = new Autor(dadoAutor)

      //assert
      assert.strictEqual(autor.id, dadoAutor.id)
      assert.strictEqual(autor.nome, dadoAutor.nome)
      assert.strictEqual(autor.nacionalidade, dadoAutor.nacionalidade)
      assert(typeof autor.created_at === 'string')
      assert(typeof autor.updated_at === 'string')

    })
  })

  //na escola de londres, o teste unitario dessa função nao seria feito, pq a função envolve mais de uma unidade "banco de dados"
  //mas na escola classica, como o conjunto da função + o db compoem o comportamento, seria testado
  describe('pegarAutores', () => {
    test.todo('retorna uma lista de autores', async () => {
      //arrange
      const autoresEsperados = [
        {
          id: 8,
          nome: 'luffy',
          nacionalidade: 'brasileiro',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 19,
          nome: 'lelouch',
          nacionalidade: 'britanico',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      //um problema da escola de teste de londres é que mesmo que tenha uma segurança maior, deixa a implementação das dependencias muito aclopadas
      //aqui precisa saber detalhes de implementação do banco. se algo mudar nessa implementação da função pegarAutores (ex:: adicionar um orderBy), o teste quebra, mesmo que o resultado nao mude
      const mockedDb = {
        select: () => {
          return {
            from: () => {
              return Promise.resolve(autoresEsperados)
            }
          }
        }
      }
      Autor.configurarDB(mockedDb)

      //act
      const autoresDoBanco = await Autor.pegarAutores()

      //assert
      assert.deepStrictEqual(autoresDoBanco, autoresEsperados)
    })
  })

  describe('pegarPeloId', async () => {

    //arrange 
    const autorSelecionado = {
      id: 19,
      nome: 'lelouch',
      nacionalidade: 'britanico',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const db = {
      select: () => {
        return {
          from: () => {
            return {
              where: () => Promise.resolve([autorSelecionado])
            }
          }
        }
      }
    }

    Autor.configurarDB(db)



    //act
    const autorNoBanco = await Autor.pegarPeloId()


    assert.deepStrictEqual(autorNoBanco, autorSelecionado)



  })
})