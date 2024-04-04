import express from 'express';
import cors from 'cors';
import { Ave } from './model/Ave';
import { Habitat } from './model/Habitat';
import { Atracao } from './model/Atracao';
import { DatabaseModel } from './model/DatabaseModel';

const server = express();
const port = 3000;

server.use(express.json());
server.use(cors());

// Rota padrão para testes (NÃO USAR EM AMBIENTE PRODUÇÃO)
server.get('/', (req, res) => {
    res.send('Hello World!');
});

server.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Informações: ${username} - ${password}`);
});

/**
 * Listar informações cadastradas no banco de dados
 */
// Listar todos as aves cadastradas
server.get('/listar-aves', async (req, res) => {
    // cria objeto aves e atribui a ele o retorno do método listarAves
    const aves = await Ave.listarAves();

    // retorna a lista de aves em formato json
    res.status(200).json(aves);
});

// Listar todos os habitats cadastradas
server.get('/habitats', async (req, res) => {
    // cria objeto habitats e atribui a ele o retorno do método listarHabitats
    const habitats = await Habitat.listarHabitats();

    // retorna a lista de habitats em formato json
    res.status(200).json(habitats);
});

// Listar todas as atrações cadastradas
server.get('/atracoes', async (req, res) => {
    // cria objeto atracoes e atribui a ele o retorno do método listarAtracoes
    const atracoes = await Atracao.listarAtracoes();

    // retorna a lista de atracoes em formato json
    res.status(200).json(atracoes);
});

/**
 * Cadastrar informações no sistema
 */
// Cadastra informações de uma nova ave
server.post('/novo/ave', async (req, res) => {
    // Desestruturando objeto recebido pelo front-end
    const { nome, idade, genero, envergadura, idHabitat } = req.body;

    // Instanciando objeto Ave
    const novaAve = new Ave(nome, idade, genero, envergadura);

    // Chama o método para persistir a ave no banco de dados
    const result = await Ave.cadastrarAve(novaAve, idHabitat);

    // Verifica se a query foi executada com sucesso
    if (result) {
        return res.status(200).json('Ave cadastrado com sucesso');
    } else {
        return res.status(400).json('Não foi possível cadastrar o ave no banco de dados');
    }
});

// Cadastra informações de um novo habitat
server.post('/novo/habitat', async (req, res) => {
    // Desestruturando objeto recebido pelo front-end
    const { nomeHabitat } = req.body;

    // Instanciando objeto Habitat
    const novoHabitat = new Habitat(nomeHabitat);

    // Chama o método para persistir o habitat no banco de dados
    const result = await Habitat.cadastrarHabitat(novoHabitat);

    // Verifica se a query foi executada com sucesso
    if (result) {
        return res.status(200).json('Habitat cadastrado com sucesso');
    } else {
        return res.status(400).json('Não foi possível cadastrar o habitat no banco de dados');
    }
});

// Cadastra informações de uma nova atracao
server.post('/novo/atracao', async (req, res) => {
    // Desestruturando objeto recebido pelo front-end
    const { nomeAtracao, idHabitat } = req.body;

    // Instanciando objeto Ave
    const novaAtracao = new Atracao(nomeAtracao);

    let result = false;

    // verifica se o idHabitat não veio vazio do front-end
    if (idHabitat != undefined) {
        // Chama o método para persistir a atracao no banco de dados associando ao id
        result = await Atracao.cadastrarAtracao(novaAtracao, idHabitat);
    } else {
        // Chama o método para persistir a atracao no banco de dados
        result = await Atracao.cadastrarAtracao(novaAtracao);
    }

    // verifica se a query foi executada com sucesso
    if (result) {
        return res.status(200).json('Atração cadastrado com sucesso');
    } else {
        return res.status(400).json('Não foi possível cadastrar a atração no banco de dados');
    }
});

new DatabaseModel().testeConexao().then((resbd) => {
    if(resbd) {
        server.listen(port, () => {
            console.info(`Servidor executando no endereço http://localhost:${port}/`);
        })
    } else {
        console.log(`Não foi possível conectar ao banco de dados`);
    }
})