<template>
  <div class="list-product">
    <div class="list-product-title">
      {{ title }}
    </div>
    <div class="list-product-content">
      <div v-if="!items.length" class="no-data">
        Hiện tại chưa có sản phẩm để hiển thị
      </div>   
      <Carousel
        class="w-2/3 grabbable"
        :per-page="1"
        :paginationEnabled="true"
        paginationActiveColor="#ef3073"
        :loop="true"
        :speed="500"
        :autoplay="true"
        :autoplayTimeout="5000"
        :navigationEnabled="true"
      >
        <slide v-for="(itemGrid, index) in dataGrid" :key="index">
          <div class="grid-card">
            <div
              v-for="(item, index) in itemGrid"
              :key="index + 'name'"
              class="card"
            >
              <router-link :to="'/detail/' + item.id">
                <div
                  class="flex justify-center text-sm text-center uppercase items-center border-b border-dotted border-[#d8d8d8] h-14 p-3"
                >
                  <span class="card-title" @click="viewDetail(item.id)">{{
                    item.name
                  }}</span>
                </div>
                <div class="card-content" @click="viewDetail(item)">
                  <img
                    class="h-[162px] w-[190px]"
                    :src="item.image || avatar"
                    alt=""
                  />
                </div>
                <div class="card-footer">
                  <span>{{ item.price }}đ</span>
                  <i
                    class="fas fa-cart-plus text-[#ef3073]"
                    @click.prevent="addCart(item)"
                  ></i>
                </div>
              </router-link>
            </div>
          </div>
        </slide>
      </Carousel>    
      <div class="w-1/3 pl-4">
        <img
          class="h-full"
          src="https://www.anlocviet.vn/thumb/380x555/1/upload/product/bia-ho-so-2480.jpg"
          alt=""
        />
      </div>
    </div>
    <ErrorPopup :title="mesage" @close="close" v-if="hasError"></ErrorPopup>
    <Loader v-if="hasLoader">
    </Loader>
    <ToastMesage
      v-if="hasToast"
      :mesage="mesage"
      @closeToast="closeToast"
    ></ToastMesage>
  </div>
</template>
<script>
import defaultAvatar from "../../assets/image/img_default.jpg";
// import Pagination from "@/components/Bases/Pagination";
import Loader from "@/components/Bases/Loader";
import ToastMesage from "@/components/Bases/ToastMesage";
import ErrorPopup from "@/components/Bases/BasePopup/ErrorPopup";
import api from "@/js/api";
import { Carousel, Slide } from "vue-carousel";

export default {
  components: {
    // Pagination,
    Loader,
    ToastMesage,
    ErrorPopup,
    Carousel,
    Slide,
  },
  props: ["title", "items", "description", "totalItems"],
  data() {
    return {
      avatar: defaultAvatar,
      TotalRecord: this.totalItems,
      PageNumber: 1,
      hasLoader: false,
      hasToast: false,
      hasError: false,
      mesage: "",
      dataGrid: [],
      quantity: 1,
    };
  },
  created() {
    this.getGridData();
  },
  computed: {
    getCustomer() {
      return this.$store.state.customer;
    },
  },
  methods: {
    chunkArrayInGroups(arr, size) {
      let result = [];
      let j = 0;
      for (let i = 0; i < Math.ceil(arr.length / size); i++) {
        result[i] = arr.slice(j, j + size);
        j = j + size;
      }
      return result;
    },
    getGridData() {
      this.dataGrid = this.chunkArrayInGroups(this.items, 8);
    },
    resetPage() {
      this.$refs.pagination.resetPage();
    },
    pageChange(value) {
      this.PageNumber = value;
      this.$emit("pageChange", value);
    },
    viewDetail(value) {
      this.$emit("viewDetail", value);
    },
    addCart(item) {
      let customer = this.$store.state.customer;
      if (customer) {
        if (this.quantity)
          this.$axios.get(`${api.CartApi}/${customer.id}`).then((res) => {
            let inCart = res.data.find(
              (c) => c.cus_id == customer.id && c.prod_id == item.id
            );
            let cart = {
              cus_id: customer.id,
              prod_id: item.id,
              quantity: this.quantity,
            };
            this.hasLoader = true;
            if (inCart?.quantity) {
              cart.quantity += inCart.quantity;
              this.$axios
                .put(api.CartApi, cart)
                .then((res) => {
                  if (res.status == 200) {
                    this.mesage = "Thêm vào giỏ hàng thành công.";
                    this.hasToast = true;
                    setTimeout(() => {
                      this.hasToast = false;
                    }, 3000);
                    this.$axios
                      .get(`${api.CartApi}/${customer.id}`)
                      .then((res) => {
                        this.$store.commit("CHANGE_CART", res.data.length);
                      });
                  }
                })
                .finally(() => (this.hasLoader = false));
            } else {
              this.$axios
                .post(api.CartApi, cart)
                .then((res) => {
                  if (res.status == 201) {
                    this.mesage = "Thêm vào giỏ hàng thành công.";
                    this.hasToast = true;
                    setTimeout(() => {
                      this.hasToast = false;
                    }, 3000);
                    this.$axios
                      .get(`${api.CartApi}/${customer.id}`)
                      .then((res) => {
                        this.$store.commit("CHANGE_CART", res.data.length);
                      });
                  }
                })
                .finally(() => (this.hasLoader = false));
            }
          });
      } else {
        this.$router.replace({ path: "/signin" });
      }
    },
    closeToast() {
      this.hasToast = false;
    },
    close() {
      this.hasError = false;
    },
  },
};
</script>
<style scoped>
.grabbable {
  cursor: move;
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}

.grabbable:active {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}
::v-deep .VueCarousel-navigation-prev[data-v-453ad8cd] {
  left: 35px;
  color: #fff;
  top: 44%;
  border: 1px solid #fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  align-items: center;
  display: flex;
  justify-content: center;
  outline: none;
  opacity: 0;
}
::v-deep .VueCarousel-navigation-prev[data-v-453ad8cd]:hover {
  color: #ef3073;
  border: 1px solid #ef3073;
  opacity: 1;
}
::v-deep .VueCarousel-navigation-next[data-v-453ad8cd] {
  right: 38px;
  color: #fff;
  top: 44%;
  border: 1px solid fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  align-items: center;
  display: flex;
  justify-content: center;
  outline: none;
}
::v-deep .VueCarousel-navigation-next[data-v-453ad8cd]:hover {
  color: #ef3073;
  border: 1px solid #ef3073;
}
.grid-card {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-row-gap: 16px;
  grid-column-gap: 9px;
}
.list-product {
  width: 100%;
}
.list-product-title {
  height: 40px;
  border-bottom: 2px solid #333;
  font-size: 16px;
  font-weight: 600;
}
.list-product-content {
  display: flex;
  padding-top: 16px;
  /* flex-wrap: wrap; */
  /* gap: 24px; */
  /* padding: 12px 0 0 0; */
}
.card {
  max-width: 200px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  z-index: 1;
}
.card:hover {
  cursor: pointer;
}
.card-content {
  overflow: hidden;
  margin: 6px;
}
.card-title {
  color: #000;
  font-weight: 500;
}
.card-title:hover {
  color: #ef3073;
}
.product-image img {
  max-height: 100%;
  max-width: 100%;
  opacity: 0.8;
}
.product-image:hover img {
  opacity: 1;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  width: 100%;
  height: 2.5rem;
  border-top: 1px dotted #d8d8d8;
}
.card-footer span {
  color: #ef3073;
}
.no-data {
  text-align: center;
  color: red;
  width: 100%;
}
.pagination {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
