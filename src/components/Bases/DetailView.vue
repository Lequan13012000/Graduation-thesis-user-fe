<template>
  <div class="product-detail w-[1200px] m-auto relative">
    <div class="product-info flex pt-4">
      <NavBar></NavBar>
      <div class="product-info-main">
        <div class="flex justify-between gap-6">
          <div class="product-image">
            <img
              class="w-[300px] h-[300px]"
              :src="item.image || avatar"
              alt=""
            />
          </div>
          <div class="product-property">
            <div class="text-3xl font-bold mb-4">
              {{ item.name }}
            </div>
            <table class="table-detail">
              <thead>
                <tr>
                  <th class="table-title">Mã sản phẩm</th>
                  <th class="table-title">Xuất xứ</th>
                  <th class="table-title">Đơn vị tính</th>
                  <th class="table-title">Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ item.id }}</td>
                  <td>{{ item.origin }}</td>
                  <td>{{ item.unit }}</td>
                  <td>{{ item.amount > 0 ? "Còn hàng" : "Hết hàng" }}</td>
                </tr>
              </tbody>
            </table>

            <p class="price"><span>₫</span> {{ item.price }}</p>
            <div
              class="cart flex gap-6"
              method="post"
              enctype="multipart/form-data"
            >
              <div class="quantity">
                <input type="button" value="-" @click="decQuantity" />
                <input
                  type="number"
                  min="1"
                  max="9999"
                  name="quantity"
                  v-model="quantity"
                  class="numberQuantity"
                />
                <input type="button" value="+" @click="ascQuantity" />
              </div>
              <button
                class="button"
                type="submit"
                name="add-to-cart"
                value="334"
                @click="addCart(item)"
              >
                Thêm vào giỏ
              </button>
            </div>

            <div class="mt-8">
              <p>AN LỘC VIỆT CAM KẾT:</p>
              <div class="store-title">
                Cung cấp các sản phẩm văn phòng đa dạng với giá cả hợp lý
              </div>
              <div class="store-title">
                Miễn phí giao hàng cho đơn hàng trên 500.000đ (áp dụng tại các
                quận nội thành TP. Hà Nội)
              </div>
              <div class="store-title">
                Hỗ trợ đổi trả nếu có lỗi sản phẩm hoặc không vừa ý
              </div>
              <div class="store-title">
                Tư vấn và hướng dẫn sử dụng sản phẩm chi tiết, tận tình
              </div>
              <div class="store-title">
                Cam kết chất lượng sản phẩm đúng với mô tả
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="product-info">
      <div class="title">Mô tả</div>
      <div
        class="main-description"
        :class="{ 'collapse-description': isCollapse }"
        v-html="item.description"
      ></div>
      <div class="flex justify-center container-collapse">
        <div @click="collapseDes" class="button-collapse">
          <p v-if="isCollapse">Xem thêm</p>
          <p class="collapseSecond" v-else>Thu gọn</p>
        </div>
      </div>
    </div>
    <div class="">
      <div class="title">Sản phẩm tương tự</div>
      <div class="mt-8">
        <Carousel
          class="grabbable"
          :per-page="5"
          :paginationEnabled="true"
          paginationActiveColor="#f7462f"
          :loop="true"
          :speed="500"
          :autoplay="true"
          :autoplayTimeout="5000"
          :navigationEnabled="true"
        >
          <slide v-for="(product, index) in listProduct" :key="index">
            <div
              class="card"
              v-on:mousedown="onDragStart($event)"
              v-on:mouseup="onDragEnd($event)"
              @click="viewDetail(product.id)"
            >
              <div
                class="flex justify-center text-sm text-center uppercase items-center border-b border-dotted border-[#d8d8d8] h-14 p-3"
              >
                <span class="card-title">{{ product.name }}</span>
              </div>
              <div class="card-content">
                <img
                  class="h-[162px] w-[190px]"
                  :src="product.image || avatar"
                  alt=""
                />
              </div>
              <div class="card-footer">
                <span>{{ product.price }}đ</span>
                <i
                  class="fas fa-cart-plus text-[#f7462f]"
                  @click.prevent="addCart(product)"
                ></i>
              </div>
            </div>
          </slide>
        </Carousel>
      </div>
    </div>
    <ErrorPopup :title="mesage" @close="close" v-if="hasError"></ErrorPopup>
    <Loader v-if="hasLoader"></Loader>
    <ToastMesage
      v-if="hasToast"
      :mesage="mesage"
      @closeToast="close"
    ></ToastMesage>
  </div>
</template>
<script>
import Loader from "@/components/Bases/Loader";
import ToastMesage from "@/components/Bases/ToastMesage";
import ErrorPopup from "@/components/Bases/BasePopup/ErrorPopup";
import defaultAvatar from "../../assets/image/img_default.jpg";
import api from "@/js/api";
import NavBar from "../TheContent/NavBar.vue";
import { Carousel, Slide } from "vue-carousel";

