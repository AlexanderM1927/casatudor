<template>
    <div class="footer">
        <div class="footer__column">
            <h4 class="text-centered">CasaTudor</h4>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore totam excepturi, dicta voluptates dignissimos enim accusantium sequi mollitia corporis ab in sit quia nesciunt ipsam commodi voluptas iusto, nihil nisi?</p>
        </div>
        <div class="footer__column text-centered">
            <h4>Enlaces de interes</h4>
            <ul class="footer__links">
                <li>
                    <a href="">Quienes somos?</a>
                </li>
                <li>
                    <a href="">Tienda</a>
                </li>
                <li>
                    <a href="">Login</a>
                </li>
            </ul>
        </div>
        <div class="footer__column">
            <h4 class="text-centered">Redes sociales</h4>
            <div class="footer__social-media">
                <a href="https://wa.me/573164510766" target="_blank">
                    <Icon name="mdi:whatsapp" />
                </a>
                <a href="https://wa.me/573164510766" target="_blank">
                    <Icon name="mdi:facebook" />
                </a>
                <a href="https://wa.me/573164510766" target="_blank">
                    <Icon name="mdi:instagram" />
                </a>
            </div>
        </div>
    </div>
</template>
<script>
</script>

<style lang="scss" scoped>
@import "../styles/_colors.scss";
@import "../styles/_breakpoints.scss";
.footer {
    padding: 5rem;
    padding-top: 7rem;
    padding-bottom: 7rem;
    color: white;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    background: $darkBlue;
}

.footer__column {
    flex: 1 1 0;
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .footer {
        flex-direction: column;
    }
}

.footer__social-media {
    font-size: 2rem;
    display: flex;
    justify-content: center;
}

.footer__social-media a {
    color: white;
    text-decoration: none;
}

.footer__links {
    list-style: none;
    padding-left: 0;
}

.footer__links li a {
    color: white;
    opacity: 0.5;
}

.footer__links li a:hover {
    opacity: 1;
}
</style>