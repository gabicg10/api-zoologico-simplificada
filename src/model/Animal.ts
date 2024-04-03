import { DatabaseModel } from "./DatabaseModel";

/**
 * Pool de conexão do banco de dados
 */
const database = new DatabaseModel().pool;

/**
 * Representa um animal no zoológico.
 */
export class Animal {

    /**
     * O nome do animal.
     */
    private nomeAnimal: string;

    /**
     * A idade do animal.
     */
    private idadeAnimal: number;

    /**
     * O gênero do animal (ex: "macho", "fêmea", "desconhecido").
     */
    private generoAnimal: string;

    /**
     * Cria uma nova instância de Animal.
     * 
     * @param _nome O nome do animal.
     * @param _idade A idade do animal.
     * @param _genero O gênero do animal.
     */
    constructor(_nome: string,
        _idade: number,
        _genero: string) {
        this.nomeAnimal = _nome;
        this.idadeAnimal = _idade;
        this.generoAnimal = _genero;
    }

    /**
     * Obtém o nome do animal.
     * 
     * @returns O nome do animal.
     */
    public getNomeAnimal(): string {
        return this.nomeAnimal;
    }

    /**
     * Define o nome do animal.
     * 
     * @param nome O nome a ser atribuído ao animal.
     */
    public setNomeAnimal(nome: string): void {
        this.nomeAnimal = nome;
    }

    /**
     * Obtém a idade do animal.
     * 
     * @returns A idade do animal.
     */
    public getIdadeAnimal(): number {
        return this.idadeAnimal;
    }

    /**
     * Define a idade do animal.
     * 
     * @param idade A idade a ser atribuída ao animal.
     */
    public setIdadeAnimal(idade: number): void {
        this.idadeAnimal = idade;
    }

    /**
     * Obtém o gênero do animal.
     * 
     * @returns O gênero do animal.
     */
    public getGeneroAnimal(): string {
        return this.generoAnimal;
    }

    /**
     * Define o gênero do animal.
     * 
     * @param genero O gênero a ser atribuído ao animal.
     */
    public setGeneroAnimal(genero: string): void {
        this.generoAnimal = genero;
    }
}