import { describe, test, after, beforeEach } from "node:test";
import request from "supertest";
import conexao from "#db/singleton-connection.js";
import { criarLivro } from "../factories/livro.factory.js";
import assert from "node:assert";
import { criarAppTeste } from "../utils/create-test-app.js";


describe('listar livros', () => {

  const app = criarAppTeste()

  after(async () => {
    await conexao.destroy()
  })

  beforeEach(async () => {
    await conexao('livros').delete()
  })

  test('Retorna uma lista com os dados dos livros qaundo existe ao menos um livro cadastrado(200)', async () => {

    //primerio cria os dados pra depois fazer o teste
    const senhorAneis = await criarLivro({ titulo: "senhor dos aneis" }) //aq to usando uma função que cria dado direto no banco so pra agilizar. num e2e de vdd, usa a request da propria api
    const HP = await criarLivro({ titulo: "harry poter" })

    // await request(app).get('/livros').expect(200).expect([livro1, livro2]) - se validar assim, vai dar erro nas datas de created_at retornadas por criarLivro e as datas retornadas pela api. pq a função retorna data no tipo date, enquanto a api retorna o msm valor mas como string
    await request(app).get('/livros').expect(200).expect(res => {
      assert.strictEqual(res.body.length, 2)

      const livro1 = res.body[0]
      const livro2 = res.body[1]

      assert.strictEqual(livro1.titulo, senhorAneis.titulo)
      assert.strictEqual(livro1.id, senhorAneis.id)

      assert.strictEqual(livro2.titulo, HP.titulo)
      assert.strictEqual(livro2.id, HP.id)
    })

  })


  test('Retorna uma lista vazia quando na há livros cadastrados(200)', async () => {
    await request(app).get('/livros').expect(200).expect([]) //assim o supertest sabe que ele vai ter que comparar com response.body. todo:pesquisar o porque
  })


  test.todo('Retorna um erro quando o usuario nao ta autenticado (403)')
})

//npm run test:e2e ./**/listar-livros.e2e-spec.js