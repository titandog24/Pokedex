import { pokeApi } from "../../config/api/pokeApi";
import { Pokemon } from "../../domain/entities/pokemon";
import { PokeApiPokemon } from "../../infraestructure/interfaces/pokeapi.interfaces";
import { PokemonMapper } from "../../infraestructure/mappers/pokemon.mapper";

export const getPokemonById = async (Id:number): Promise<Pokemon> => {
    try {

        const {data} = await pokeApi().get<PokeApiPokemon>(`/pokemon/${Id}`);

        const pokemon = await PokemonMapper.pokeAPIPokemonToEntity(data);


        return pokemon;
        
    } catch (error) {
        throw new Error("No se puede obtener el pokemon por id");
        
    }
}