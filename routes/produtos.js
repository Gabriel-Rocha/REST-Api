const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM produtos;',
            (error, resultado, field) => {
            if (error) { return res.status(500).send({ error: error }) };

            return res.status(201).send({resultado: resultado});
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

                res.status(201).send({
                    message: 'Produto inserido',
                    id_produto: resultado.insertId
                });
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
            (error, resultado, field) => {
            if (error) { return res.status(500).send({ error: error }) };

            return res.status(201).send({resultado: resultado});
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
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error, response: null });
                }

                res.status(202).send({
                    message: 'Produto alterado'
                });
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
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error, response: null });
                }

                res.status(202).send({
                    message: 'Produto DELETADO'
                });
            }
        )
    });
});
module.exports = router;