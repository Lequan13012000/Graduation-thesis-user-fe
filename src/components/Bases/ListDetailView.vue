<template>
  <div class="list-product w-[1200px] m-auto relative flex">
    <NavBar></NavBar>
    <div class="list-product-content">
      <div class="category-description" v-if="description">
        {{ description }}
      </div>
      <div class="card" v-for="(item, index) in items" :key="index">
        <div class="card-content">
          <div class="product-image" @click="viewDetail(item)">
            <img :src="item.image || avatar" alt="" />
          </div>
          <div>
            <span class="card-title">
              <router-link :to="'/detail/' + item.id">
                {{ item.name }}
              </router-link>
            </span>
          </div>
        </div>
        <div class="card-footer">
          <span>{{ item.price }}đ</span>
          <i
            class="fas fa-cart-plus"
            @click="addCart(item)"
          ></i>
        </div>
      </div>
      <div class="pagination">
        <paginate
          :page-count="totalPage"
          :click-handler="clickCallback"
          :prev-text="'Trước'"
          :next-text="'Sau'"
          :container-class="'pagination'"
          :page-class="'page-item'"
          :prev-class="'prev-item'"
          :next-class="'next-item'"
          :page-link-class="'page-link-item'"
        >
        </paginate>
      </div>
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
import Loader from "@/components/Bases/Loader";
import ToastMesage from "@/components/Bases/ToastMesage";
import ErrorPopup from "@/components/Bases/BasePopup/ErrorPopup";
import api from "@/js/api";
import Paginate from "vuejs-paginate";
import NavBar from "../TheContent/NavBar.vue";

export default {
  components: {
    Loader,
    ToastMesage,
    ErrorPopup,
    Paginate,
    NavBar,
  },
  props: ["id"],
  data() {
    return {
      items: [],
      title: "",
      description: "",
      totalItems: 0,
      avatar: defaultAvatar,
      TotalRecord: this.totalItems,
      PageNumber: 1,
      totalPage: 0,
      hasLoader: false,
      hasToast: false,
      hasError: false,
      mesage: "",
    };
  },
  created() {
    this.getData();
    // this.$router.replace({ query: "" });
  },
  computed: {
    getCustomer() {
      return this.$store.state.customer;
    },
    getSearch() {
      return this.$route.params.search;
    },
  },
  methods: {
    clickCallback(pageNum) {
      this.PageNumber = pageNum;
      this.getData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    getData() {
      this.$axios
        .get(`${api.ProductCategory}/${this.$route.query.id}`, {
          params: { PageNumber: this.PageNumber },
        })
        .then((res) => {
          this.items = res.data.data;
          this.totalItems = res.data.totalRecord;
          this.totalPage = Number((this.totalItems / 8).toFixed());
        });
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
.list-product {
}
/* .list-product-title {
  height: 60px;
  border-bottom: 2px solid #333;
  font-size: 32px;
  font-weight: 600;
  padding: 12px 48px;
  color: #3daa12;
} */
.list-product-content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  padding: 12px 48px;
}
.card {
  flex-basis: 22%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  position: relative;
  padding-bottom: 40px;
}
.card-content {
  overflow: hidden;
  padding: 0 12px;
}
.card-title {
  font-size: 28px;
  color: #000;
  font-weight: 500;
}
.card-title:hover {
  color: #3daa12;
}
.product-image {
  width: 100%;
  height: 350px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 12px;
  width: 100%;
  position: absolute;
  bottom: 0;
}
.card-footer span {
  color: #3daa12;
}
.pagination {
  display: flex;
  width: 100%;
  justify-content: center;
  column-gap: 16px;
}
::v-deep .disabled {
  opacity: 0.3;
}
::v-deep .page-item {
  padding: 0;
}
::v-deep .page-link-item {
  padding: 0 8px;
}
::v-deep .active {
  background-color: orange;
}
</style>
