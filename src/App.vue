<script setup lang="ts">
import Button from 'primevue/button'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import { ref, computed } from 'vue'
import { convert as convertJson } from '@/base/convert'

const fileupload = ref<typeof FileUpload>()
const files = ref(null)
const plist = ref('')
function onFileSelect(e: FileUploadSelectEvent) {
  files.value = e.files
  console.log(e.files)
}

const plistFile = ref()
const filename = ref('')
const canConvert = computed(() => files.value !== null)

function convert() {
  const file: File = files.value![0]
  const reader = new FileReader()
  reader.readAsText(file, 'utf8')
  const basename = file.name.replace(/\..+$/, '')
  filename.value = `${basename}.plist`
  reader.onload = (ev) => {
    const str = reader.result as string
    const plistStr = convertJson(str, file.name)
    plist.value = plistStr
    const blob = new File([plistStr], filename.value, { type: 'application/plist' })
    const objUrl = URL.createObjectURL(blob)
    plistFile.value = objUrl
  }
}
function download() {}
const canDownload = computed(() => plistFile.value !== undefined)
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper"></div>
  </header>

  <main>
    <FileUpload
      ref="fileupload"
      mode="basic"
      name="demo[]"
      url="/api/upload"
      accept=".json"
      :maxFileSize="1000000"
      @select="onFileSelect"
    />
    <Button label="Convert" @click="convert" severity="primary" :disabled="!canConvert" />
    <a :href="plistFile" :disabled="!canDownload" :download="filename">
      <Button label="Download" @click="download" severity="contrast" :disabled="!canDownload" />
    </a>
    <div>
      <h3>plist converted</h3>
      <code v-if="plist !== ''">
        <pre>{{ plist }}</pre>
      </code>
    </div>
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
