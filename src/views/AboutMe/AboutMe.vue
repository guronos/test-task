<template>
    <div>
    <div class="header">Обо мне</div>
  <div class="container">
    <div class="image">
        <img src="https://picsum.photos/580/360" alt="Случайное изображение">
    </div>
    <div class="main">
<div class="name">Самойлин Вадим</div>
<div class="age">29 лет</div>
<p>Привет!</p>
<p> С моим резюме можно ознакомится по <a href="https://stavropol.hh.ru/applicant/resumes/view?resume=bd6bc8dfff038f89b20039ed1f41306b303033" title="Резюме">ссылке</a>.<br>
    Увидеть мои pet-project можно на <a href="https://github.com/guronos" title="Github">GitHub</a>
</p>
<ul>
Основные навыки:
<li>HTML, CSS;</li>
<li>JavaScript;</li>
<li>Vue.js/Vuex;</li>
<li>Опыт работы с фреймворками Vuetify, Bootstrap (теперь знаком и с PrimeVue);</li>
<li>умение работать с авторизацией (JWT);</li>
<li>Работа с Git;</li>
<li>Компетентный пользователь Linux систем;</li>
<li>опыт работы с WordPress (REST API);</li>
<li>Базовые знания языка Python;</li>
<li>Основы backend разработки (фреймворк FastApi (Python)).</li>
</ul>
    </div>
  </div>
</div>
</template>
<style>
.container {
    display: flex;
    align-items: center;
    justify-content: flex-start;;
}
.image {
    width: 30vw;
    height: 360px;
    background: #a89f9f;
}
img {
    width: 100%;
}
.header {
    font-size: 28px;
    font-weight: 600;
    color:rgba(78, 87, 212, 0.884);
    margin-bottom: 3rem;
}
.name, .age {
    font-size: 26px;
    font-weight: 600;
    color: rgb(66, 68, 70);
}
.main {
    text-align: left;
    padding: 0 2vw;
    font-size: 20px;
    font-weight: 300;
}
</style>
