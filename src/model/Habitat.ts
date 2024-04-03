import { Animal } from "./Animal";
import { DatabaseModel } from "./DatabaseModel";

/**
 * Pool de conexão do banco de dados
 */
const database = new DatabaseModel().pool;

/**
 * Representa um habitat no zoológico, onde os animais vivem.
 */
export class Habitat {

    /**
     * O nome do habitat.
     */
    private nomeHabitat: string;

    /**
     * A lista de animais que habitam este habitat.
     */
    private listaAnimais: Array<Animal> = [];

    /**
     * Cria uma nova instância de Habitat.
     * 
     * @param _nome O nome do habitat.
     * @param _listaAnimais A lista de animais que habitam o habitat.
     */
    constructor(_nome: string) {
        this.nomeHabitat = _nome;
    }

    /**
     * Obtém o nome do habitat.
     * 
     * @returns O nome do habitat.
     */
    public getNomeHabitat(): string {
        return this.nomeHabitat;
    }

    /**
     * Define o nome do habitat.
     * 
     * @param _nome O nome a ser atribuído ao habitat.
     */
    public setNomeHabitat(_nome: string): void {
        this.nomeHabitat = _nome;
    }

    /**
     * Obtém a lista de animais do habitat.
     * 
     * @returns A lista de animais do habitat.
     */
    public getListaAnimais(): Array<Animal> {
        return this.listaAnimais;
    }

    /**
     * Define a lista de animais do habitat.
     * 
     * @param _listaAnimais A lista de animais a ser atribuída ao habitat.
     */
    public setListaAnimais(_listaAnimais: Array<Animal>): void {
        this.listaAnimais = _listaAnimais;
    }

    /**
     * Retorna uma lista com todos os habitats cadastrados no banco de dados
     * 
     * @returns Lista com todos os habitats cadastrados no banco de dados
     */
    static async listarHabitats(): Promise<any> {
        // Cria uma lista (array) vazia do tipo habitat
        const listaDeHabitats: Array<Habitat> = [];

        // Construção da query para selecionar as informações de um habitat
        const querySelectHabitat = `SELECT * FROM habitat;`;

        try {
            // Faz a consulta no banco de dados e retorna o resultado para a variável queryReturn
            const queryReturn = await database.query(querySelectHabitat);
            // Percorre todas as linhas da queryReturn e acessa cada objeto individualmente
            queryReturn.rows.forEach(habitat => {
                // Coloca o objeto dentro da lista de habitats
                listaDeHabitats.push(habitat);
            });

            // retorna a lista de habitats para quem chamou a função
            return listaDeHabitats;
        } catch (error) {
            // Caso dê algum erro na query do banco, é lançado o erro para quem chamou a função
            console.log('Erro no modelo');
            console.log(error);
            return "error, verifique os logs do servidor";
        }
    }

    /**
     * Cadastra um objeto do tipo Habitat no banco de dados
     * 
     * @param habitat Objeto do tipo Habitat
     * @returns **true** caso sucesso, **false** caso erro
     */
    static async cadastrarHabitat(habitat: Habitat): Promise<any> {
        // Cria uma variável do tipo booleano para guardar o status do resultado da query
        let insertResult = false;
        try {
            // Construção da query para inserir as informações de um Mamifero. A query irá retornar o ID gerado para o animal pelo banco de dados
            const queryInsertHabitat = `INSERT INTO habitat (nomehabitat) 
                                        VALUES 
                                        ('${habitat.getNomeHabitat().toUpperCase()}');`;

            // Faz a query de insert no banco de dados, passando para o banco as informações do objeto recebibo como parâmetro pela função
            await database.query(queryInsertHabitat)
                // Testa para ter certeza que foi possível inserir os dados no banco
                .then((resultHabitat) => {
                    if (resultHabitat.rowCount != 0) {
                        // Se o número de linhas for diferente de zero, a operação deu certo e o valor VERDADEIRO é atribuido na variável
                        insertResult = true;
                    }
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

    /**
     * Retorna uma lista com todos os habitats cadastrados e os animais vinculados a eles, caso o Habitat não tenha nenhum animal é retornado uma lista vazia
     * 
     * @returns Lista com todos os habitats cadastrados e os animais vinculados a eles
     */
    static async exibirAnimaisPorHabitat(idHabitat: number) : Promise<any> {
        try {
            // Retorna todos os animais de um Habitat (informado como parâmetro). Caso o Habitat não tenha nenhum animal é retornado uma lista vazia
            const querySelectHabitatsComAnimais = `
                SELECT
                    h.idHabitat,
                    h.nomeHabitat,
                    a.idAnimal,
                    a.nomeAnimal,
                    a.idadeAnimal,
                    a.generoAnimal
                FROM
                    Habitat h
                LEFT JOIN
                    Animal_Habitat ah ON h.idHabitat = ah.idHabitat
                LEFT JOIN
                    Animal a ON ah.idAnimal = a.idAnimal
                WHERE 
                    h.idHabitat = ${idHabitat} AND ah.idAnimal IS NOT NULL
                ORDER BY
                    h.idHabitat, a.idAnimal;
            `;
            
            const queryReturn = await database.query(querySelectHabitatsComAnimais);
            return queryReturn.rows;
        } catch (error) {
            console.log('Erro no modelo');
            console.log(error);
            return "error, verifique os logs do servidor";
        }
    }

    /**
     * Insere um animal no habitat
     * 
     * @param idAnimal ID do animal 
     * @param idHabitat ID do habitat
     * @returns **true** caso sucesso, **false** caso erro
     */
    static async inserirAnimalHabitat(idAnimal: number, idHabitat: number): Promise<any> {
        // Cria uma variável do tipo booleano para guardar o status do resultado da query
        let insertResult = false;
        try {
            // Construção da query para inserir as informações de um Mamifero. A query irá retornar o ID gerado para o animal pelo banco de dados
            const queryInsertAnimalHabitat = `INSERT INTO Animal_Habitat(idAnimal, idHabitat)
                                                VALUES
                                                (${idAnimal}, ${idHabitat});`;

            // Faz a query de insert no banco de dados, passando para o banco as informações do objeto recebibo como parâmetro pela função
            await database.query(queryInsertAnimalHabitat)
                // Testa para ter certeza que foi possível inserir os dados no banco
                .then((result) => {
                    if (result.rowCount != 0) {
                        // Se o número de linhas for diferente de zero, a operação deu certo e o valor VERDADEIRO é atribuido na variável
                        insertResult = true;
                    }
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
}
