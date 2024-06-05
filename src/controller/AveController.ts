import { Ave } from "../model/Ave";
import { Request, Response } from "express";

class AveController extends Ave {

    /**
     * acessa a função do model que lista todas as aves
     */
    public async listarAves(req: Request, res: Response): Promise<Response> {
        try {
            const aves = JSON.stringify(await Ave.listarAves());
            return res.status(200).json(aves);
        } catch (error) {
            console.log(`erro ao acessar o modelo: ${error}`);
            return res.status(400).json('erro ao listas as aves')
        }
    }

    /**
     * chama o metodo pra cadastrar uma nova ave
     * @param req requisição
     * @param res resposta
     * @returns retorna
     */

    public async novaAve(req: Request, res: Response): Promise<any> {
        try {
            // Desestruturando objeto recebido pelo front-end
            const { nome, idade, genero, envergadura, idHabitat } = req.body;
            // Instanciando objeto Ave
            const novaAve = new Ave(nome, idade, genero, envergadura);
            // Chama o método para persistir a ave no banco de dados
            const result = await Ave.cadastrarAve(novaAve, idHabitat);
            if (result) {
                return res.status(200).json('ave cadastrada com sucesso');
            } else {
                return res.status(400).json('erro ao cadastrar a ave');
            }
        } catch (error) {
            console.log(`erro ao cadastrar a ave: ${error}`);
            return res.status(400).json('nao foi possivel cadastrar a ave no banco de dados');
        }
    }

    public async removerAve(req: Request, res: Response) {
        try {
            // recuperando o id do animal a ser removido
            const idAnimal = parseInt(req.query.idAnimal as string);

            // chama a função para remover o animal e armazena o resultado na variável
            const resultado = await Ave.removerAve(idAnimal);

            if (resultado) {
                // se o resultado for **true**, retorna mensagem de sucesso
                return res.status(200).json('Animal foi removido com sucesso');
            } else {
                // se o resultado for **false**, retorna mensagem de erro
                return res.status(401).json('Erro ao remover animal');
            }
        } catch (error) {
            console.log(`erro ao acessar o modelo: ${error}`);
            return res.status(400).json(`erro ao remover ave, consulte os logs no servidor`);
        }
    }

    public async atualizarAve(req: Request, res: Response): Promise<Response> {
        try {
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
        } catch (error) {
            console.log(`erro ao acessae o modelo: ${error}`);
            return res.status(400).json(`erro ao atualizar ave, consulte os logs no servidor`);
        }
    }
}

export default AveController;