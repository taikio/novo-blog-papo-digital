<script lang="ts" setup>
import generateMeta from '@/utils/generateMeta'
import QrCode from '@/components/qr-code.vue'
import ImageUpload from '@/components/image-upload.vue'

const inputQRCodeValue = ref('')
const hasInputError = ref(false)
const isQRCodeGenerated = ref(false)
const imageUrl = ref('')

const pageTitle = 'Gerador de QR Code | Papo Digital'
const pageDescription = `Crie QR Codes únicos, GRÁTIS! Além de ser 100% gratuito, você pode inserir imagens no QR Code para personalizá-lo e deixá-lo com a sua cara.`
const pageUrl = 'https://papodigital.net.br/gerador-qr-code'

const pageMetaTags = generateMeta({
  pageTitle,
  description: pageDescription,
  contentType: 'website',
  url: pageUrl,
  twitterUrl: pageUrl,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})

useHead({
  title: pageTitle,
  meta: pageMetaTags,
})

const onChangeImage = (img: string | null) => {
	imageUrl.value = img ?? ''
}

const onChangeInputValue = (event: InputEvent) => {
	const element = event.target as HTMLInputElement
	const newValue = element.value
	hasInputError.value = !newValue.length
}

const generateQRCode = () => {
	if (!inputQRCodeValue.value) {
		hasInputError.value = true
		return
	}
	hasInputError.value = false
	isQRCodeGenerated.value = true
}

const generateNew = () => {
	isQRCodeGenerated.value = false
	inputQRCodeValue.value = ""
	imageUrl.value = ""
}
</script>

