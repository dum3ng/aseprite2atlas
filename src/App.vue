<script setup lang="ts">
import Button from 'primevue/button'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import { ref, computed } from 'vue'

const fileupload = ref<typeof FileUpload>()
const files = ref(null)
function onUpload() {}
function onFileSelect(e: FileUploadSelectEvent) {
  files.value = e.files
  console.log(e.files)
}
function upload() {}

const canConvert = computed(() => files.value !== null)
function convert() {}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper"></div>
  </header>

  <main>
    <Upload />
    <FileUpload
      ref="fileupload"
      mode="basic"
      name="demo[]"
      url="/api/upload"
      accept="image/*"
      :maxFileSize="1000000"
      @select="onFileSelect"
      @upload="onUpload"
    />
    <Button label="Upload" @click="upload" severity="secondary" />
    <Button label="Convert" @click="convert" severity="primary" :disabled="!canConvert" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
