const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(201).send({
        message: 'GET da rota de produtos'
    });
});

router.post('/', (req, res, next) => {
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    };
    res.status(201).send({
        message: 'POST da rota de produtos',
        produtoCriado: produto
    });
});

router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto

    if (id == 1) {
        res.status(201).send({
            message: `GET por Id de produto, produto ID é ${id}`,

        });
    } else {
        res.status(404).send({
            message: `error 500 bad request`
        })
    }
});

router.patch('/', (req, res, next) => {
    res.status(201).send({
        message: 'PATCH da rota de produtos'
    });
});


router.delete('/', (req, res, next) => {
    res.status(201).send({
        message: 'DELETE da rota de produtos'
    });
});
module.exports = router;