<template>
  <div>
    <header class="z-20 flex w-full flex-col-reverse px-8 pt-2 md:flex-row">
      <div class="mt-4 md:mt-40">
        <h2 class="text-2xl text-dark-purple-500 md:text-4xl">
          Gerador de QR Code
        </h2>

        <p class="text-md my-3 text-black-400 md:my-8 md:text-lg">
          Crie QR Codes únicos, GRÁTIS! <br /><br />
          Além de ser 100% gratuito, você pode inserir imagens no QR Code para personalizá-lo e deixá-lo com a sua cara.
        </p>
      </div>

      <img
        src="/cover-page-qr-code.png"
        alt="Gerador de CPF"
        class="mx-auto w-10/12 md:w-5/12"
      />
    </header>

    <!-- ===== generator container ===== -->
    <section
    	v-if="!isQRCodeGenerated"
      class="flex w-full flex-col items-center px-8 py-4 md:py-2 md:px-40"
    >
      <div class="flex flex-col gap-2 mt-8 w-full">
        <span
          class="text-black-400"
        >
          Informe o conteúdo
        </span>
        <input
          id="input-qr-code-value"
          type="text"
          v-model="inputQRCodeValue"
          placeholder="URL ou Texto"
          autocomplete="off"
          class="duration-50 w-full rounded-xl border py-2 pr-9 pl-2 text-sm shadow-lg transition-all focus:outline-none focus:ring md:py-3 md:pr-12 md:pl-4 md:text-xl"
          :class=" hasInputError ? ['border-red-500', 'focus:ring-red-300'] : ['focus:ring-primary-500']"
          @input="onChangeInputValue"
        />
      </div>

      <div class="w-full flex items-center justify-between my-10">
      	<div class="w-2/3 flex flex-col">
       		<h3 class="text-black-500 font-semibold text-2xl">Carregue uma imagem</h3>
         	<p class="text-black-400 mt-3">
          	Caso queira, você pode carregar uma imagem como um ícone ou uma logo para ser inserida no centro do QR Code.
          </p>
          <p class="text-black-400 font-semibold mt-3">
         		Importante: os formatos suportados são jpg, png e svg.
           O tamanho máximo suportado é 6 MB.
          </p>
       	</div>

        <div class="w-96">
        	<image-upload :initial-image-url="imageUrl" @change-image="onChangeImage">
         		<div class="px-2 py-6">
	         		<button
		             type="button"
		             class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
		           >
		             Carregar Imagem
		           </button>
           	</div>
         	</image-upload>
        </div>
      </div>

      <!-- ===== Button generate CPF ===== -->
      <button
        type="button"
        class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
        @click="generateQRCode()"
      >
        Gerar QR Code
      </button>
    </section>

    <!-- ===== Generated QR Code Container ===== -->
    <section
    	v-else
    	class="flex w-full flex-col items-center gap-6 px-8 py-4 md:py-2 md:px-40"
    >
    	<qr-code :data="inputQRCodeValue" :image="imageUrl">
    		<template #download="{ pluginInstance }">
			    <button
			      type="button"
			      class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
			      @click="() => pluginInstance.download()"
			    >
			      Baixar QR Code
			    </button>
      	</template>
     	</qr-code>


			<button
	      type="button"
	      class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
	      @click="generateNew()"
	    >
	      Gerar um novo
	    </button>
    </section>

    <!-- ===== Page Description ===== -->
    <section class="mt-48 flex w-full flex-col gap-6 px-8">
      <h2 class="text-xl text-black-500 md:text-2xl">
        O que é um QR Code?
      </h2>
      <p class="text-xs text-black-400 md:text-lg">
        O QR Code, ou "Quick Response Code" (Código de Resposta Rápida), é um tipo de código de barras bidimensional que pode ser escaneado
        usando a câmera de um smartphone ou dispositivo específico. Diferente dos tradicionais códigos de barras lineares, que armazenam
        informações apenas na horizontal, o QR Code armazena dados tanto na horizontal quanto na vertical, permitindo que muito mais informação
        seja compactada em um pequeno espaço.
      </p>
      <p class="text-xs text-black-400 md:text-lg">
      	Esses códigos são facilmente identificáveis por sua forma quadrada, composta por pequenos módulos pretos e brancos.
       	Eles podem conter diversas informações, como URLs, números de telefone, textos simples, contatos, ou até mesmo dados de pagamento.
        Graças à sua versatilidade, o QR Code se tornou uma ferramenta essencial para diversos setores, incluindo marketing, pagamentos,
        e até mesmo no combate à falsificação de produtos.
      </p>

      <h2 class="text-xl text-black-500 md:text-2xl">
        Como os QR Codes Funcionam?
      </h2>
      <p class="text-xs text-black-400 md:text-lg">
      	O funcionamento de um QR Code é bastante simples, mas a tecnologia por trás dele é sofisticada. Ao criar um QR Code,
       	você está essencialmente codificando informações em um padrão específico de módulos (os quadradinhos pretos e brancos).
        Quando um dispositivo, como um smartphone, escaneia o código, ele lê o padrão desses módulos e converte essa informação em algo legível,
        como um link para um site ou um texto.
      </p>
      <p class="text-xs text-black-400 md:text-lg">
      	Os QR Codes são compostos por três grandes quadrados localizados nos cantos superiores e no canto inferior esquerdo.
       	Estes são chamados de "padrões de localização", e sua função é permitir que o leitor de QR Code identifique corretamente a orientação
        e o ângulo do código. Há também uma série de outros módulos menores que contêm a informação real que está sendo codificada.
      </p>
      <p class="text-xs text-black-400 md:text-lg">
      	Além disso, os QR Codes possuem um recurso de correção de erros, que permite que o código seja lido corretamente mesmo que esteja
       	danificado ou sujo em até 30% de sua área. Isso é crucial para garantir que a informação contida no QR Code possa ser acessada em
        condições adversas.
      </p>

      <h2 class="text-xl text-black-500 md:text-2xl">
        Quando Esta Tecnologia Foi Inventada?
      </h2>
      <p class="text-xs text-black-400 md:text-lg">
      	A tecnologia do QR Code foi inventada em 1994 pela empresa japonesa Denso Wave, que é uma subsidiária da Toyota.
       	A necessidade surgiu porque a Toyota precisava de uma forma mais eficiente de rastrear peças automotivas durante o processo de manufatura.
        O código de barras tradicional não era suficiente, pois não conseguia armazenar a quantidade de informações necessárias.
      </p>
      <p class="text-xs text-black-400 md:text-lg">
      	Inicialmente, o QR Code foi utilizado apenas na indústria automotiva, mas com o passar dos anos, sua aplicação se expandiu para diversas
       	outras áreas, especialmente com a popularização dos smartphones. O que antes era uma ferramenta industrial tornou-se um elemento comum
        no dia a dia das pessoas, utilizado em campanhas de marketing, pagamentos digitais, e até em certificados de autenticidade de produtos.
      </p>
      <p class="text-xs text-black-400 md:text-lg">
      	A invenção do QR Code revolucionou a forma como interagimos com o mundo digital e físico, criando uma ponte simples e rápida entre o que
       	vemos no mundo real e as informações online.
      </p>
    </section>
  </div>
</template>
