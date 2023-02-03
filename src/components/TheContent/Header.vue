<template>
  <div class="bg-[#EF3073]">
    <div class="header text-white bg-[#EF3073] w-[1200px] m-auto relative">
      <div
        class="hotline content-item"
        data-aos="fade-left"
        data-aos-duration="2000"
      >
        <i class="fas fa-phone-alt"></i>
        <p><span style="font-weight: 600">Hotline:</span> 0899 189 499</p>
      </div>
      <div
        class="account"
        v-if="!hasCustomer"
        data-aos="fade-right"
        data-aos-duration="1500"
      >
        <router-link to="/signin" class="signin content-item">
          <i class="fas fa-sign-in-alt"></i>
          <p>Đăng nhập</p>
        </router-link>
        <router-link to="/signup" class="signup content-item">
          <i class="fas fa-user-plus"></i>
          <p>Đăng kí</p>
        </router-link>
      </div>
      <div
        class="account"
        v-else
        data-aos="fade-right"
        data-aos-duration="1500"
      >
        <router-link to="/infomation" class="signin content-item">
          <i class="fas fa-user"></i>
          <p>Tài khoản</p>
        </router-link>
        <div class="signin content-item">
          <i class="fas fa-sign-in-alt"></i>
          <p @click="signOut">Đăng xuất</p>
        </div>
        <router-link to="/cart" class="signup content-item">
          <i class="fas fa-shopping-cart"></i>
          <p>Giỏ hàng: {{ item }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/js/api";
export default {
  data() {
    return {
      item: "0",
    };
  },
  computed: {
    hasCustomer() {
      let customer = this.$store.state.customer;
      if (customer) {
        return true;
      }
      return false;
    },
    customer() {
      return this.$store.state.customer;
    },
    cart() {
      return this.$store.state.cart;
    },
  },
  methods: {
    signOut() {
      this.$store.commit("TOGGLE_CUSTOMER", "");
      this.$router.replace({ path: "/content" });
    },
  },
  watch: {
    customer: function (value) {
      if (value) {
        this.$axios.get(`${api.CartApi}/${value.id}`).then((res) => {
          this.item = res.data.length;
          this.$store.commit("CHANGE_CART", res.data.length);
        });
      }
    },
    cart: function (value) {
      this.item = value;
    },
  },
};
</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}
.account {
  display: flex;
  gap: 24px;
}
.signin,
.signup {
  cursor: pointer;
}
.content-item {
  opacity: 0.8;
  transition: all linear 0.6s;
}
.content-item:hover {
  opacity: 1;
}
.content-item:hover p {
  color: #3daa12;
}
</style>
