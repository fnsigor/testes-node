import { describe, test, after, beforeEach } from "node:test";
import request from "supertest";
import conexao from "#db/singleton-connection.js";
import assert from "node:assert";
import { criarLivro } from "../factories/livro.factory.js";
import { criarAppTeste } from "../utils/create-test-app.js";

describe('buscar livro', () => {

  const app = criarAppTeste()


  after(async () => {
    await conexao.destroy()
  })

  beforeEach(async () => {
    await conexao('livros').delete()
  })

  //npm run test:e2e ./**/buscar-livro-id.e2e-spec.js




  test.todo('Retorna os dados de um livro existente (200)', async () => {


    //arrange
    const livro = await criarLivro()

    await request(app)
      .get(`/livros/${livro.id}`)
      .expect(200) //assert
      .expect(res => {
        //assert
        const livroResponse = res.body
        assert.strictEqual(livroResponse.id, livro.id)
        assert.strictEqual(livroResponse.titulo, livro.titulo)
      })



  })




  test('Retorna um erro quando o livro não existe (404)', async () => {


    await request(app).get('/livros/854849998')
      .expect(404)
      .expect(response => {
        const codigoDeErro = response.body.type
        assert.strictEqual(codigoDeErro, "NOT_FOUND")
      })
  })

})