import { pokeApi } from '../../config/api/pokeApi';
import type { Pokemon } from "../../domain/entities/pokemon";
import type { PokeAPIPaginatedResponse, PokeApiPokemon } from '../../infraestructure/interfaces/pokeapi.interfaces';
import { PokemonMapper } from '../../infraestructure/mappers/pokemon.mapper';


export const getPokemons = async (page: number, limit:number = 20): Promise<Pokemon[]> => {
    try {
        const url = `/pokemon?offset=${page*10}&limit=${limit}`;
        const {data} = await pokeApi().get<PokeAPIPaginatedResponse>(url);
        
        const pokemoPromises = data.results.map((info) => {
            return pokeApi().get<PokeApiPokemon>(info.url);
        });

        const pokeApiPokemons = await Promise.all(pokemoPromises);
        // console.log(pokeApiPokemons);
        const pokemonsPromises = pokeApiPokemons.map(
            (item) => PokemonMapper.pokeAPIPokemonToEntity(item.data));
        
        return await Promise.all(pokemonsPromises);
    } catch (error) {
        throw new Error("Error getting pokemons");
        
    }
}