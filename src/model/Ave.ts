import { Animal } from "./Animal";
import { DatabaseModel } from "./DatabaseModel";
import { Habitat } from "./Habitat";

/**
 * Pool de conexão do banco de dados
 */
const database = new DatabaseModel().pool;

/**
 * Representa uma ave no zoológico.
 * Estende a classe Animal.
 */
export class Ave extends Animal {

    /**
     * A envergadura da ave (em centímetros).
     */
    private envergadura: number;

    /**
     * Cria uma nova instância de Ave.
     * 
     * @param _nome O nome da ave.
     * @param _idade A idade da ave.
     * @param _genero O gênero da ave.
     * @param _envergadura A envergadura da ave.
     */
    constructor(_nome: string,
        _idade: number,
        _genero: string,
        _envergadura: number) {
        // Chama o construtor da classe pai (Animal)
        super(_nome, _idade, _genero);
        // Atribui a envergadura fornecida ao atributo envergadura da ave
        this.envergadura = _envergadura;
    }

    /**
     * Obtém a envergadura da ave.
     * 
     * @returns A envergadura da ave.
     */
    public getEnvergadura(): number {
        return this.envergadura;
    }

    /**
     * Define a envergadura da ave.
     * 
     * @param _envergadura A envergadura a ser atribuída à ave.
     */
    public setEnvergadura(_envergadura: number): void {
        this.envergadura = _envergadura;
    }

    /**
     * Retorna uma lista com todos as aves cadastradas no banco de dados
     * 
     * @returns Lista com todos as aves cadastradas no banco de dados
     */
    static async listarAves(): Promise<Array<Ave> | string> {
        // Cria uma lista (array) vazia do tipo Ave
        const listaDeAves: Array<Ave> = [];

        // Construção da query para selecionar as informações de um Ave
        const querySelectAve = `SELECT * FROM animal;`;

        try {
            // Faz a consulta no banco de dados e retorna o resultado para a variável queryReturn
            const queryReturn = await database.query(querySelectAve);
            // Percorre todas as linhas da queryReturn e acessa cada objeto individualmente
            queryReturn.rows.forEach(ave => {
                // Coloca o objeto dentro da lista de Aves
                listaDeAves.push(ave);
            });

            // retorna a lista de Aves para quem chamou a função
            return listaDeAves;
        } catch (error) {
            // Caso dê algum erro na query do banco, é lançado o erro para quem chamou a função
            console.log(`Erro no modelo\n${error}`);
            return "error, verifique os logs do servidor";
        }
    }

    /**
     * Cadastra um objeto do tipo Ave no banco de dados
     * 
     * @param ave Objeto do tipo Ave
     * @param idHabitat Opcional - Id do habitat que será associado à ave
     * @returns **true** caso sucesso, **false** caso erro
     */
    static async cadastrarAve(ave: Ave, idHabitat: number): Promise<Boolean> {
        // Cria uma variável do tipo booleano para guardar o status do resultado da query
        let insertResult = false;

        try {
            // Construção da query para inserir as informações de um Ave. A query irá retornar o ID gerado para o animal pelo banco de dados
            const queryInsertAnimal = `INSERT INTO animal (nomeAnimal, idadeAnimal, generoAnimal, envergadura) 
                                        VALUES 
                                        ('${ave.getNomeAnimal().toUpperCase()}', ${ave.getIdadeAnimal()}, '${ave.getGeneroAnimal().toUpperCase()}', ${ave.getEnvergadura()})
                                        RETURNING idAnimal;`;

            // Faz a query de insert no banco de dados, passando para o banco as informações do objeto recebibo como parâmetro pela função
            await database.query(queryInsertAnimal)
                // Testa para ter certeza que foi possível inserir os dados no banco
                .then(async (result) => {
                    const idAnimal = result.rows[0].idanimal;

                    //Inserindo o animal no Habitat
                    if (!await Habitat.inserirAnimalHabitat(idAnimal, idHabitat)) {
                        console.log("Erro ao cadastrar animal no habitat");
                    };

                    // Se o número de linhas for diferente de zero, a operação deu certo e o valor VERDADEIRO é atribuido na variável
                    insertResult = true;
                });
            // Retorna VERDADEIRO para quem chamou a função, indicando que a operação foi realizada com sucesso
            return insertResult;
        } catch (error) {
            // Imprime o erro no console
            console.log(error);

            // Caso a inserção no banco der algum erro, é restorno o valor FALSO para quem chamou a função
            return insertResult;
        }
    }

