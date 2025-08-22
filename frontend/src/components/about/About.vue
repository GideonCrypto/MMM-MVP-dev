<template>
    <div class="about-main-container">
        <div class="about-item logo">
            <img src="../../img/logo.png" alt="logo" width="150px">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo natus ducimus id accusantium sint a laborum laudantium aliquam illum, quis animi optio iure nobis dolor. Nisi reprehenderit iste omnis laboriosam.</p>
        </div>
        <div class="about-item mvp">
            <img src="../../img/roudmap/rm1.png" alt="mvp" class="roudmap-img" >
            <div class="inner-container">
                <h3>About MMM MVP</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint vero fuga quae doloremque molestias. In quod quia ipsum esse laborum unde laudantium modi voluptas quibusdam, autem, suscipit deleniti dolorum dolorem.
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque reprehenderit quae natus corrupti sit reiciendis hic, molestiae iusto unde veniam animi. Veritatis animi omnis nulla quae minima quam repudiandae doloribus!
                </p>
            </div>
        </div>
        <div class="about-item mmm1">
            <div class="inner-container">
                <h3>About MMM 1.0</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint vero fuga quae doloremque molestias. In quod quia ipsum esse laborum unde laudantium modi voluptas quibusdam, autem, suscipit deleniti dolorum dolorem.
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque reprehenderit quae natus corrupti sit reiciendis hic, molestiae iusto unde veniam animi. Veritatis animi omnis nulla quae minima quam repudiandae doloribus!
                </p>
            </div>
            <img src="../../img/roudmap/rm2.png" alt="mvp" class="roudmap-img" >
        </div>
        <div class="about-item mmm1+">
            <img src="../../img/roudmap/rm3.png" alt="mvp" class="roudmap-img" >
            <div class="inner-container">
                <h3>About MMM 1.0+</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint vero fuga quae doloremque molestias. In quod quia ipsum esse laborum unde laudantium modi voluptas quibusdam, autem, suscipit deleniti dolorum dolorem.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint vero fuga quae doloremque molestias. In quod quia ipsum esse laborum unde laudantium modi voluptas quibusdam, autem, suscipit deleniti dolorum dolorem.
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque reprehenderit quae natus corrupti sit reiciendis hic, molestiae iusto unde veniam animi. Veritatis animi omnis nulla quae minima quam repudiandae doloribus!
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint vero fuga quae doloremque molestias. In quod quia ipsum esse laborum unde laudantium modi voluptas quibusdam, autem, suscipit deleniti dolorum dolorem.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint vero fuga quae doloremque molestias. In quod quia ipsum esse laborum unde laudantium modi voluptas quibusdam, autem, suscipit deleniti dolorum dolorem.
                    Lorem
                </p>
            </div>
        </div>
        <div class="about-item socials">
            <h3>Join me in:</h3>
            <a href="https://github.com/">Telegramm</a>
            <a href="https://github.com/">Github</a>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
    .about-main-container {
        display: grid;
        padding: 10px;
        gap: 5px;
        height: 100vh;
        overflow: auto;
        overflow-y: auto;
    }

    .about-item {
        padding: 10px;
        border-top: 2px solid var(--border-color);
        display: flex;
        align-items: center;
    }

    .inner-container {
        display: grid;
        margin-left: 10px;
    }

    .logo {
        border: none;
    }

    .roudmap-img {
        border-radius: 8px;
        width: 300px; 
        border: 2px solid var(--border-color);
    }

    h3, p {
        padding-bottom: 5px;
    }

    .socials {
        display: grid;
    }
    
    a {
        padding-top: 5px;
    }
</style>