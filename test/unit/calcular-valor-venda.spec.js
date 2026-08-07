import { calcularValorVenda } from "#domain/calcular-valor-venda.js";
import assert from "node:assert";
import test, { describe } from "node:test";

describe('calcularValorVenda', () => {


  //TESTES PARAMETRIZADOS
  //servem pra multiplos testes que tem a mesma estrutura
  //fazer dessa forma evita escrever muitas linhas repetitivas
  const casosTeste = [
    { valor: 100, modoPagamento: 'CARTAO_CREDITO', valorEsperado: 105 },
    { valor: 100, modoPagamento: 'CARTAO_DEBITO', valorEsperado: 102 },
    { valor: 100, modoPagamento: 'BOLETO', valorEsperado: 100 },
    { valor: 100, modoPagamento: 'DINHEIRO', valorEsperado: 100 },
    { valor: 100, modoPagamento: 'PIX', valorEsperado: 95 },
  ]

  casosTeste.forEach(({ valor, modoPagamento, valorEsperado }) => {
    test(`Qaundo o valor é ${valor} e o modo de pagamento é ${modoPagamento}, o valor final deve ser ${valorEsperado}`, async () => {
      const valorFinal = calcularValorVenda(valor, modoPagamento)
      assert.strictEqual(valorFinal, valorEsperado)
    })
  })



  // test('Adiciona taxa de 5% para CARTAO_CREDITO', async () => {

  //   //arrange
  //   const valor = 100
  //   const modoPagamento = 'CARTAO_CREDITO'

  //   //Act
  //   const valorFinal = calcularValorVenda(valor, modoPagamento)

  //   //assert
  //   assert.strictEqual(valorFinal, 105)
  // })
  // test('Adiciona taxa de 2% para CARTAO_DEBITO', async () => {

  //   //arrange
  //   const valor = 100
  //   const modoPagamento = 'CARTAO_DEBITO'

  //   //Act
  //   const valorFinal = calcularValorVenda(valor, modoPagamento)

  //   //assert
  //   assert.strictEqual(valorFinal, 102)
  // })
  // test('Não adiciona taxa para BOLETO', async () => {

  //   //arrange
  //   const valor = 100
  //   const modoPagamento = 'BOLETO'

  //   //Act
  //   const valorFinal = calcularValorVenda(valor, modoPagamento)

  //   //assert
  //   assert.strictEqual(valorFinal, 100)
  // })
  // test('Não adiciona taxa DINHEIRO', async () => {

  //   //arrange
  //   const valor = 100
  //   const modoPagamento = 'DINHEIRO'

  //   //Act
  //   const valorFinal = calcularValorVenda(valor, modoPagamento)

  //   //assert
  //   assert.strictEqual(valorFinal, 100)
  // })
  // test('Adiciona desconto de 5% para PIX', async () => {

  //   //arrange
  //   const valor = 100
  //   const modoPagamento = 'PIX'

  //   //Act
  //   const valorFinal = calcularValorVenda(valor, modoPagamento)

  //   //assert
  //   assert.strictEqual(valorFinal, 95)
  // })


  test('Lança erro pra modo de pagamento inválido', () => {
    //arrange
    const valor = 100
    const modoPagamento = 'CHEQUE'

    //quando quisermos testar um caso de erro
    //não é uma boa praticar usar trycatch e afzer asset no erro do catch
    //essa é a maneira ideal:


    //ACT
    const callbackQueLancaErro = () => calcularValorVenda(valor, modoPagamento)

    //assert
    assert.throws(callbackQueLancaErro, { message: 'Modo de pagamento inválido: CHEQUE' })

  })
})

