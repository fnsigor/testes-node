import { describe, test, after } from "node:test";
import request from "supertest";
import app from "#src/app.js";
import conexao from "#db/singleton-connection.js";

//pacote nativo do node pra fazer assertions
import assert from "node:assert";
import { criarLivro } from "../factories/livro.factory.js";

describe('registrar venda', () => {


  //fechar conexao com o db dps dos testes pra evitra memory leak
  after(async () => {
    await conexao.destroy()
  })

  test('registra uma venda no boleto', async () => {
    //arrange
    const livro = await criarLivro({ titulo: 'livro teste' })

    //act
    const response = await request(app).post('/vendas').send({
      idlivro: livro.id,
      modoPagamento: 'BOLETO',
      valor: 100
    }).expect(201).then(res => res.body.content)

    assert.strictEqual(response.idlivro, livro.id)
    assert.strictEqual(response.modoPagamento, 'BOLETO')
    assert.strictEqual(response.valor, 100)
  })
})

