<template>
  <div class="list-product">
    <div class="list-product-title">
      {{ title }}
    </div>
    <div class="list-product-content">
      <div class="category-description" v-if="description">
        {{ description }}
      </div>
      <div v-if="!items.length" class="no-data">
        Hiện tại chưa có sản phẩm để hiển thị
      </div>
      <div class="flex">
        <carousel
          class="w-3/4"
          :per-page="1"
          :paginationEnabled="false"
          :autoplay="false"
          :autoplayTimeout="5000"
          :loop="true"
          :speed="2000"
        >
          <slide v-for="(itemGrid, index) in dataGrid" :key="index">
            <div class="grid-card">
              <div
                v-for="(item, index) in itemGrid"
                :key="index + 'name'"
                class="card"
              >
                <div
                  class="flex justify-center border-b border-dotted border-[#d8d8d8] h-12"
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
                  <span>Đơn giá: {{ item.price }}đ</span>
                  <i class="fas fa-cart-plus" @click="addCart(item)"></i>
                </div>
              </div>
            </div>
          </slide>
        </carousel>
        <div>
          <img
            src="https://www.anlocviet.vn/thumb/380x555/1/upload/product/bia-ho-so-2480.jpg"
            alt=""
          />
        </div>
      </div>

      <!-- <div class="pagination">
                <Pagination ref="pagination" :itemCount="totalItems" :maxDisplayPage="3" :page="PageNumber" :perPage="18" @pageChange="pageChange"></Pagination>
            </div> -->
    </div>
    <ErrorPopup :title="mesage" @close="close" v-if="hasError"></ErrorPopup>
    <Loader v-if="hasLoader"></Loader>
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
      let customer = this.getCustomer;
      if (customer) {
        this.$axios.get(`${api.CartApi}/${customer.id}`).then((res) => {
          if (
            res.data.some(
              (c) => c.cus_id == customer.id && c.prod_id == item.id
            )
          ) {
            this.mesage = "Sản phẩm này đã có trong giỏ hàng";
            this.hasError = true;
            return;
          }
          let cart = {
            cus_id: customer.id,
            prod_id: item.id,
            quantity: 1,
          };
          this.hasLoader = true;
          this.$axios
            .post(api.CartApi, cart)
            .then((res) => {
              if (res.status == 201) {
                this.mesage = "Thêm vào giỏ hàng thành công.";
                this.hasToast = true;
                setTimeout(() => {
                  this.hasToast = false;
                }, 3000);
                this.$axios.get(`${api.CartApi}/${customer.id}`).then((res) => {
                  this.$store.commit("CHANGE_CART", res.data.length);
                });
              }
            })
            .finally(() => (this.hasLoader = false));
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
.grid-card {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-row-gap: 16px;
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
  flex-wrap: wrap;
  gap: 24px;
  padding: 12px 0 0 0;
}
.card {
  /* flex-basis: 31%; */
  max-width: 200px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  /* position: relative; */
  /* padding-bottom: 40px; */
  z-index: 1;
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
  color: #3daa12;
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
  padding: 0 12px;
  width: 100%;
  /* position: absolute; */
  /* bottom: 0; */
  border-top: 1px dotted #d8d8d8;
}
.card-footer span {
  color: #3daa12;
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
