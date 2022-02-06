const server = require('express');
const app = server();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));  // Apenas dados simples
app.use(bodyParser.json()); // Json de entrada no body

app.use((req, res, next) => {
    res.header('Acess-Control-Allow-Origin', '*');
    res.header(
        'Acess-Control-Allow-Header', 
        'Origin, X-Requested-With, X-Requested-With, Content-Type, Accept, Authorization',
    );

    if (req.method === '0') {
        res.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        return res.status(200).send({});
    }

    next();
});

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);

// QUANDO NÂO ENCONTRAR ROTA
app.use((req, res, next) => {
    const error = new Error('Não encontrado');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({ 
        error: { 
            message: error.message
        }
    });
})

module.exports = app;

