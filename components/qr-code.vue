<template>
	<section class="w-full flex flex-col items-center gap-6">
  	<div ref="qrCode"></div>

   	<slot name="download" :pluginInstance="qrCodeStyling" />
	</section>
</template>

<script setup lang="ts">
import type QRCodeStyling from 'qr-code-styling';

const props = defineProps({
  data: String,
  image: { type: String, default: "" }
});

const { $qrCodeStyling } = useNuxtApp();
const qrCode = ref<HTMLElement | null>(null);

// Default options
const options = {
  width: 300,
  height: 300,
  type: "svg",
  data: props.data,
  image: props.image,
  dotsOptions: {
    color: "#000",
    type: "rounded"
  },
  backgroundOptions: {
    color: "#fff",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 10
  }
};

const qrCodeStyling = ref<QRCodeStyling>($qrCodeStyling(options));

onMounted(() => {
  if (!qrCode.value) return

  qrCodeStyling.value.append(qrCode.value);
  // Add viewbox to make it resizable
  qrCode.value!.firstChild!.setAttribute('viewBox', '0 0 300 300');
});

watch(() => props.data, (newValue: string) => {
  // Update QR code data when props change
  options.data = newValue;
  qrCodeStyling.value.update(options);
  // Add viewbox to make it resizable
  qrCode.value!.firstChild!.setAttribute('viewBox', '0 0 300 300');
});
</script>

<style scoped>
svg{
  width: 100%;
  height:100%;
}
</style>
