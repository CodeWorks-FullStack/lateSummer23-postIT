<template>
  <div class="container">
    <section class="row">
      <button class="btn btn-primary" @click="testSocket">test socket</button>
    </section>

    <section class="row">
      <!-- {{ myCollaborations }} -->
      <div v-for="collab in myCollaborations" :key="collab.id" class="col-6 col-md-2">
        <AlbumCard :album="collab.album"/>
      </div>
    </section>

    <!-- STUB filter bar -->
    <section class="row bg-info gap-2 p-2 rounded my-2">
      <!-- NOTE changing the ref value here recomputes the album computed -->
      <!-- <div class="col-12 bg-info d-flex p-2 rounded justify-content-between"> -->
        <button class="btn col btn-outline-light" @click="filterBy = ''">All</button>
        <button class="btn col btn-outline-light" @click="filterBy = 'animals'">Animals</button>
        <button class="btn col btn-outline-light" @click="filterBy = 'pugs'">Pugs</button>
        <button class="btn col btn-outline-light" @click="filterBy = 'games'">Games</button>
        <button class="btn col btn-outline-light" @click="filterBy= 'aesthetics'">Aesthetics</button>
        <button class="btn col btn-outline-light" @click="filterBy = 'misc'">Misc</button>
      <!-- </div> -->
    </section>

    <!-- STUB album cards -->
    <section class="row g-4">

      <div v-for="a in albums" :key="a.id" class="col-6 col-md-3">
        <!-- {{ a.title }} {{ a.creator.name }} -->
        <AlbumCard :album="a"/>
      </div>

    </section>
  </div>
</template>

<script>
import { computed, nextTick, onMounted, ref } from 'vue';
import Pop from '../utils/Pop.js';
import { albumsService} from '../services/AlbumsService.js'
import {AppState} from '../AppState.js'
import AlbumCard from '../components/AlbumCard.vue';
import { accountService } from '../services/AccountService.js';
import { socketService } from '../services/SocketService.js';

export default {
    setup() {
        onMounted(() => {
            getAlbums();
            // FIXME DO NOT GET THE ACCOUNTS INFO ON LOAD OF A PAGE
            // getMyCollaborations()
        });
        const filterBy = ref('')
        async function getAlbums() {
            try {
                await albumsService.getAlbums();
            }
            catch (error) {
                Pop.error(error);
            }
        }
        // async function getMyCollaborations(){
        //   try {
        //     await accountService.getMyCollaborations()

        //   } catch (error) {
        //     Pop.error(error)
        //   }
        // }
        return {
          filterBy,
            albums: computed(() => {
              // NOTE computeds can be multi-line but then need explicit returns
              if(!filterBy.value){
                return AppState.albums
              } else {
                return AppState.albums.filter(album => album.category == filterBy.value)
              }
            }),
            myCollaborations: computed(()=> AppState.myCollaborations),
            testSocket(){
              socketService.emit('SOCKET_TEST', 'anything 🧛')
            }
        };
    },
    components: { AlbumCard }
}
</script>

<style scoped lang="scss">

</style>
