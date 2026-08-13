import Livro from '#models/livro.js'
import Editora from '#models/editora.js'
import Venda from "#models/venda.js";
import { calcularValorVenda } from "#src/domain/calcular-valor-venda.js";
import { EmailGateway } from "#src/gateways/email.gateway.js";
import { EstoqueApiGateway } from '#src/gateways/estoque-api-gateway.js';

export class VendasService {

  constructor(dbConnection, emailGateway = new EmailGateway(), estoqueGateway = new EstoqueApiGateway()) {
    //é necessario passar a dependencia do emailGateway como prop no construtor, pra nao dispara email de verdade nos testes automatizados
    //a definição do valor default "new EmailGateway()" é pra nao ter que ficar instanciando toda hr sempre que precisa do gateway
    Venda.configurarDB(dbConnection)
    Livro.configurarDB(dbConnection)
    Editora.configurarDB(dbConnection)
    this.emailGateway = emailGateway
    this.estoqueGateway = estoqueGateway
  }

  async registrarVenda({ idlivro, modoPagamento, valor }) {


    const temEstoque = await this.estoqueGateway.temEstoque(idlivro)

    if (!temEstoque) {
      throw new Error('Livro sem estoque disponível')
    }


    const valorFinal = calcularValorVenda(valor, modoPagamento)

    const venda = new Venda({ idlivro, modoPagamento, valor: valorFinal });

    const resultado = await venda.salvar()

    const livro = await Livro.pegarPeloId(venda.idlivro)
    const editora = await Editora.pegarPeloId(livro.editora_id)

    await this.emailGateway.enviarEmail({
      remetente: 'no-reply@dominio.com',
      assunto: 'Venda registrada',
      destinatario: editora.email,
      mensagem: `Uma nova venda foi registrada no valor de R$ ${resultado.valor}`
    })

    return resultado

  }


}