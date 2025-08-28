<template>
    <div class="about-main-container">
        <div class="about-item logo">
            <img src="../../img/logo.png" alt="logo" width="150px">
            <ul>
                <li>{{t('about.main.first')}}</li>
                <li>{{t('about.main.second')}}</li>
                <li>{{t('about.main.third')}}</li>
            </ul>
        </div>
        <div class="about-item mvp">
            <img src="../../img/roudmap/rm1.png" alt="mvp" class="roudmap-img" >
            <div class="inner-container">
                <h3>{{t('about.mvp.title')}}</h3>
                <ul>
                    <li>{{t('about.mvp.first')}}</li>
                    <li>{{t('about.mvp.second')}}</li>
                    <li>{{t('about.mvp.third')}}</li>
                </ul>
            </div>
        </div>
        <div class="about-item mmm1">
            <div class="inner-container">
                <h3>{{t('about.verFull.title')}}</h3>
                <ul>
                    <li>{{t('about.verFull.first')}}</li>
                    <li>{{t('about.verFull.second')}}</li>
                    <li>{{t('about.verFull.third')}}</li>
                    <li>{{t('about.verFull.fourth')}}</li>
                </ul>
            </div>
            <img src="../../img/roudmap/rm2.png" alt="mvp" class="roudmap-img" >
        </div>
        <div class="about-item mmm1+">
            <img src="../../img/roudmap/rm3.png" alt="mvp" class="roudmap-img" >
            <div class="inner-container">
                <h3>{{t('about.verFullExt.title')}}</h3>
                <ul>
                    <h5>{{t('about.verFullExt.header')}}</h5>
                    <li>{{t('about.verFullExt.first')}}</li>
                    <li>{{t('about.verFullExt.second')}}</li>
                    <li>{{t('about.verFullExt.third')}}</li>
                    <li>{{t('about.verFullExt.fourth')}}</li>
                    <li>{{t('about.verFullExt.fifth')}}</li>
                </ul>
            </div>
        </div>
        <div class="about-item socials">
            <div>
                <h3>{{t('about.social.title')}}</h3>
                <img class="roudmap-img" src="../../img/qr_tg.png" alt="qr_tg" >
            </div>
            <div class="links">
                <ul>
                    <li>
                        <span>{{t('about.social.tg')}}</span>
                        <br>
                        <a href="https://t.me/GideonsHideout" alt="t.me/GideonsHideout">{{t('about.social.tgLink')}}</a>
                    </li>
                    <li>
                        <span>{{t('about.social.git')}}</span>
                        <br>
                        <a href="https://github.com/GideonCrypto" alt="github.com/GideonCrypto">{{t('about.social.gitLink')}}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { i18n } from '../../locales/i18n'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()
</script>

<style scoped>
    .about-main-container {
        display: grid;
        padding: 10px;
        gap: 5px;
        height: 100vh;
        overflow: auto;
        overflow-y: auto;
        width: 100%;
    }

    .about-item {
        padding: 10px;
        border-top: 2px solid var(--border-color);
        display: flex;
        align-items: center;
        width: 100%;
    }

    .inner-container {
        display: grid;
        margin-left: 10px;
        width: 100%;
    }

    .logo {
        border: none;
    }

    .roudmap-img {
        width: 300px; 
        border: 2px solid var(--border-color);
    }

    img {
        border-radius: 8px;
    }

    h3 {
        padding-bottom: 5px;
    }

    .socials {
        display: flex;
        align-items: flex-start;
    }
    
    .links {
        margin: 25px;
    }
    
    a {
        color: blue;
        text-decoration: underline;
    }

    ul {
        padding: 10px 0;
    }

    li {
        padding: 10px;
    }
</style>