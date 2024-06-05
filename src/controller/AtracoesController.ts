import { Atracao } from "../model/Atracao";
import { Request, Response, response } from "express";

class AtracoesController extends Atracao {

    public async listarAtracoes(req: Request, res: Response): Promise<Response> {
        try {
            // cria objeto atracoes e atribui a ele o retorno do método listarAtracoes
            const atracoes = await Atracao.listarAtracoes();

            // retorna a lista de atracoes em formato json
            return res.status(200).json(atracoes);
        } catch (error) {
            console.log(`erro ao acessar o modelo: ${error}`);
            return res.status(400).json('erro ao listar as atrações')
        }
    }

    public async novaAtracao(req: Request, res: Response): Promise<any> {
        // tenta inserir um novo objeto no banco de dados
        try {
            // Desestruturando objeto recebido pelo cliente
            const { nomeAtracao, idHabitat } = req.body;

            // Instanciando objeto Atracao
            const novaAtracao = new Atracao(nomeAtracao);

            // variável de controle, ao ser criada ela recebe o valor FALSE
            let result = false;

            // verifica se o idHabitat não veio vazio do cliente
            if (idHabitat != undefined) {
                // Chama o método para persistir a atracao no banco de dados associando ao id
                // o resultado é um booleano, que será armazenado na variável de controle result
                result = await Atracao.cadastrarAtracao(novaAtracao, idHabitat);
            } else {
                // Chama o método para persistir a atracao no banco de dados
                // o resultado é um booleano, que será armazenado na variável de controle result
                result = await Atracao.cadastrarAtracao(novaAtracao);
            }

            // verifica se o resultado da query foi executada com sucesso
            if (result) {
                // Caso positivo, ele retorna uma mensagem de sucesso com status 200
                return res.status(200).json('Atração cadastrado com sucesso');
            } else {
                // Caso positivo, ele retorna uma mensagem de erro com status 400
                return res.status(400).json('Não foi possível cadastrar a atração no banco de dados');
            }

            // caso aconteça algum erro, é lançada uma exceção
        } catch (error) {
            // caso aconteça algum erro, este é lançado nos logs do servidor
            console.log(`Erro ao cadastrar a atracao: ${error}`);
            // retorna um status 400 com uma mensagem de erro
            return res.status(400).json('Não foi possível cadastrar a atração no banco de dados');
        }
    }

    public async removerAtracao(req: Request, res: Response) {
        try {
            // recuperando o id da atração a ser removida
            const idAtracao = parseInt(req.query.idAtracao as string);

            // chama a função para remover a atração e armazena o resultado na variável
            const resultado = await Atracao.removerAtracao(idAtracao);

            if (resultado) {
                // se o resultado for **true**, retorna mensagem de sucesso
                return res.status(200).json('Atração foi removida com sucesso');
            } else {
                // se o resultado for **false**, retorna mensagem de erro
                return res.status(401).json('Erro ao remover atração');
            }
        } catch (error) {
            console.log(`erro ao acessar o modelo: ${error}`);
            return res.status(400).json(`erro ao remover atracao, consulte os logs no servidor`);
        }
    }

    public async atualizarAtracoes(req: Request, res: Response): Promise<Response> {
        try {
            // Desestruturando objeto recebido pelo front-end
            const { nomeAtracao } = req.body;
            // recuperando o id da atração a ser atualizada
            const idAtracao = parseInt(req.query.idAtracao as string);

            // Instanciando objeto Atração
            const novaAtracao = new Atracao(nomeAtracao);

            // Chama o método para persistir a ave no banco de dados e armazena o resultado na variável
            const resultado = await Atracao.atualizarAtracao(novaAtracao, idAtracao);

            if (resultado) {
                // se o resultado for **true**, retorna mensagem de sucesso
                return res.status(200).json('Atração foi alterada com sucesso');
            } else {
                // se o resultado for **false**, retorna mensagem de erro
                return res.status(401).json('Erro ao alterar atração');
            }
        } catch (error) {
            console.log(`erro ao acessae o modelo: ${error}`);
            return res.status(400).json(`erro ao atualizar atracao, consulte os logs no servidor`);
        }
    }


}

export default AtracoesController;