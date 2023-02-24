<script setup>
    import BaseModal from '@/components/BaseModal.vue'
    import { ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { uid }from 'uid'

    const showModal = ref(null);
    const storageCities = ref([]);
    const route = useRoute();
    const router = useRouter();

    const toggleModal = () => {
        showModal.value = !showModal.value;
    }

    const addCity = () => {
        if (localStorage.getItem('storageCities')) {
            storageCities.value = JSON.parse(localStorage.getItem('storageCities'))
        }

        const locationObj = {
            id : uid(),
            state : route.params.state,
            city : route.params.city,
            coordinates : {
                lat : route.query.lat,
                lng : route.query.lng
            }

        }

        storageCities.value.push(locationObj);
        
        localStorage.setItem('storageCities', JSON.stringify(storageCities.value));

        let query = Object.assign({}, route.query);
        delete query.preview;
        query.id = locationObj.id;
        router.replace({query});
    }
</script>

<template>
    <header class="sticky top-0 bg-weather-primary shadow-lg">
        <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6">
             <RouterLink :to="{name : 'home'}">
                 <div class="flex items-center gap-3 flex-1">
                    <i class="fa-solid fa-sun text-2xl"></i>
                    <strong class="text-2xl">Meteo Wallet</strong>
                 </div>
             </RouterLink>

             <div class="flex gap-3 flex-1 justify-end">
                <i @click="toggleModal" class="fa-solid fa-circle-info text-xl hover:text-weather-secondary duration-150 cursor-pointer"></i>
                <i v-if="route.query.preview" class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer" @click="addCity"></i>
             </div>

             <BaseModal :show-modal="showModal" @close-modal="toggleModal">
                <div class="text-black">
                    <h1 class="text-2xl mb-1">Info:</h1>
                    <p class="mb-4">
                        Meteo Wallet ti consente di tenere traccia delle previsioni meteorologiche delle città da te scelte.
                    </p>
                    <h2 class="text-2xl">Come funziona:</h2>
                    <ol class="list-decimal list-inside mb-4">
                        <li>
                        Cerca la tua città tramite l'apposito input di ricerca.
                        </li>
                        <li>
                        Seleziona una città tra i risultati per vedere le previsioni.
                        </li>
                        <li>
                        Clicca sull'icona "+" in alto a destra per aggiungere la città
                        al wallet in modo da non doverla ricercare.
                        </li>
                    </ol>

                    <h2 class="text-2xl">Rimuovi una città</h2>
                    <p>
                        Se vuoi eliminare una città dal tuo wallet basta cliccare
                        sul nome della città dalla homepage e cliccare sull'apposito pulsante in fondo alla pagina.
                    </p>
                </div>
            </BaseModal>
        </nav>
    </header>
</template>