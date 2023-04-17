<template>
    <div class="footer w-[1200px] m-auto relative">
        <div class="footer__content">
            <img class="logo" src="../../assets/image/logo.png" alt="">
        </div>
        <div class="footer__content">
            <div class="icon-boder"><i class="fas fa-map-marker-alt"></i></div>
            <span>Số 6, Ngõ 37 Dịch Vọng, Phường Dịch Vọng, Quận Cầu Giấy, Tp. Hà Nội</span>
        </div>
        <div class="footer__content">
            <div class="icon-boder"><i class="fas fa-phone-alt"></i></div>
            <span>0899 189 499</span>
        </div>
        <div class="footer__content">
            <div class="icon-boder"><i class="fas fa-envelope"></i></div>
            <span>quanchinh1301@gmail.com</span>
        </div>

    </div>
</template>
<style scoped>
.footer{
    display: flex;
    padding: 12px 0;
    gap: 24px;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
}
.logo{
    width: 200px;
    /* height: 200px; */
}
.footer__content{
    display: flex;
    gap: 4px;
    align-items: center;
}
.icon-boder{
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #f7462f;
    border-radius: 4px;
}
</style>