<template>
  <div class="container-fluid">
    <section class="row">
<!-- STUB album details -->
      <div class="col-12 col-md-5 col-lg-3">
        <section v-if="album" class="row">
          <div class="col-6">
            <img :src="album.coverImg" class="album-cover"  :alt="album.title + ' cover image'">
          </div>
          <div class="col-6 fw-bold">
            <div class="bg-warning p-2 rounded">
              <p class="mb-1 text-white">
                {{ album.title }}
            </p>
            <p class="mb-1">
             by: {{ album.creator.name }}
            </p>
          </div>
          <ModalWrapper id="create-picture" btnColor="danger">
              <template #button>
                <div>add picture <i class="mdi mdi-plus-box-outline"></i></div>
              </template>
              <template #body>
                <PictureForm/>
              </template>
          </ModalWrapper>
          </div>
        </section>
      </div>
      <!-- STUB pictures -->
      <div class="col-12 col-md-7 col-lg-9">
        <div class="masonry-container">
          <img v-for="pic in pictures" :key="pic.id" :src="pic.imgUrl">
        </div>
      </div>

    </section>
  </div>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted } from 'vue';
import Pop from '../utils/Pop.js';
import { albumsService } from '../services/AlbumsService.js';
import { useRoute } from 'vue-router';
import ModalWrapper from '../components/ModalWrapper.vue';
import PictureForm from '../components/PictureForm.vue';
export default {
    setup() {
        const route = useRoute();
        onMounted(() => {
            getAlbumById();
            getPicturesByAlbumId();
        });
        async function getAlbumById() {
            try {
                await albumsService.getAlbumById(route.params.albumId);
            }
            catch (error) {
                Pop.error(error);
            }
        }
        async function getPicturesByAlbumId() {
            try {
                await albumsService.getPicturesByAlbumId(route.params.albumId);
            }
            catch (error) {
                Pop.error(error);
            }
        }
        return {
            album: computed(() => AppState.activeAlbum),
            pictures: computed(() => AppState.activeAlbumPictures)
        };
    },
    components: { ModalWrapper, PictureForm }
};
</script>


<style lang="scss" scoped>
.album-cover{
  width: 100%;
  aspect-ratio: 1/1;
  object-position: center;
  object-fit: cover;
  border-radius: 25px;
}

.masonry-container{
  $gap: 1.25em;
  columns: 200px;
  column-gap: $gap;
  img{
    border-radius: 10px;
    width: 100%;
    margin-bottom: $gap;
  }
}
</style>
