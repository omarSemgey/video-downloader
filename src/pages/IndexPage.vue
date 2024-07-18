<template>
  <q-page class="flex flex-center">
    <div>
      <h2>download any youtube video</h2>
      <q-input filled label="Youtube Link" v-model="link"></q-input>
      <q-btn @click="downloadVideo">Download video</q-btn>
    </div>
  </q-page>
</template>

<script>
import { useMeta } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  setup () {

    const pageMetadata = {
      title: 'video downloader',
    };
    useMeta(pageMetadata);
  },
  data(){
    return{
      link:"",
    }
  },
  methods: {
    async downloadVideo(){
      try{
        this.$q.loading.show({
          message:"downloading your video..."
        });
        // const title = await this.$axios.post('http://localhost:5000/youtube/getTitle',
        // {link:this.link}
        // );
        // console.log(title.data);

        const video = await this.$axios.post('http://localhost:5000/youtube/downloadingVideo',
        {link:this.link},
        {
          responseType: 'blob',
        }
        );
        //creating url from the stream that is coming from the server
        const url = window.URL.createObjectUrl(new Blob([video.data]));
        //create a link
        const link = document.createElement('a');
        //give a link the href of the url
        link.href=url;
        //give the link the download attribute and give tha file that is going to be downloaded to the video title
        link.setAttribute('download',`${title.data}.mp4`);
        //put the link in the body
        document.body.appendChild(link);
        //simulate a click
        link.click();
      }
      catch(err){
        console.log(err);
      }
      this.$q.loading.hide();
    }
  }
})
</script>
