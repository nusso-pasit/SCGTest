<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Suquence Of Number:"
        label-for="input-1"
        description="Enter sequence of number and variable x,y,z"
      >
        <b-form-input
          id="input-1"
          v-model="form.inputRaw"
          type="text"
          required
          placeholder="X,Y,4,5,6,Z"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ result }}</pre>
    </b-card>
  </div>
</template>

<script>
import ScgService from '@/api-services/scg.service'
export default {
  data() {
    return {
      form: {
        inputRaw: 'X, 5, 9, 15, 23, Y, Z',
      },
      result: 'Please enter and submit the input.',
      show: true
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      console.log(this.form.inputRaw)
      ScgService.calxyz(this.form.inputRaw).then((response) => {
        this.result = JSON.stringify(response.data.outputs);
      })
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.inputRaw = ''
      // Trick to reset/clear native browser form validation state
      this.result = 'Please enter and submit the input.'
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>