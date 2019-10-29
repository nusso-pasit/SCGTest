<template>
  <b-container id="app">
    <b-row class="fixed-top">
      <b-col>
        <navbar />
      </b-col>
    </b-row>
    <b-row class="paddertop">
      <b-col>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <router-view />
      </b-col>
    </b-row>
    <b-row class="padderbot">
      <b-col>
      </b-col>
    </b-row>
    <b-row class="fixed-bottom">
      <b-col>
        <Footer />
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default {
  name: 'App',
  components: {
    Navbar,Footer
  }
}
</script>
<style>
  .paddertop {
    height: 60px;
  }
  .padderbot {
    height: 100px;
  }
</style>
