<script setup>
    import axios from "axios";
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import CityCard from "./CityCard.vue";

    const openWeatherAPIkey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    const storageCities = ref([]);

    const getCities = async () => {
    if (localStorage.getItem("storageCities")) {
        storageCities.value = JSON.parse(
        localStorage.getItem("storageCities")
        );
        const requests = [];
        storageCities.value.forEach((city) => {
          requests.push(
              axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${city.coordinates.lat}&lon=${city.coordinates.lng}&appid=${openWeatherAPIkey}&units=metric`
              )
          );
        });

        const weatherData = await Promise.all(requests);
        // Flicker Delay
        await new Promise((res) => setTimeout(res, 1000));

        weatherData.forEach((value, index) => {
        storageCities.value[index].weather = value.data;
        });
    }
    };
    await getCities();
    const router = useRouter();
    const goToCityView = (city) => {
    router.push({
        name: "cityView",
        params: { state: city.state, city: city.city },
        query: {
        lat: city.coordinates.lat,
        lng: city.coordinates.lng,
        id: city.id
        },
    });
    };
</script>

<template>
  <div v-for="city in storageCities" :key="city.id">
    <CityCard :city="city" @click="goToCityView(city)" />
  </div>

  <p v-if="storageCities.length === 0">
    Nessuna location salvata. Cercane una tramite l'input di ricerca sopra.
  </p>
</template>