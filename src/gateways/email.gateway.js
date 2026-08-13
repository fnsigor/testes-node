//gatewais servem pra chamar serviços externos, como pagamento, envio de email, etc

export class EmailGateway {
  async enviarEmail({ destinatario, remetente, assunto, mensagem }) {
    console.log(`envinado email de ${remetente} pra ${destinatario} com assunto ${assunto}
      
      ${mensagem}
      `)
  }
}