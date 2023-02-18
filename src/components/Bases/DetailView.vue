<template>
  <div class="product-detail w-[1200px] m-auto relative">
    <div class="product-info flex pt-4">
      <NavBar></NavBar>
      <div class="product-info-main">
        <div class="flex justify-between gap-6">
          <div class="product-image">
            <img
              class="w-[400px] h-[400px]"
              :src="item.image || avatar"
              alt=""
            />
          </div>
          <div class="product-property">
            <div class="text-3xl font-bold mb-4">
              {{ item.name }}
            </div>
            <table class="table-detail">
              <tr>
                <td class="table-title">Mã sản phẩm</td>
                <td>{{ item.id }}</td>
              </tr>
              <tr>
                <td class="table-title">Xuất xứ</td>
                <td>{{ item.origin }}</td>
              </tr>
              <tr>
                <td class="table-title">Đơn vị tính</td>
                <td>{{ item.unit }}</td>
              </tr>
              <tr>
                <td class="table-title">Tình trạng</td>
                <td>{{ item.amount > 0 ? "Còn hàng" : "Hết hàng" }}</td>
              </tr>
            </table>
            <p style="font-size: 24px; color: #dc3545; padding: 24px 12px">
              {{ item.price }}đ
            </p>
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
          </div>
        </div>

        <div class="store-comment">
          <p>AN LỘC VIỆT CAM KẾT:</p>
          <div class="store-title">
            <i class="fas fa-check-circle"></i>
            Cung cấp các sản phẩm văn phòng đa dạng với giá cả hợp lý
          </div>
          <div class="store-title">
            <i class="fas fa-check-circle"></i>
            Miễn phí giao hàng cho đơn hàng trên 500.000đ (áp dụng tại các quận
            nội thành TP. Hà Nội)
          </div>
          <div class="store-title">
            <i class="fas fa-check-circle"></i>
            Hỗ trợ đổi trả nếu có lỗi sản phẩm hoặc không vừa ý
          </div>
          <div class="store-title">
            <i class="fas fa-check-circle"></i>
            Tư vấn và hướng dẫn sử dụng sản phẩm chi tiết, tận tình
          </div>
          <div class="store-title">
            <i class="fas fa-check-circle"></i>
            Cam kết chất lượng sản phẩm đúng với mô tả
          </div>
        </div>
      </div>
    </div>
    <div class="product-info">
      <div class="title">Mô tả</div>
      <div class="main-description" v-html="item.description"></div>
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
export default {
  components: {
    Loader,
    ToastMesage,
    ErrorPopup,
    NavBar,
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
    };
  },
  created() {
    this.$axios.get(`${api.ProductApi}/${this.getId}`).then((res) => {
      this.item = res.data;
    });
  },
  computed: {
    getId() {
      return this.$route.params.id;
    },
  },
  methods: {
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
.title {
  border-bottom: 2px solid #ccc;
  height: 50px;
  padding: 0 24px;
  font-size: 32px;
  display: flex;
  align-items: flex-end;
  font-weight: 600;
  color: #3daa12;
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
  padding: 12px 24px;
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
.table-detail td {
  border: 1px solid #ccc;
  min-width: 100px;
  padding: 8px 12px;
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

/* .quantity {
  display: flex;
  justify-content: space-between;
} */
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
</style>
