import { describe, test, after, beforeEach } from "node:test";
import request from "supertest";
import app from "#src/app.js";
import conexao from "#db/singleton-connection.js";


describe('listar autores', () => {
  after(async () => {
    await conexao.destroy()
  })

  beforeEach(async () => {
    await conexao('autores').delete()

  })

  test.todo('Retorna uma lista com os dados dos autores qaundo existe ao menos um autor cadastrado(200)', async () => {

    //primerio cria os dados pra depois fazer o teste
    const juvenal = await request(app).post('/autores').send({
      nome: 'Juvenal Cardoso',
      nacionalidade: 'Brasileiro'
    })
      .expect(201)
      .then(res => res.body.content)


    const luciano = await request(app).post('/autores').send({
      nome: 'Luciano Bezerra',
      nacionalidade: 'Brasileiro'
    })
      .expect(201)
      .then(res => res.body.content)


    await request(app).get('/autores').expect(200).expect([juvenal, luciano])
  })


  test.todo('Retorna uma lista vazia quando na há autores cadastrados(200)', async () => {
    await request(app).get('/autores').expect(200).expect([]) //assim o supertest sabe que ele vai ter que comparar com response.body. todo:pesquisar o porque
  })


  test.todo('Retorna um erro quando o usuario nao ta autenticado (403)')
})