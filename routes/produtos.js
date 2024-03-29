const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }) };
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: "GET",
                                descricao: "Retona todos os outros produtos",
                                url: "http://localhost:3000/produtos/" + prod.id_produto
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
        console.log('eu');
        conn.query(
            `INSERT INTO produtos (nome, preco) VALUES (?,?)`,
            [req.body.nome, req.body.preco],
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error, response: null });
                }
                const response = {
                    message: "Produto inserido com sucesso",
                    produto: {
                        id_produto: resultado.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: "POST",
                            descricao: "Insere um produto",
                            url: "http://localhost:3000/produtos"
                        }
                    }
                }
                res.status(201).send(response);
            }
        )
    });


});

router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM produtos WHERE id_produto =?;',
            [req.params.id_produto],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }) };

                if(result.length == 0) {
                    return res.status(404).send({ 
                        message:  'não foi encontrado produto com esse id'
                    });
                };
                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: "GET",
                            descricao: "Retorna um produto",
                            url: "http://localhost:3000/produtos"
                        }
                    }
                };
                res.status(200).send(response);
            }
        )
    })
});

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        console.log('eu');
        conn.query(
            `UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?;`,
            [
                req.body.nome,
                req.body.preco,
                req.body.id_produto
            ],
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error, response: null });
                }
                const response = {
                    message: "Produto atualizado com sucesso",
                    produto: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: "POST",
                            descricao: "Insere um produto",
                            url: "http://localhost:3000/produtos/" + req.body.id_produto
                        }
                    }
                }
                res.status(202).send(response);
            }
        )
    });

});


router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        console.log('eu');
        conn.query(
            `DELETE FROM produtos WHERE id_produto = ?;`,
            [
                req.body.id_produto
            ],
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error, response: null });
                }
                const response = {
                    mensaje: 'Produto detetado com sucesso',
                    request: {
                        tipo: "POST",
                        descrição: "Insere produto",
                        url: "http://localhost:3000/produtos",
                        body: {
                            nome: "Stringo",
                            preco: "Number"
                        }
                    }
                }

                res.status(202).send(response);
            }
        )
    });
});
module.exports = router;