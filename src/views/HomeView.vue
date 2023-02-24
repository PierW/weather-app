<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import CityList from "../components/CityList.vue";
  import CityCardSkeleton from '../components/CityCardSkeleton.vue';

  const querySearch = ref('');
  const lazyTime = ref(null);
  const mapBoxAPIKey = import.meta.env.VITE_MAPBOX_API_KEY;
  const mapBoxSearchResults = ref(null);
  const searchError = ref(null);
  const router = useRouter();

  // Chiamata API per Geocoding MapBox con delay di mezzo secondo.
  const getSearchResults = () => {
    lazyTime.value = setTimeout(async () => {
      clearTimeout(lazyTime.value);
      if(querySearch.value !== ""){
        try {
          const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${querySearch.value}.json?types=place&access_token=${mapBoxAPIKey}`);
          mapBoxSearchResults.value = result.data.features;   
        } catch {
          searchError.value = true;
        }
        return;
      }
      mapBoxSearchResults.value = null;
    }, 500);
  };

  const previewCity = (searchResult) => {
    const [city, state] = [
      searchResult.context[0].text,
      searchResult.context[1].text
    ];
    router.push({
      name: 'cityView',
      params: {state: state.replaceAll(" ", ""), city: city}, //Fix per spazi bianchi
      query: {
        lat: searchResult.geometry.coordinates[1],
        lng: searchResult.geometry.coordinates[0],
        preview: true
      }
    });
  }

</script>

<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input v-model="querySearch" @input="getSearchResults" type="text" class="border-b py-2 px-1 w-full bg-transparent focus:outline-none focus:border-weather-secondary focus:shadow-[0_1px_0_0_#004E71]" placeholder="Inserisci una città">
      <ul v-if="mapBoxSearchResults" class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]">
        <p v-if="searchError">Qualcosa è andato storto, riprova.</p>
        <p v-if="!searchError && mapBoxSearchResults.length === 0">Non sono stati trovati risultati. Riprova.</p>
        <template v-else>
          <li v-for="searchResult in mapBoxSearchResults" :key="searchResult.id" class="py-2 px-4 cursor-pointer" @click="previewCity(searchResult)">
            {{ searchResult.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <!-- List Meto Card -->
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>
