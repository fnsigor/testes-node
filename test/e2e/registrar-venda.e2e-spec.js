import { describe, test, after, mock } from "node:test";
import request from "supertest";
import criarApp from "#src/app.js";
import conexao from "#db/singleton-connection.js";

//pacote nativo do node pra fazer assertions
import assert from "node:assert";
import { criarLivro } from "../factories/livro.factory.js";

//npm run test:e2e ./**/registrar-venda.e2e-spec.js

describe('registrar venda', () => {



  const emailGatewayMock = {
    enviarEmail: mock.fn()
  }
  const estoqueGatewayMock = {
    temEstoque: mock.fn(() => Promise.resolve(true)),
  }

  const app = criarApp({
    emailGateway: emailGatewayMock,
    estoqueGateway: estoqueGatewayMock
  })



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

