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
          <!-- STUB button to create an image -->
          <ModalWrapper id="create-picture" btnColor="danger">
              <template #button>
                <div>add picture <i class="mdi mdi-plus-box-outline"></i></div>
              </template>
              <template #body>
                <PictureForm/>
              </template>
          </ModalWrapper>
          </div>
          <!-- STUB collab button -->
          <div class="col-6 bg-info p-2 rounded">
            <p class="mb-0">{{ album.memberCount }}</p>
            <p class="mb-0">Collaborators</p>
          </div>
          <button v-if="!isCollaborator && user.isAuthenticated" :disabled="inProgress" @click="createCollab" role="button" class="col-6 bg-warning p-2 rounded"> Collab<i class="mdi mdi-heart"></i></button>
          <button v-else-if="user.isAuthenticated" @click="removeCollab" role="button" class="col-6 bg-danger p-2 rounded"> Un-Collab<i class="mdi mdi-heart"></i></button>
          <button v-else disabled role="button" class="col-6 btn btn-danger p-2 rounded" title="log in to collab">log in to collab<i class="mdi mdi-heart"></i></button>


          <!-- STUB collaborator images -->
          <div class="col-12">
            <img class="collab-image" v-for="collab in collaborators" :src="collab.profile.picture" :key="collab.id" alt="">
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
import { computed, reactive, onMounted, ref, onUpdated, watchEffect, onBeforeUnmount } from 'vue';
import Pop from '../utils/Pop.js';
import { albumsService } from '../services/AlbumsService.js';
import { useRoute } from 'vue-router';
import ModalWrapper from '../components/ModalWrapper.vue';
import PictureForm from '../components/PictureForm.vue';
import {collaboratorsService} from '../services/CollaboratorsService.js'
import {socketService} from '../services/SocketService.js'
import {authSockethandler} from '../handlers/AuthorizedHandler.js'
export default {
    setup() {
      const inProgress = ref(false)
        const route = useRoute();
        // NOTE we watcheffect here because a user can create a album from the navbar. and onMounted only runs when a page is initially loaded. If you push from a page to the same page but change params, the onMounted doesn't run. watchEffect Will
        watchEffect(() => {
            getAlbumById();
            getPicturesByAlbumId();
            getCollaboratorsByAlbumId();
            authSockethandler.emit('JOIN_ROOM', `album_${route.params.albumId}`)
        });
        onBeforeUnmount(()=>{
          socketService.emit('LEAVE_ROOM', `album_${AppState.activeAlbum.id}`)
        })
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
        async function getCollaboratorsByAlbumId(){
          try {
            await albumsService.getCollaboratorsByAlbumId(route.params.albumId)
          } catch (error) {
            Pop.error(error)
          }
        }
        return {
          inProgress,
            user: computed(()=> AppState.user),
            album: computed(() => AppState.activeAlbum),
            pictures: computed(() => AppState.activeAlbumPictures),
            collaborators: computed(()=> AppState.activeAlbumCollaborators),
            isCollaborator: computed(()=> AppState.activeAlbumCollaborators.find(collab => collab.accountId == AppState.account.id)),
            async createCollab(){
              try {
                inProgress.value = true
                let collabData = {albumId: route.params.albumId} // just creating a body with albumId on it equal to the route params
                await collaboratorsService.createCollab(collabData)
                inProgress.value = false
              } catch (error) {
                Pop.error(error)
              }
            },
            async removeCollab(){
              try {
                // NOTE need to find the collab in the appstate that is ours, and delete it by it's id
                let collab = AppState.activeAlbumCollaborators.find(collab => collab.accountId == AppState.account.id)
                await collaboratorsService.removeCollab(collab.id)
              } catch (error) {
                Pop.error(error)
              }
            }
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

.collab-image{
  width: 33%;
  aspect-ratio: 1/1;
  border-radius: 10px;
  object-fit: cover;
}
</style>
