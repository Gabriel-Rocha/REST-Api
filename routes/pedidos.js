const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(201).send({ 
        message: 'GET da rota de pedido'
    });
});

router.post('/', (req, res, next) => {
    const pedido = {
        id_pedido: req.body.id_pedido,
        quantidade: req.body.quantidade
    };
    res.status(201).send({
        message: 'POST da rota de pedido',
        pedidoCriado: pedido
    });
});

router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido

    if ( id == 1){
        res.status(201).send({ 
            message: `GET por Id de produto, produto ID é ${id}`,

        });
    }else{
        res.status(404).send({
            message: `error 500 bad request`
        })
    }
});

router.delete('/', (req, res, next) => {
    res.status(201).send({ 
        message: 'DELETE da rota de pedido'
    });
});
module.exports = router;