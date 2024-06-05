import express from 'express';
import cors from 'cors';
import { Ave } from './model/Ave';
import { Habitat } from './model/Habitat';
import { Atracao } from './model/Atracao';
import { DatabaseModel } from './model/DatabaseModel';
import AveController from './controller/AveController';
import HabitatController from './controller/HabitatController';
import AtracoesController from './controller/AtracoesController';

const server = express();
const port = 3000;

server.use(express.json());
server.use(cors());

const aveController = new AveController('', 0, '', 0);
const habitatController = new HabitatController('');
const atracaoController = new AtracoesController('');

// Rota padrão para testes (NÃO USAR EM AMBIENTE PRODUÇÃO)
server.get('/', (req, res) => {
    res.send('Hello World!');
});

server.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Informações: ${username} - ${password}`);
});

/**
 * informações da ave
 */
// Listar todos as aves cadastradas
server.get('/aves', aveController.listarAves);
// Cadastra informações de uma nova ave
server.post('/novo/ave', aveController.novaAve);
// Rota para remover um animal
server.delete(`/remover/ave`, aveController.removerAve);
// Rota para atualizar as informações de um animal
server.put(`/atualizar/ave`, aveController.atualizarAve);

/**
 * informações de atrações
 */
// Listar todas as atrações cadastrada
server.get('/atracoes', atracaoController.listarAtracoes);
// Cadastra informações de uma nova atracao
server.post('/novo/atracao', atracaoController.novaAtracao);
// Rota para remover uma atração
server.delete('/remover', atracaoController.removerAtracao);
// Rota para atualizar as informações de uma atração
server.put('/atualizar', atracaoController.atualizarAtracoes);

/**
 * informações de habitat
 */
// Listar todos os habitats cadastradas
server.get('/habitats', habitatController.listarHabitats);
// Cadastra informações de um novo habitat
server.post('/novo/habitat', habitatController.novoHabitat);
// Rota para remover um habitat
server.delete('/remover/habitat', habitatController.removerHabitat);
// Rota para atualizar as informações de um habitat
server.put('/atualizar/habitat', habitatController.atualizarHabitat)




new DatabaseModel().testeConexao().then((resbd) => {
    if(resbd) {
        server.listen(port, () => {
            console.info(`Servidor executando no endereço http://localhost:${port}/`);
        })
    } else {
        console.log(`Não foi possível conectar ao banco de dados`);
    }
})