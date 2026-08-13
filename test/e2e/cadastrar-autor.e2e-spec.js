import { describe, test, after } from "node:test";
import request from "supertest";
import conexao from "#db/singleton-connection.js";
import { criarAppTeste } from "../utils/create-test-app.js";

//pacote nativo do node pra fazer assertions
import assert from "node:assert";

describe('cadastrar autor', () => {

  const app = criarAppTeste()

  //fechar conexao com o db dps dos testes pra evitra memory leak
  after(async () => {
    await conexao.destroy()
  })

  test('Retorna os dados do autor cadastrado quando os dados são válidos (201)', async () => {

    const autor = {
      nome: 'testevaldo',
      nacionalidade: 'gaucho'
    }

    //enviar request pra POST autores
    const resposta = await request(app).post('/autores').send(autor)
      .expect(201) //verificar se status code é 201
      .expect(response => {
        const dadosResponse = response.body.content
        assert.strictEqual(typeof dadosResponse.id, "number")
        assert.strictEqual(dadosResponse.nome, autor.nome)
        assert.strictEqual(dadosResponse.nacionalidade, autor.nacionalidade)
      }).then(res => res.body.content)

    //verificar se os dados da resposta estão corretos
    const autorNoBanco = await conexao('autores').where({ id: resposta.id }).first()

    assert.strictEqual(autorNoBanco.nome, autor.nome)
    assert.strictEqual(autorNoBanco.nacionalidade, autor.nacionalidade)
  })


  test('Retorna um erro ao tentar cadastrar um autor com dados inválidos (400) ', async () => {

    const autor = {
      nome: '',
      nacionalidade: ''
    }

    //enviar request pra POST autores
    await request(app).post('/autores').send(autor)
      .expect(400)
      .expect(response => {
        //const mensagem = response.body.message
        //assert.strictEqual(codigoDeErro, ""Dados inválidos para cadastro de autor."")

        //ao inves de depender de mensagem de ero que é volatol,
        //é interessante ter um dado mais estatico pra determinar o sucesso ou nao do teste
        //esse tipo de dado tbm pode ajudar o client a saber o que fazer
        const codigoDeErro = response.body.type
        assert.strictEqual(codigoDeErro, "INVALID_DATA")

        //resistencia a refatoração:
        //é um atributo de testes automatizados que diz o quanto o teste continua resistente memso apos mudar o detalhe de implementação
      })
  })
})