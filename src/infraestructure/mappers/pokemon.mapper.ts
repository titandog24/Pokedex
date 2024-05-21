import { getColorFromImage } from "../../config/helpers/get-color";
import { Pokemon } from "../../domain/entities/pokemon";
import { PokeApiPokemon } from "../interfaces/pokeapi.interfaces";

export class PokemonMapper {

    static async pokeAPIPokemonToEntity(data: PokeApiPokemon): Promise<Pokemon> {

        const sprites = PokemonMapper.getSprites(data);
        const avatar = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;

        const color = await getColorFromImage(avatar);

        return {
            id: data.id,
            name: data.name,
            avatar: avatar,
            sprites:sprites,
            types: data.types.map(val => val.type.name),
            color: color,
            games: data.game_indices.map(val => val.version.name),
            stats: data.stats.map(val => ({name: val.stat.name, value: val.base_stat})),
            abilities: data.abilities.map(val => val.ability.name),
            moves: data.moves
            .map(val => ({name:val.move.name, level: val.version_group_details[0].level_learned_at}))
            .sort((A,B) => A.level - B.level),

        }
    }
    static getSprites(data: PokeApiPokemon): string[] {
        const sprites: string[] = [
          data.sprites.front_default,
          data.sprites.back_default,
          data.sprites.front_shiny,
          data.sprites.back_shiny,
        ];
    
        if (data.sprites.other?.home.front_default)
          sprites.push(data.sprites.other?.home.front_default);
        if (data.sprites.other?.['official-artwork'].front_default)
          sprites.push(data.sprites.other?.['official-artwork'].front_default);
        if (data.sprites.other?.['official-artwork'].front_shiny)
          sprites.push(data.sprites.other?.['official-artwork'].front_shiny);
        if (data.sprites.other?.showdown.front_default)
          sprites.push(data.sprites.other?.showdown.front_default);
        if (data.sprites.other?.showdown.back_default)
          sprites.push(data.sprites.other?.showdown.back_default);
    
        return sprites;
      }
}