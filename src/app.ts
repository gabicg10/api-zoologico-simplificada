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

// Rota para remover um animal
server.delete('/remover/animal', async (req, res) => {   
    // recuperando o id do animal a ser removido
    const idAnimal = parseInt(req.query.idAnimal as string);
    
    // chama a função para remover o animal e armazena o resultado na variável
    const resultado = await Ave.removerAve(idAnimal);
    
    if(resultado) {
        // se o resultado for **true**, retorna mensagem de sucesso
        return res.status(200).json('Animal foi removido com sucesso');
    } else {
        // se o resultado for **false**, retorna mensagem de erro
        return res.status(401).json('Erro ao remover animal');
    }
});

// Rota para atualizar as informações de um animal
server.put('/atualizar/animal', async (req, res) => {
    // Desestruturando objeto recebido pelo front-end
    const { nome, idade, genero, envergadura } = req.body;
    // recuperando o id do animal a ser atualizado
    const idAnimal = parseInt(req.query.idAnimal as string);

    // Instanciando objeto Ave
    const novaAve = new Ave(nome, idade, genero, envergadura);

    // Chama o método para persistir a ave no banco de dados e armazena o resultado na variável
    const result = await Ave.atualizarAve(novaAve, idAnimal);

    if (result) {
        // se o resultado for **true**, retorna mensagem de sucesso
        return res.status(200).json('Ave atualizada com sucesso');
    } else {
        // se o resultado for **false**, retorna mensagem de erro
        return res.status(400).json('Não foi possível atualizar a ave no banco de dados');
    }
});

// Rota para remover uma atração
server.delete('/remover/atracao', async (req, res) => {
    // recuperando o id da atração a ser removida
    const idAtracao = parseInt(req.query.idAtracao as string);

    // chama a função para remover a atração e armazena o resultado na variável
    const resultado = await Atracao.removerAtracao(idAtracao);

    if(resultado) {
        // se o resultado for **true**, retorna mensagem de sucesso
        return res.status(200).json('Atração foi removida com sucesso');
    } else {
        // se o resultado for **false**, retorna mensagem de erro
        return res.status(401).json('Erro ao remover atração');
    }
})

// Rota para atualizar as informações de uma atração
server.put('/atualizar/atracao', async (req, res) => {
    // Desestruturando objeto recebido pelo front-end
    const { nomeAtracao } = req.body;
    // recuperando o id da atração a ser atualizada
    const idAtracao = parseInt(req.query.idAtracao as string);

    // Instanciando objeto Atração
    const novaAtracao = new Atracao(nomeAtracao);

    // Chama o método para persistir a ave no banco de dados e armazena o resultado na variável
    const resultado = await Atracao.atualizarAtracao(novaAtracao, idAtracao);

    if(resultado) {
        // se o resultado for **true**, retorna mensagem de sucesso
        return res.status(200).json('Atração foi alterada com sucesso');
    } else {
        // se o resultado for **false**, retorna mensagem de erro
        return res.status(401).json('Erro ao alterar atração');
    }
})

// Rota para remover um habitat
server.delete('/remover/habitat', async (req, res) => {
    // recuperando o id do habitat a ser removido
    const idHabitat = parseInt(req.query.idHabitat as string);

    // chama a função para remover o animal e armazena o resultado na variável
    const resultado = await Habitat.removerHabitat(idHabitat);

    if(resultado) {
        // se o resultado for **true**, retorna mensagem de sucesso
        return res.status(200).json('Habitat foi removida com sucesso');
    } else {
        // se o resultado for **false**, retorna mensagem de erro
        return res.status(401).json('Erro ao remover habitat');
    }
})

// Rota para atualizar as informações de um habitat
server.put('/atualizar/habitat', async (req, res) => {
    // Desestruturando objeto recebido pelo front-end
    const { nomeHabitat } = req.body;
    // recuperando o id do animal a ser atualizado
    const idHabitat = parseInt(req.query.idHabitat as string);

     // Instanciando objeto Habitat
    const novoHabitat = new Habitat(nomeHabitat);

    // Chama o método para persistir a ave no banco de dados e armazena o resultado na variável
    const resultado = await Habitat.atualizarHabitat(novoHabitat, idHabitat);

    if(resultado) {
        // se o resultado for **true**, retorna mensagem de sucesso
        return res.status(200).json('Habitat foi atualizado com sucesso');
    } else {
        // se o resultado for **false**, retorna mensagem de erro
        return res.status(401).json('Erro ao atualizar habitat');
    }
})

new DatabaseModel().testeConexao().then((resbd) => {
    if(resbd) {
        server.listen(port, () => {
            console.info(`Servidor executando no endereço http://localhost:${port}/`);
        })
    } else {
        console.log(`Não foi possível conectar ao banco de dados`);
    }
})