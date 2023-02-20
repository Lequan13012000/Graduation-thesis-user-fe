<template>
    <div class="top-navbar">
        <!-- <router-link to="/home" class="top-navbar__item"
        data-aos="fade-left"
        data-aos-duration="1000">Trang chủ</router-link>
        <a href="#" class="top-navbar__item"
        data-aos="fade-left"
        data-aos-duration="1400">Giới thiệu</a>
        <a href="#" class="top-navbar__item"
        data-aos="fade-left"
        data-aos-duration="1800">Liên hệ</a>
        <a href="#" class="top-navbar__item"
        data-aos="fade-left"
        data-aos-duration="2100">Hỗ trợ</a>
        <a href="#" class="top-navbar__item"
        data-aos="fade-left"
        data-aos-duration="2400">Dịch vụ</a>
        <a href="#" class="top-navbar__item"
        data-aos="fade-left"
        data-aos-duration="2700">Chính sách</a>
        <a href="#" class="top-navbar__item"
        data-aos="fade-left"
        data-aos-duration="3000">Câu hỏi thường gặp</a> -->
    </div>
</template>
<script>
export default {
    
}
</script>
<style scoped>
.top-navbar{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    background-color: #3DAA12;
}
.top-navbar__item{
    height: 40px;
    min-width: 100px;
    padding: 0 12px;
    display: block;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    border: 1px solid transparent;
    border-radius: 4px;
    font-weight: 600;
    transition: all linear 0.5s;
}
.top-navbar__item:hover{
    color: #3DAA12;
    background: #fff;
    border: 1px solid #3DAA12;
}
</style>