

import { FlatList, View } from 'react-native'
import { globalTheme } from '../../../config/theme/global-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Text, TextInput } from 'react-native-paper';
import { Pokemon } from '../../../domain/entities/pokemon';
import { PokemonCard } from '../../components/pokemons/PokemonCard';
import { useQuery } from '@tanstack/react-query';
import { getPokemonByIds, getPokemonNamesWithId } from '../../../actions';
import { useMemo, useState } from 'react';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';
import { useDebouncedValues } from '../../hooks/useDebouncedValues';

export const SearchScreen = () => {

  const [term, setterm] = useState("");
  const debouncedValue = useDebouncedValues(term);
  const pokemonVacio: Pokemon = {
    id: 0,
    name: 'string',
    types: [],
    avatar: '',
    sprites: [],
    color: 'string',

    games: [],
    stats: [],
    abilities: [],
    moves: []
  }

  const {isLoading, data = [] } = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: () => getPokemonNamesWithId()
  })

  const { top } = useSafeAreaInsets();

  const pokemonNameIdList = useMemo(() => {
    if (!isNaN(Number(debouncedValue))) {
      const pokemon = data.find(pokemon => pokemon.id === Number(debouncedValue))
      return pokemon ? [pokemon] : []
    }

    if (debouncedValue.length === 0 || debouncedValue.length < 3) {
      return [];
    }

    return data.filter(pokemon => pokemon.name.toLocaleLowerCase().includes(debouncedValue.toLocaleLowerCase()))

  }, [debouncedValue]);

  const {isLoading: isLoadingPokemons, data: pokemons} = useQuery({
    queryKey: ['pokemons','by', pokemonNameIdList],
    queryFn: () => getPokemonByIds(pokemonNameIdList.map(poke => poke.id))
  })

  if (isLoading) {
    return <FullScreenLoader />
  }

  return (
    <View style={[globalTheme.globalMargin, { paddingTop: top + 10 }]}>
      <TextInput
        placeholder='Buscar Pokémon'
        mode='flat'
        autoFocus
        autoCorrect={false}
        onChangeText={setterm}
        value={term}
      />
      {
        isLoadingPokemons && <ActivityIndicator style={{ paddingTop: 20 }} />
      }

      <FlatList
        data={pokemons}
        keyExtractor={(test, index) => `${test.id}-${index}`}
        numColumns={2}
        style={{ paddingTop: top + 20 }}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

