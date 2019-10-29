import Axios from 'axios'

export default {
  findPlace () {
    return Axios.get('/gmapsearch', { crossdomain: true })
  },

  calxyz (inputstring) {
    return Axios.get(`/xyz/?input_raw=${inputstring}`)
  }
}
