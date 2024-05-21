import { getPokemonById } from "..";
import { Pokemon } from "../../domain/entities/pokemon";

export const getPokemonByIds = async (Ids:number[]) => {

    try {

        const PokemonPromises: Promise<Pokemon>[] = Ids.map(id => {
            return getPokemonById(id);
        });

        return Promise.all(PokemonPromises);
        
    } catch (error) {
        throw new Error("Error al obtener pokemones por ids");
        
    }
    
}