    static async removerAve(idAnimal: number): Promise<Boolean> {
        // Variável para controlar o resultado da função
        let queryResult = false;

        try {
            // Query para deletar o animal da tabela animal_habitat
            const queryDeleteAnimalHabitat = `DELETE FROM animal_habitat WHERE idanimal=${idAnimal}`;

            // Executando a query
            await database.query(queryDeleteAnimalHabitat);

            // Query para remover o animal da tabela animal
            const queryDeleteAnimal = `DELETE FROM animal WHERE idanimal=${idAnimal}`;

            // Executa a query
            await database.query(queryDeleteAnimal)
                .then((result) => {
                    // Se o resultado for diferente de zero, a query foi executada com sucesso
                    if (result.rowCount != 0) {
                        queryResult = true;
                    }
                })

            // Retorna o resultado da função
            return queryResult;
        } catch (error) {
            // Exibe o erro no console
            console.log(`Erro na consulta: ${error}`);
            // Retorna a variável queryResult com valor FALSE
            return queryResult;
        }
    }


    // /**
    //  * Remove um animal do banco de dados
    //  * @param idAnimal ID do animal a ser removido
    //  * @returns **true** caso deletado, **false** caso erro na função
    //  */
    // static async removerAve(idAnimal: number): Promise<Boolean> {
    //     console.log('aqui cheguei');

    //     // Variável para controlar o resultado da função
    //     let queryResult = false;

    //     try {
    //         // Query para deletar o animal da tabela animal_habitat
    //         const queryDeleteAnimalHabitat = `DELETE FROM animal_habitat WHERE idanimal=${idAnimal}`;

    //         // Executando a query
    //         await database.query(queryDeleteAnimalHabitat)
    //         // Testar o resultado da query
    //         .then(async (result) => {
    //             // Se o resultado for diferente de zero, a query foi executada com sucesso
    //             if(result.rowCount != 0) {
    //                 // Se a query for executado com sucesso, agora irá remover o animal tabela animal

    //                 // Query para remover o animal da tabela animal
    //                 const queryDeleteAnimal = `DELETE FROM animal WHERE idanimal=${idAnimal}`;
    //                 // Executa a query
    //                 await database.query(queryDeleteAnimal)
    //                 // Testar o resultado da query
    //                 .then((result) => {
    //                     // Se o resultado for diferente de zero, a query foi executada com sucesso
    //                     if(result.rowCount != 0) {
    //                         // atribui o valor VERDADEIRO a queryResult
    //                         queryResult = true;
    //                     }
    //                 })
    //             }
    //         })

    //         // Retorna o resultado da função
    //         return queryResult;
    //     // Caso ocorra algum erro
    //     } catch (error) {
    //         // Exibe o erro no console
    //         console.log(`Erro na consulta: ${error}`);
    //         // Retorna a variável queryResult com valor FALSE
    //         return queryResult;
    //     }
    // }

    /**
     * Atualiza as informações de uma ave no banco de dados
     * @param ave Objeto ave contendo as informações
     * @param idAve id da ave a ser alterada
     * @returns **true** caso a atualização seja feita, **false** caso ocorra algum problema
     */
    static async atualizarAve(ave: Ave, idAve: number): Promise<Boolean> {
        // Variável para controlar o resultado da função
        let queryResult = false;

        try {
            // Query para alterar o animal da tabela animal
            const queryUpdateAve = `UPDATE animal SET
                                        nomeAnimal='${ave.getNomeAnimal().toUpperCase()}',
                                        idadeAnimal=${ave.getIdadeAnimal()},
                                        generoAnimal='${ave.getGeneroAnimal().toUpperCase()}',
                                        envergadura=${ave.getEnvergadura()}
                                    WHERE idAnimal=${idAve}`;

            // executa a query
            await database.query(queryUpdateAve)
                // Testar o resultado da query
                .then((result) => {
                    // Se o resultado for diferente de zero, a query foi executada com sucesso
                    if (result.rowCount !== 0) {
                        // atribui o valor VERDADEIRO a queryResult                 
                        queryResult = true;
                    }
                })
            // Retorna o resultado da função
            return queryResult;
        } catch (error) {
            // Exibe o erro no console
            console.log(`Erro na consulta: ${error}`);
            // Retorna a variável queryResult com valor FALSE
            return queryResult;
        }
    }
}