<template>
  <!-- NOTE two different ways to set up the to props for a router-link -->
  <!-- <router-link :to="{name: 'Album Details', params: {albumId: album.id}}"> -->
    <router-link :to="{path: `albums/${album.id}`}">
    <div class="card album-card">
      <img :src="album.coverImg" alt="">
      <div>
        <p class="text-center fw-bold">{{ album.title }}</p>
      </div>
    </div>
  </router-link>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted } from 'vue';
import { Album } from '../models/Album.js';
export default {
  props: {album: {type: Album, required: true}},
  setup(){
  return {  }
  }
};
</script>


<style lang="scss" scoped>
.album-card{
  img{
    height: 30vh;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
}
</style>