export default {
  components: {
    Loader,
    ToastMesage,
    ErrorPopup,
    NavBar,
    Carousel,
    Slide,
  },
  data() {
    return {
      item: {},
      avatar: defaultAvatar,
      hasError: false,
      hasLoader: false,
      hasToast: false,
      mesage: "",
      quantity: 0,
      listProduct: [],
      dragging: false,
      cXCurrent: null,
      cYCurrent: null,
      isCollapse: true,
    };
  },
  created() {
    this.$axios.get(`${api.ProductApi}/${this.getId}`).then((res) => {
      this.item = res.data;
      this.getDataSimilar();
    });
  },
  computed: {
    getId() {
      return this.$route.params.id;
    },
  },
  methods: {
    getDataSimilar() {
      this.$axios
        .get(`${api.ProductCategory}/${this.item.cat_id}`, {
          params: { pageNumber: 1 },
        })
        .then((res) => {
          this.listProduct = res.data.data;
        });
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
    ascQuantity() {
      this.quantity++;
    },
    decQuantity() {
      if (this.quantity > 0) this.quantity--;
    },
    close() {
      this.hasError = false;
      this.hasToast = false;
    },
    onDragStart(event) {
      this.cXCurrent = event.clientX;
      this.cYCurrent = event.clientY;
    },
    onDragEnd(event) {
      if (
        this.cXCurrent !== event.clientX &&
        this.cYCurrent !== event.clientY
      ) {
        this.dragging = true;
      }
    },
    viewDetail(idProduct) {
      if (!this.dragging) {
        this.$router.push("/detail/" + idProduct);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        this.dragging = false;
      }
    },
    collapseDes() {
      this.isCollapse = !this.isCollapse;
    },
  },
  watch: {
    getId: function (value) {
      this.$axios.get(`${api.ProductApi}/${value}`).then((res) => {
        this.item = res.data;
      });
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
  color: #f7462f;
  border: 1px solid #f7462f;
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
  color: #f7462f;
  border: 1px solid #f7462f;
}
.title {
  border-bottom: 2px solid #ccc;
  height: 50px;
  padding: 0 24px;
  font-size: 16px;
  display: flex;
  align-items: flex-end;
  font-weight: 600;
}
.product-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-info {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 24px;
}
.product-info-main {
  padding-left: 24px;
  justify-content: space-between;
}
.main-description {
  padding: 12px 24px;
}

.product-image img {
  width: 100%;
}
.table-detail {
  border-collapse: collapse;
}
.table-detail th,
td {
  border: 1px solid #ccc;
  min-width: 100px;
  padding: 8px 12px;
  text-align: start;
}
.table-title {
  font-weight: 600;
}
.store-title {
  margin: 12px 0;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.quantity input {
  width: 24px;
  height: 42px;
  line-height: 1.65;
  float: left;
  display: block;
  padding: 0;
  margin: 0;
  /* padding-left: 20px; */
  border: 1px solid #eee;
  background-color: #f9f9f9;
}
.numberQuantity {
  width: 45px !important;
  text-align: center;
  background-color: #fff !important;
  cursor: auto !important;
}
.quantity input:hover {
  background-color: #bbb5b5;
  cursor: pointer;
}

.quantity input:focus {
  outline: 0;
}
.button {
  height: 40px;
  min-width: 100px;
  border: 1px solid transparent;
  color: #fff;
  background: #f7931e;
  border-radius: 4px;
  font-size: 16px;
  padding: 0 12px;
  cursor: pointer;
  transition: all linear 0.6s;
}

.button:hover {
  color: #fff;
  border: 1px solid #f20759;
  background-color: #f20759;
}
.price {
  font-size: 20px;
  font-weight: 600;
  color: #d0011b;
  padding: 24px 12px;
  display: flex;
  column-gap: 3px;
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
  color: #f7462f;
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
  color: #f7462f;
}
.collapse-description {
  height: 300px;
  overflow: hidden;
}
.button-collapse {
  width: 110px;
  text-align: center;
  padding: 8px;
  border: 1px solid orange;
  cursor: pointer;
}
.button-collapse p:after {
  content: "";
  width: 0;
  right: 0;
  border-top: 6px solid orange;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  display: inline-block;
  vertical-align: middle;
  margin-left: 6px;
}
.collapseSecond:after {
  transform: rotate(180deg);
}
.container-collapse:before {
    height: 55px;
    margin-top: -45px;
    content: "";
    background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
    background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%);
    background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff00', endColorstr='#ffffff',GradientType=0 );
    display: block;
}
</style>
