<template>
    <div class="bg-[#a11f2c]" data-aos="flip-right" data-aos-easing="ease-out-cubic" data-aos-duration="1500">
        <div class="sign-in w-[1200px] m-auto relative py-[16px]">
            <div class="signin-header" data-aos="fade-right" data-aos-duration="2000">
                Đăng nhập
            </div>
            <div class="singin-content">
                <div class="form">
                    <div class="signin-content--item">
                        <img class="w-[200px]" src="../../assets/image/logo.png" alt="" />
                    </div>
                    <div class="signin-content--item">
                        <div> <i class="fas fa-envelope"></i>
                            <span>Email:</span>
                        </div>
                        <input type="text" class="input" placeholder="Email..." v-model="email">
                    </div>
                    <div class="signin-content--item">
                        <div>
                            <i class="fas fa-key"></i>
                            <span>Mật khẩu:</span>
                        </div>
                        <input type="password" class="input" placeholder="Mật khẩu..." v-model="password">
                    </div>
                    <div class="signin-content--item w-[400px] h-[40px] bg-[#a11f2c] text-[#fff]" style="display:flex; justify-content:center">
                        <button class="button" @click="SignIn()">ĐĂNG NHẬP</button>
                    </div>
                </div>
            </div>
            <div class="signin-footer" data-aos="fade-right" data-aos-duration="1500">
                Chưa có tài khoản? <router-link to="/signup">Đăng kí</router-link>
            </div>
            <ErrorPopup :title="title" @close="close" v-if="hasError"></ErrorPopup>
        </div>
    </div>
</template>
<script>
import api from '@/js/api'
import ErrorPopup from '@/components/Bases/BasePopup/ErrorPopup'
export default {
    components: {
        ErrorPopup,
    },
    data() {
        return {
            email: "",
            password: "",
            title: "",
            hasError: false,
        }
    },
    methods: {
        SignIn() {
            if (this.email && this.password) {
                this.$axios.get(`${api.CustomerApi}/${this.email}`).then(res => {
                    if (res.data) {
                        if (res.data.password == this.password) {
                            this.$store.commit("TOGGLE_CUSTOMER", res.data);
                            this.$router.replace({ path: '/home' });
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                        else {
                            this.title = "Mật khẩu không chính xác."
                            this.hasError = true;
                        }
                    }
                    else {
                        this.title = "Email không chính xác."
                        this.hasError = true;
                    }
                })
            }
            else {
                this.title = "Vui lòng nhập Email và mật khẩu."
                this.hasError = true;
            }
        },
        close() {
            this.hasError = false;
        },
    }
}
</script>
<style scoped>
.sign-in {
    background-color: #a11f2c;
    border-radius: 8px;
}

.signin-header {
    height: 60px;
    font-weight: 600;
    font-size: 28px;
    line-height: 60px;
    background: white;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.singin-content {
    display: flex;
    min-height: 350px;
    justify-content: center;
}

.signin-content--item {
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin: 24px 0 0 0;
}

.signin-content--item i {
    line-height: 40px;
}

.signin-content--item span {
    width: 120px;
    line-height: 40px;
}

.signin-content--item input {
    width: 400px;
    border: 2px solid transparent;
}

.signin-content--item input:focus {
    border: 2px solid #a11f2c;
}

.signin-footer {
    height: 60px;
    padding: 0 24px;
    line-height: 60px;
    font-size: 20px;
    color: #FFF;
}

.form {
    padding: 48px;
    border-radius: 8px;
    display: flex;
    background-color: white;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
i{
    color: #a11f2c;
}
span {
    margin-left: 8px;
}
</style>