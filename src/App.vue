<template>
  <div id="app">
    <video ref="streamVideo" id="streamVideo" autoplay loop></video><br>
    <button v-stream:click="capture$">Capture</button>
    <button>Record</button>
    <router-view/>
  </div>
</template>

<script>
import { Subject, from, interval } from 'rxjs'
import { map } from 'rxjs/operators'
import * as API from '@/services/firebase'
export default {
  name: 'app',
  subscriptions: function () {
    this.capture$ = new Subject()
    this.capture$.subscribe(event => {
      this.takePhoto()
    })
  },
  mounted: function () {
    from(navigator.mediaDevices.getUserMedia({ video: true }))
      .subscribe(stream => {
        this.$refs.streamVideo.srcObject = stream
        this.$refs.streamVideo.play()
      })
  },
  methods: {
    takePhoto: function () {
      var ctx, canvas
      canvas = document.createElement('canvas')
      ctx = canvas.getContext('2d')
      ctx.drawImage(this.$refs.streamVideo, 0, 0, canvas.width, canvas.height)

      // prepare image data for upload
      var imageData = canvas.toDataURL('image/png')

      API.uploadImage(imageData)
        .subscribe(v => {
          console.log('upload image')
          console.log(v)
        })
    }
  }
}
</script>


<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
button {
  padding: 10px 20px;
  margin-right: 15px;
}
</style>
