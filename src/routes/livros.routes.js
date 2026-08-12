import { Router } from 'express';
import { LivrosController } from '#controllers/livros.controller.js';
import db from '#db/singleton-connection.js';
const router = Router();

const livrosController = new LivrosController(db);

//router.get('/livros', livrosController.listarLivros); - aqui estamos fazendo referencia ao metodo de uma instancia de classe
// sempre que fazemos isso, a função perde a referencia de quem é o this (perde a referencia da instancia, this passa a ser undefined)

router.get('/livros', (req, res) => livrosController.listarLivros(req, res)); //esse é um jeito de resolver: executa a função dentro de uma callback, não apenas referenciando
router.get('/livros/:id', livrosController.buscarLivroPorId.bind(livrosController));//esse é outro jeito de resolver: o bind configura a quem o this se refere 

router.post('/livros', livrosController.cadastrarLivro);

export default router;
