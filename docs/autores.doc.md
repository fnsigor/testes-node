 - Contexto, Ação, Resultado Esperado

## Cadastrar um Autor

Rota: (POST) /Autores

Cenários:

- Retorna os dados do autor cadastrado quando os dados são válidos (201)

- x Retorna um erro ao tentar cadastrar um autor com dados inválidos (400) 



## Recuperar um Autor

Rota: (GET) /Autores/:id

Cenários:

- Retorna os dados de um autor existente (200)

- Retorna um erro quando o autor não existe (404)

## Listar Autores

Rota: (GET) /Autores

Cenários:

- Retorna uma lista com os dados dos autores qaundo existe ao menos um autor cadastrado(200)

- Retorna uma lista vazia quando na há autores cadastrados(200)

- Retorna um erro quando o usuario nao ta autenticado (403)