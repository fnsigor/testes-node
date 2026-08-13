
class Venda {
  static db;

  static configurarDB(db) {
    this.db = db;
  }

  constructor({ id, idlivro, modoPagamento, valor, created_at, updated_at }) {
    this.id = id;
    this.idlivro = idlivro;
    this.modoPagamento = modoPagamento;
    this.valor = valor;
    this.created_at = created_at || new Date().toISOString();
    this.updated_at = updated_at || new Date().toISOString();
  }

  static paraApi(linha) {
    return (
      linha && {
        id: linha.id,
        idlivro: linha.livro_id,
        valor: linha.valor,
        modoPagamento: linha.tipo_pagamento,
        created_at: linha.created_at,
        updated_at: linha.updated_at,
      }
    );
  }

  static async pegarVendas() {
    const resultado = await this.db.select('*').from('vendas');
    return resultado.map(Venda.paraApi);
  }

  static async pegarPeloId(id) {
    const resultado = await this.db.select('*').from('vendas').where({ id });
    return Venda.paraApi(resultado[0]);
  }

  async criar() {
    const dados = {
      id: this.id,
      livro_id: this.idlivro,
      valor: this.valor,
      tipo_pagamento: this.modoPagamento,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
    const resultado = await Venda.db('vendas').insert(dados, '*');
    return Venda.paraApi(resultado[0]);
  }

  async atualizar(id) {
    const dados = {
      livro_id: this.idlivro,
      valor: this.valor,
      tipo_pagamento: this.modoPagamento,
      created_at: this.created_at,
      updated_at: new Date().toISOString(),
    };
    await Venda.db('vendas').where({ id }).update(dados);

    const resultado = await Venda.db.select('*').from('vendas').where({ id });
    return Venda.paraApi(resultado[0]);
  }

  static async excluir(id) {
    await this.db('vendas').where({ id }).del();
  }

  async salvar() {
    if (this.id) {
      const resultado = await this.atualizar(this.id);
      return resultado;
    }
    const resultado = await this.criar();
    return resultado;
  }
}

export default Venda;
