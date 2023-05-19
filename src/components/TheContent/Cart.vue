<template>
  <div class="cart">
    <div class="w-[1200px] m-auto relative" data-aos="flip-right" data-aos-easing="ease-out-cubic"
      data-aos-duration="1500">
      <div class="cart-header">GIỎ HÀNG</div>
      <div class="cart-content">
        <NoData v-if="noData"></NoData>
        <div v-else>
          <div class="header-cart-item">
            <div class="checkbox-all-product">
              <input class="checkbox-add-cart" type="checkbox" id="checkbox-all-products" v-model="isSelectedAll"
                @change="selectAll">
            </div>
            <div style="margin-right: 9rem;margin-left: 2rem;"><span class="num-items-checkbox">Sản phẩm</span></div>
            <div style="margin-left: 10rem;margin-right: 3rem;">Đơn giá</div>
            <div style="margin-right: 1.2rem;">Số lượng</div>
            <div>Thành tiền</div>
            <div></div>
          </div>
          <div class="content-card-item">
            <div class="item-card" v-for="(item, index) in items" :key="item.id + index + item.name">
              <div class="checkbox" style="min-width: 40px"><input type="checkbox" v-model="item.checked"
                  @click="getCardPayment(item, index)">
              </div>
              <div style="display: flex;align-items: center;padding-left: 2rem;">
                <img :src="item.image || avatar" alt="" />
                <p
                  style="margin-right: 2rem;text-overflow: ellipsis;word-break: break-word;width: 250px;text-align: left;margin-left: 1rem;">
                  {{ item.name }}</p>
              </div>
              <p class="price"><span>₫</span> {{ item.price }}</p>
              <div style="padding-left: 7rem;">
                <div class="quantity">
                  <input type="button" value="-" @click="decQuantity(item)" />
                  <input type="number" min="1" max="9999" name="quantity" v-model="item.quantity"
                    class="numberQuantity" />
                  <input type="button" value="+" @click="ascQuantity(item)" />
                </div>
              </div>
              <p class="price" style="min-width: 120px;padding-left: 6rem;"><span>₫</span> {{ item.price * item.quantity
              }}</p>
              <div style="min-width: 40px;padding-left: 6.2rem;cursor: pointer;">
                <i class="far fa-trash-alt" @click="deleteCartItem(item)"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cart-footer">
        <div class="h-[3rem] bg-[#9b9090] text-white flex items-center px-5 rounded-lg ml-10"> <button class="button">
            <router-link to="/home">TIẾP TỤC MUA HÀNG</router-link>
          </button></div>
        <div class="flex items-center ">
          <div class="flex items-center ml-10 text-lg font-bold">Tổng số tiền: <p class="price" style="font-size: 18px;">
              <span>₫</span> {{ totalMoney }}
            </p>
          </div>
          <button @click="payment()" class="h-[3rem] text-white flex items-center px-5 rounded-lg mx-[2.5rem]"
            :class="listPayment.length ? 'bg-[#C92127] cursor-pointer' : 'bg-[#e0e0e0] cursor-no-drop'"
            :disabled="!listPayment.length">
            THANH TOÁN
          </button>
        </div>

      </div>
      <Loader v-if="hasLoader"></Loader>
    </div>
    <ErrorPopup @close="close" :title="title" v-if="hasError"></ErrorPopup>
    <QuestionPopup :title="title" @close="close" @yes="yes" v-if="hasQuestion"></QuestionPopup>
    <ToastMesage :mesage="title" @closeToast="closeToast" v-if="hasToast"></ToastMesage>
  </div>
