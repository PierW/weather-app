<script setup>
    import { useRoute, useRouter } from 'vue-router'
    import axios from 'axios'

    const openWeatherAPIkey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    const route = useRoute();
    const router = useRouter();

    const getWeatherData = async () => {
        try {
            const weatherData = await axios.get(
                `https://api.openweathermap.org/data/3.0/onecall?lat=${route.query.lat}&lon=${route.query.lng}&units=metric&lang=it&appid=${openWeatherAPIkey}`
            );

            // cal current date & time
            const localOffset = new Date().getTimezoneOffset() * 60000;
            const utc = weatherData.data.current.dt * 1000 + localOffset;
            weatherData.data.currentTime =
            utc + 1000 * weatherData.data.timezone_offset;

            // cal hourly weather offset
            weatherData.data.hourly.forEach((hour) => {
            const utc = hour.dt * 1000 + localOffset;
            hour.currentTime =
                utc + 1000 * weatherData.data.timezone_offset;
            });

            // Flicker Delay
            await new Promise((res) => setTimeout(res, 1000));

            return weatherData.data;
        } catch (error) {
            console.log(error);
        }
    };

    const deleteLocation = () => {
        const cities = JSON.parse(localStorage.getItem("storageCities"));
        const updatedCities = cities.filter((city) => city.id !== route.query.id);

        localStorage.setItem("storageCities", JSON.stringify(updatedCities));

        router.push({
            name: "home"
        });
    }

    const weatherData = await getWeatherData();

</script>

<template>
    <div class="flex flex-col flex-1 items-center">
        <!-- Banner -->
        <div class="text-white p-4 bg-weather-secondary w-full text-center">
            <p>
                Clicca sul "+" per aggiungere questa città alla lista
            </p>
        </div>
        <!-- Overview -->
        <div class="flex flex-col text-white py-12 items-center">
            <h1 class="mb-12 text-4xl">
                {{ route.params.city }}
            </h1>
            <p class="text-sm mb-12">
                {{ 
                    new Date(weatherData.currentTime).toLocaleDateString(
                        "it-IT",
                        {
                            weekday: "long",
                            day: "2-digit",
                            month: "long"
                        }
                    )
                }}
                {{ 
                    new Date(weatherData.currentTime).toLocaleTimeString(
                        "it-IT",
                        {
                            timeStyle: "short"
                        }
                    )
                }}
            </p>
            <p class="mb-8 text-8xl">
                {{ Math.round(weatherData.current.temp) }}&deg;
            </p>
            <p>
                Percepiti:
                {{ Math.round(weatherData.current.feels_like) }} &deg;
            </p>
            <p class="capitalize">
                {{ weatherData.current.weather[0].description }}
            </p>
            <img :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`" alt="stato tempo" class="w-[150px] h-auto">
        </div>
        <hr class="border-white border-opacity-10 border w-full" />
        <!-- Tempo Orario -->
        <div class="max-w-screen-md w-full py-12">
            <div class="text-white mx-8">
                <h2 class="mb-4">Tempo Orario</h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <div v-for="hourData in weatherData.hourly" :key="hourData.dt" class="flex flex-col gap-4 items-center">
                        <p class="whitespace-nowrap tet-md">
                            {{ new Date(hourData.currentTime).toLocaleTimeString('it-IT', { hour: "numeric" }) }}
                        </p>
                        <img :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`" alt="stato tempo orario" class="w-auto h-[50px] object-cover">
                        <p class="text-xl">
                            {{ Math.round(hourData.temp) }}&deg;
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <hr class="border-white border-opacity-10 border w-full" />
        <!-- Tempo Settimanale -->
        <div class="max-w-screen-md w-full py-12">
          <div class="mx-8 text-white">
            <h2 class="mb-4">Meteo Settimanale</h2>
            <div
              v-for="day in weatherData.daily"
              :key="day.dt"
              class="flex items-center"
            >
              <p class="flex-1">
                {{
                    new Date(day.dt * 1000).toLocaleDateString(
                        "it-IT",
                        {
                            weekday: "long",
                        }
                    )
                }}
              </p>
              <img
                class="w-[50px] h-[50px] object-cover"
                :src="
                    `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
                "
                alt=""
              />
              <div class="flex gap-2 flex-1 justify-end">
                <p>{{ Math.round(day.temp.min) }}&deg;</p>
                <p>{{ Math.round(day.temp.max) }}&deg;</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Pulsante Eliminazione -->
        <div class="flex text-white gap-4 py-12 items-center hover:text-red-600 duration-150 cursor-pointer" @click="deleteLocation">
            <i class="fa-solid fa-trash"></i>
            <p>Elimina Location</p>
        </div>
    </div>
</template>