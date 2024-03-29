const express = require('express');
const mysql = require('../mysql').pool;
const router = express.Router();

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(`SELECT 
                        pedidos.id_pedido,
                        pedidos.quantidade,
                        produtos.id_produto,
                        produtos.nome,
                        produtos.preco
                    FROM
                        pedidos
              INNER JOIN produtos 
                      ON produtos.id_produto = pedidos.id_produto;`,
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }) };
                const response = {
                    pedidos: result.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: "GET",
                                descricao: "Retorna os detalhes de um pedido especifico",
                                url: "http://localhost:3000/pedidos/" + pedido.id_pedido
                            }
                        }
                    })
                }
                return res.status(201).send({ response });
            }
        )
    })
});

router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query("SELECT * FROM produtos WHERE id_produto = ?", 
        [req.body.id_produto], 
        (error, result, field) => {
            if (error) {return res.status(500).send({ error: error, response: null })}
            if (result.length == 0) {
                return res.status(404).send({
                    message: 'não foi encontrado produto com esse id'
                });
            }

            conn.query(
                `INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)`,
                [req.body.id_produto, req.body.quantidade],
                (error, result, field) => {
                    conn.release();
    
                    if (error) {
                        return res.status(500).send({ error: error, response: null });
                    }
                    const response = {
                        message: "Pedido inserido com sucesso",
                        pedido: {
                            id_pedido: result.id_pedido,
                            id_produto: req.body.id_produto,
                            quantidade: req.body.quantidade,
                            request: {
                                tipo: "POST",
                                descricao: "Insere um pedidos",
                                url: "http://localhost:3000/pedidos"
                            }
                        }
                    }
                    res.status(201).send(response);
                }
            )
        }) 
    });
   
});

router.get('/:id_pedido', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido =?;',
            [req.params.id_pedido],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }) };

                if (result.length == 0) {
                    return res.status(404).send({
                        message: 'não foi encontrado pedido com esse id'
                    });
                };
                const response = {
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,

                        request: {
                            tipo: "GET",
                            descricao: "Retorna um pedido",
                            url: "http://localhost:3000/pedidos"
                        }
                    }
                };
                res.status(200).send(response);
            }
        )
    })
});

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        console.log('eu');
        conn.query(
            `DELETE FROM pedidos WHERE id_pedido = ?;`,
            [
                req.body.id_pedido
            ],
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error, response: null });
                }

                const response = {
                    mensaje: 'Pedido detetado com sucesso',
                    request: {
                        tipo: "POST",
                        descrição: "Delete produto",
                        url: "http://localhost:3000/produtos",
                        body: {
                            id_produto: "Number",
                            quantidade: "Number"
                        }
                    }
                }

                res.status(202).send(response);
            }
        )
    });
});
module.exports = router;