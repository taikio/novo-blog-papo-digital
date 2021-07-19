<template>
  <figure v-if="imageName">
    <img :src="imagePath" alt="Trulli">
  </figure>
</template>

<script>
export default {
  props: {
    imageName: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    imagePath() {
      if (this.imageName) {
        return require(`~/assets/images/post-gallery/${this.imageName}`)
      }
      return ''
    }
  },
  created() {
    console.log('image-box', this.imageName)
  },
}
</script>

<style scoped>
figure {
  width: 100%;
  border-radius: 4px;
  padding: 0;
  margin: 0;
}
img {
  width: 100%;
}
figcaption {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.70);
  text-align: center;
}
</style>
