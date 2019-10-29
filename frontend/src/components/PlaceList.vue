<template>
  <div>
    <b-card
      class="mt-3"
      v-for="place in places"
      :key="place.id"
      :title="place.name"
      :sub-title="place.rating"
    >
    </b-card>
  </div>
</template>
<script>

import ScgService from '@/api-services/scg.service'
export default {
  name: 'PlaceList',
  data() {
    return {
      places: []
    }
  },
  created() {
    ScgService.findPlace().then((response) => {
      this.places = response.data.results.filter((item) => {
        return (item.photos !== undefined)
      }).map((item) => {
        return {
          id: item.id,
          name: item.name,
          icon: item.icon,
          rating: "rating : "+item.rating        }
      })
    })
  }
}
</script>
<style scoped>
p {
  font-weight: bold;
  font-size: 50px;
  text-align: center;
  color: #f10b0b;
}
</style>
