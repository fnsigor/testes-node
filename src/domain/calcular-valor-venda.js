//essa função estava originalmente na model
//porem ela aplica a regra de negocio sem fazer uso da classe model
//pra aplicar oq for regra de negocio, interessante colocar na camada de dominio

const taxas = {
  CARTAO_CREDITO: 0.05,
  CARTAO_DEBITO: 0.02,
  PIX: -0.05,
  DINHEIRO: 0,
  BOLETO: 0
};

export function calcularValorVenda(valor, modoPagamento) {

  const taxa = taxas[modoPagamento]

  if (taxa === undefined) {
    throw new Error(`Modo de pagamento inválido: ${modoPagamento}`)
  }

  return Math.round(valor + valor * taxa);
}