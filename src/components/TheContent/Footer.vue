<template>
    <div class="footer">
        <div class="footer__content">
            <img src="../../assets/image/logo.png" alt="">
        </div>
        <div class="footer__content">
            <div class="icon-boder"><i class="fas fa-map-marker-alt"></i></div>
            <span>Số 90, Ngõ 553 Giải Phóng, Phường Giáp Bát, Quận Hoàng Mai, Tp. Hà Nội</span>
        </div>
        <div class="footer__content">
            <div class="icon-boder"><i class="fas fa-phone-alt"></i></div>
            <span>0899 189 499</span>
        </div>
        <div class="footer__content">
            <div class="icon-boder"><i class="fas fa-envelope"></i></div>
            <span>vppanlocviet@gmail.com</span>
        </div>

    </div>
</template>
<style scoped>
.footer{
    display: flex;
    padding: 12px 48px;
    gap: 24px;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
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
    border: 1px solid #3DAA12;
    border-radius: 4px;
}
</style>