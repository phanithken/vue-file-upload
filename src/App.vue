<template>
  <div id="app">
    <video ref="streamVideo" id="streamVideo" autoplay loop></video><br>
    <button v-stream:click="capture$">Capture</button>
    <button v-stream:click="record$">Record</button>
    <button v-stream:click="stopRecord$">Stop Recording</button>
    <router-view/>
  </div>
</template>

<script>
import { Subject, from, interval, async } from 'rxjs'
import { map } from 'rxjs/operators'
import * as API from '@/services/firebase'
export default {
  name: 'app',
  subscriptions: function () {
    this.capture$ = new Subject()
    this.record$ = new Subject()
    this.stopRecord$ = new Subject()

    this.record$.subscribe(event => {
      this.recordVideo()
    })

    this.capture$.subscribe(event => {
      this.takePhoto()
    })

    this.stopRecord$.subscribe(event => {
      this.stopRecording()
    })
  },
  mounted: function () {
    from(navigator.mediaDevices.getUserMedia({ video: true }))
      .subscribe(stream => {
        this.$refs.streamVideo.srcObject = stream
        this.$refs.streamVideo.play()
      })
  },
  data: function () {
    return {
      recorder: null
    }
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
    },

    recordVideo: async function () {
      console.log('record video')
      let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      this.recorder = new RecordRTCPromisesHandler(stream, {
        type: 'video'
      })
      this.recorder.startRecording()
    },

    stopRecording: async function () {
      console.log('stop recording')

      await this.recorder.stopRecording()
      let blob = await this.recorder.getBlob()

      console.log(blob)

      API.uploadVideo(blob)
        .subscribe(v => {
          console.log('upload video')
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
