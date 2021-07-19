<template>
  <div class="error-page">
    <div class="error-page__content">
      <h1>Ooops...</h1>
      <p>A página que você procura não pode ser encontrada.</p>
      <NuxtLink to="/" class="link">
        <i class="bi-arrow-left"></i> Voltar para a página inicial
      </NuxtLink>
    </div>

    <div class="error-page__image">
      <img :src="imagePath" alt="erro img">
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    imagePath() {
      return require('~/assets/images/404.png')
    }
  }
}
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 95%;
  height: 73vh;
  padding: 120px 32px 32px 32px;
  margin-top: 52px;
}
.error-page__content,.error-page__image {
  display: flex;
  flex-direction: column;
  width: 40%;
}

.error-page__content {
  align-self: center;
  margin-top: -170px;
}
.error-page__content h1 {
  color: #285680;
}
.error-page__content p {
  color: rgba(0, 0, 0, 0.70);
  padding-bottom: 18px;
}

.link {
  font-size: 18px;
  text-decoration: none;
  outline: none;
  color: #3B97D3;
  transition: 0.3s ease-in-out;
}
.link:hover {
  color: #52BA9B;
  font-weight: 500;
}


/* @media screen and (min-width: 1441px) and (max-width: 1930px) {

} */

@media screen and (min-width: 1025px) and (max-width: 1440px) {
  .error-page {
    height: 74vh;
    padding-top: 120px;
  }
  .error-page__content {
    align-self: center;
    margin-top: -285px;
  }
}

@media screen and (min-width: 769px) and (max-width: 1024px) {
  .error-page {
    height: 75vh;
    padding-top: 50px;
  }
  .error-page__content {
    align-self: center;
    margin-top: -285px;
  }
  .error-page__content p {
    padding-bottom: 14px;
  }
  .link {
    font-size: 16px;
  }
}

@media screen and (min-width: 426px) and (max-width: 768px) {
  .error-page {
    height: 77vh;
    padding-top: 50px;
  }
  .error-page__content {
    align-self: center;
    margin-top: -332px;
  }
  .error-page__content p {
    padding-bottom: 14px;
  }
  .link {
    font-size: 16px;
  }
}

@media screen and (max-width: 425px) {
  .error-page {
    flex-direction: column-reverse;
    height: 87vh;
  }
  .error-page__content,.error-page__image {
    width: 100%;
  }
  .error-page__content {
    margin-top: 85px;
  }
}
</style>
