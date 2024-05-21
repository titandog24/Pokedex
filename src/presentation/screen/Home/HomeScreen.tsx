import { StyleSheet, View } from 'react-native'
import { getPokemons } from '../../../actions'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { PokeBallBg } from '../../components/ui/PokeballBg'
import { FlatList } from 'react-native-gesture-handler'
import { FAB, Text, useTheme } from 'react-native-paper'
import { globalTheme } from '../../../config/theme/global-theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PokemonCard } from '../../components/pokemons/PokemonCard'
import { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from '../../navigator/StackNavigator'

interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'>{}


export const HomeScreen = ({navigation, route}:Props) => {

  const { top } = useSafeAreaInsets();
  const QueryCliente = useQueryClient();

  const theme = useTheme();

  //Petición básica usando TanStack
  // const { isLoading, data: pokemons = [] } = useQuery({
  //   queryKey: ['pokemons'],
  //   queryFn: () => getPokemons(0),
  //   staleTime: 1000 * 60 * 60, // 60 minutos
  // });  

  const { isLoading, data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['pokemons', 'infinite'],
    initialPageParam: 0,

    staleTime: 1000 * 60 * 60, // 60 minutos
    queryFn: async (params) => {
      const pokemonGet = await getPokemons(params.pageParam);
      pokemonGet.forEach(pokemon => {
        QueryCliente.setQueryData(['pokemon', pokemon.id], pokemon);
      });

      return pokemonGet;
    },
    getNextPageParam: (lastPage, pages) => pages.length,
  });

  return (
    <View style={globalTheme.globalMargin}>
      <PokeBallBg style={styles.imgPosition} />
      <FlatList
        data={data?.pages.flat() ?? []}
        keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
        numColumns={2}
        style={{ paddingTop: top + 20 }}
        ListHeaderComponent={() => <Text variant='displayMedium'>
          Pokédex
        </Text>}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        onEndReachedThreshold={0.5}
        onEndReached={() => fetchNextPage()}
        showsVerticalScrollIndicator={false}
      />
      <FAB
      label={'Buscar'}
      style={[globalTheme.fab, {backgroundColor: theme.colors.primary}]}
      mode='elevated'
      color={theme.dark ? 'black': 'white'}
      onPress={() => navigation.navigate('SearchScreen')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  imgPosition: {
    position: 'absolute',
    top: -100,
    right: -100
  }
});