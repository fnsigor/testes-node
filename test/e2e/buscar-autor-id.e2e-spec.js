import { describe, test, after } from "node:test";
import request from "supertest";
import conexao from "#db/singleton-connection.js";

//pacote nativo do node pra fazer assertions
import assert from "node:assert";
import { criarAppTeste } from "../utils/create-test-app.js";

describe('buscar autor', () => {


  const app = criarAppTeste()


  //fechar conexao com o db dps dos testes pra evitra memory leak
  after(async () => {
    await conexao.destroy()
  })


  //O todo é uma maneira de listar testes q precisam ser feitos. tbm pra auxiliar agentes de ia a escrever testes q faltam
  //test.todo('Retorna os dados de um autor existente (200)')


  test('Retorna os dados de um autor existente (200)', async () => {


    const autor = {
      nome: 'testevaldo novo',
      nacionalidade: 'gaucho'
    }

    //primeiro temq  criar o autor
    const respostaCadastro = await request(app)
      .post('/autores')
      .send(autor)
      .expect(201)


    const idAutor = respostaCadastro.body.content.id;

    await request(app).get(`/autores/${idAutor}`)
      .expect(200)
      .expect(response => {
        const dadosResponse = response.body
        assert.strictEqual(dadosResponse.id, idAutor)
        assert.strictEqual(dadosResponse.nome, autor.nome)
        assert.strictEqual(dadosResponse.nacionalidade, autor.nacionalidade)
      })
  })




  test('Retorna um erro quando o autor não existe (404)', async () => {


    //proteção contra regressoes
    //regressão é um bug no sistema. o teste precisa dar uma alta proteção contra bugs


    //se verifica apenas o status da request os testes vao passar, mas isso abre brecha pra bugs:
    //se a rota nao existir, vai dar sucesso (por conta do express que trata rota inexiste com 404)

    //testar um codigo de erro é eficiente ´q testa o conteudo da response com algo mais estatico


    await request(app).get('/autores/854848')
      .expect(404)
      .expect(response => {
        const codigoDeErro = response.body.type
        assert.strictEqual(codigoDeErro, "NOT_FOUND")
      })
  })

})