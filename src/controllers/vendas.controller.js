import Venda from '#models/venda.js';

export class VendasController {
  constructor(databaseConnection) {
    Venda.configurarDB(databaseConnection);
  }

  async registrarVenda(req, res) {
    const { body } = req;
    if (!body.idlivro || !body.modoPagamento || !body.valor) {
      return res.status(400).json({ message: 'Dados inválidos para registro de venda.', type: 'INVALID_DATA' });
    }
    const venda = new Venda(body);
    try {
      const resposta = await venda.salvar();
      return res
        .status(201)
        .json({ message: 'venda registrada', content: resposta });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err.message);
    }
  }
}