</template>
<script>
import NoData from "@/components/Bases/NoData";
import defaultAvatar from "../../assets/image/img_default.jpg";
import Loader from "@/components/Bases/Loader";
import ErrorPopup from "@/components/Bases/BasePopup/ErrorPopup";
import QuestionPopup from "@/components/Bases/BasePopup/QuestionPopup";
import ToastMesage from "@/components/Bases/ToastMesage";
import api from "@/js/api";
export default {
  components: {
    Loader,
    QuestionPopup,
    ToastMesage,
    ErrorPopup,
    NoData,
  },
  data() {
    return {
      noData: false,
      items: [],
      avatar: defaultAvatar,
      checkedPayment: false,
      customer: {},
      hasLoader: false,
      hasQuestion: false,
      hasError: false,
      hasToast: false,
      title: "",
      selectedItem: {},
      listPayment: [],
      isSelectedAll: false
    };
  },
  created() {
    this.customer = this.getCustomer;
    if (!this.customer) {
      this.$router.replace({ path: "/home" });
    }
    this.getCart();
  },
  computed: {
    getCustomer() {
      return this.$store.state.customer;
    },
    totalMoney() {
      return this.listPayment.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );
    }, getPayment() {
      return this.$store.state.payment;
    },
  },
  methods: {
    getCardPayment(item) {
      const isHas = this.listPayment.findIndex((payment) => payment.prod_id === item.prod_id);
      if (isHas !== -1) {
        this.listPayment.splice(isHas, 1);
        this.isSelectedAll = false;
      }
      else {
        this.listPayment.push(item);
        if (this.listPayment.length === this.items.length) {
          this.isSelectedAll = true;
        }
      }
      this.$store.commit("CHANGE_PAYMENT", this.listPayment);
    },
    selectAll() {
      if (this.listPayment.length === this.items.length) {
        this.isSelectedAll = false;
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].checked = false;
        }
        this.listPayment = [];
      }
      else {
        this.isSelectedAll = true;
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].checked === false) {
            this.items[i].checked = true;
            this.listPayment.push(this.items[i]);
          }
        }
      }
      this.$store.commit("CHANGE_PAYMENT", this.listPayment);
    },
    payment() {
      this.$router.push("/payment");
      this.$store.commit("CHANGE_PAYMENT", this.listPayment);
    },
    getCart() {
      this.hasLoader = true;
      this.$axios
        .get(`${api.CartApi}/${this.customer.id}`)
        .then((res) => {
          this.items = res.data;
          if (this.getPayment.length) {
            this.listPayment = this.getPayment;
            if (this.listPayment.length === this.items.length) {
              this.isSelectedAll = true;
            }
            this.items = this.items.map(item => {
              const found = this.listPayment.find(payment => payment.prod_id === item.prod_id);
              if (found) {
                return found;
              }
              else {
                item.checked = false;
                return item;
              }
            });
          }
          else {
            this.items = this.items.map(item => {
              return {
                ...item, checked: false
              }
            })
          }
          if (this.items.length === 0) {
            this.noData = true;
          } else {
            this.noData = false;
          }
          this.$store.commit("CHANGE_CART", this.items.length);
          console.log('payment',this.listPayment);
          console.log('items',this.items);
        })
        .finally(() => (this.hasLoader = false));
    },
    ascQuantity(item) {
      item.quantity++;
      if (item.quantity == 0) {
        this.selectedItem = item;
        this.yes();
      }
      this.hasLoader = true;
      this.$axios
        .put(api.CartApi, item)
        .finally(() => (this.hasLoader = false));
    },
    decQuantity(item) {
      if (item.quantity > 0) item.quantity--;
      if (item.quantity == 0) {
        this.selectedItem = item;
        this.yes();
      }
      this.hasLoader = true;
      this.$axios
        .put(api.CartApi, item)
        .finally(() => (this.hasLoader = false));
    },
    deleteCartItem(item) {
      this.selectedItem = item;
      this.title = "Bạn có chắc muốn xóa mặt hàng này không?";
      this.hasQuestion = true;
    },
    close() {
      this.hasQuestion = false;
      this.hasError = false;
    },
    yes() {
      this.hasLoader = true;
      this.hasQuestion = false;

      this.$axios
        .delete(
          `${api.CartApi}/${this.selectedItem.cus_id}/${this.selectedItem.prod_id}`
        )
        .then(() => {
          this.title = "Xóa thành công";
          this.hasToast = true;
          setTimeout(() => {
            this.hasToast = false;
          }, 3000);
          this.getCardPayment(this.selectedItem);
          // this.$store.commit("CHANGE_PAYMENT", this.listPayment);
          this.getCart();
        })
        .finally(() => (this.hasLoader = false));
    },
    closeToast() {
      this.hasToast = false;
    },
  },
  watch: {
    getCustomer(value) {
      this.customer = value;
    },
  },
};
</script>
<style scoped>
.cart {
  border-radius: 8px;
  background-color: #f5f5f5;
  min-height: 400px;
  padding-bottom: 24px;
}

.cart-header {
  margin: 0px 0 0;
  font-weight: 500;
  color: #333333 !important;
  line-height: 20px;
  font-size: 20px;
  padding-top: 24px;
  padding-bottom: 24px;
}

.cart-content {
  align-items: center;
  min-height: 400px;
}


.content-card-item {
  background: #fff;
  border-radius: 8px;
}

.item-card img {
  width: 119px;
  height: 119px;
}

.item-card {
  height: 160px;
  line-height: 40px;
  text-align: center;
  border-bottom: 1px solid #ededed;
  display: flex;
  align-items: center;
}

.item-card .checkbox {
  /* flex-basis: 4%; */
}


.checkbox input {
  width: 100px;
  outline: none;
  border: 1px solid #333;
  background-color: #fff;
  color: #000;

  border-radius: 4px;
  padding: 2px;
}


.far {
  color: rgb(253, 63, 63);
  opacity: 0.8;
}

.far:hover {
  color: red;
  opacity: 1;
}

.cart-footer {
  display: flex;
  gap: 12px;
  border-radius: 8px;
  background: #fff;
  height: 5rem;
  align-items: center;
  justify-content: space-between;
}

.total-money {
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  font-weight: 600;
}

.header-cart-item {
  background-color: white;
  margin-bottom: 10px;
  display: none;
  border-radius: 8px;
  padding: 10px 0;
  display: flex;
  padding-left: 28px;
}

.header-cart-item .checkbox-all-product {
  flex-basis: 4%;
}

.header-cart-item>div {
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 18%;
}

.quantity input {
  width: 24px;
  height: 42px;
  line-height: 1.65;
  float: left;
  display: block;
  padding: 0;
  margin: 0;
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

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.price {
  font-size: 14px;
  font-weight: 600;
  color: #d0011b;
  padding: 24px 12px;
  display: flex;
  column-gap: 3px;
  padding-left: 1.4rem;
  min-width: 80px;
  width: 120px;
}

.disable {}
</style>
