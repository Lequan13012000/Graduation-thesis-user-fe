<template>
  <div class="bg-[#f5f5f5] rounded-lg py-6">
    <div class="list-product w-[1200px] m-auto relative flex">
      <NavBar :idCategory="getIdCategory"></NavBar>
      <div class="flex flex-col">
        <div class="list-product-content">
          <div class="category-description" v-if="description">
            {{ description }}
          </div>
          <div class="card" v-for="(item, index) in items" :key="index">
            <router-link :to="'/detail/' + item.id">
              <div
                class="flex justify-center text-sm text-center uppercase items-center border-b border-dotted border-[#d8d8d8] h-14 p-3">
                <span class="card-title">{{ item.name }}</span>
              </div>
              <div class="card-content">
                <img class="h-[162px] w-[190px]" :src="item.image || avatar" alt="" />
              </div>
              <div class="card-footer">
                <span>{{ item.price }}đ</span>
                <i class="fas fa-cart-plus text-[#a11f2c]" @click.prevent="addCart(item)"></i>
              </div>
            </router-link>
          </div>
        </div>
        <div class="pagination">
          <paginate :key="componentKey" :page-count="totalPage" :click-handler="clickCallback" :prev-text="'Trước'"
            :next-text="'Sau'" :container-class="'pagination'" :page-class="'page-item'" :prev-class="'prev-item'"
            :next-class="'next-item'" :page-link-class="'page-link-item'">
          </paginate>
        </div>
      </div>

      <ErrorPopup :title="mesage" @close="close" v-if="hasError"></ErrorPopup>
      <Loader v-if="hasLoader"></Loader>
      <ToastMesage v-if="hasToast" :mesage="mesage" @closeToast="closeToast"></ToastMesage>
    </div>
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
      pageNumber: 1,
      totalPage: 0,
      hasLoader: false,
      hasToast: false,
      hasError: false,
      mesage: "",
      componentKey: 0,
      quantity: 1,
    };
  },
  created() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  },
  computed: {
    getCustomer() {
      return this.$store.state.customer;
    },
    getSearch() {
      return this.$route.params.search;
    },
    getIdCategory() {
      return this.$route.query.id;
    },
  },
  watch: {
    getIdCategory(value) {
      this.componentKey = value;
      this.clickCallback(1);
    },
  },
  methods: {
    clickCallback(pageNum) {
      this.pageNumber = pageNum;
      this.getData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    getData() {
      this.$axios
        .get(`${api.ProductCategory}/${this.$route.query.id}`, {
          params: { pageNumber: this.pageNumber, limit: 6 },
        })
        .then((res) => {
          this.items = res.data.data;
          this.totalItems = res.data.totalRecord;
          this.totalPage = Number((this.totalItems / 6).toFixed());
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
                    this.mesage = "Thêm vào giỏ hàng thành công!";
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
                    this.mesage = "Thêm vào giỏ hàng thành công!";
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
.list-product {
  background: #fff;
  border-radius: 8px;
  padding: 24px;

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
  flex-wrap: wrap;
  gap: 24px;
  column-gap: 58px;
  padding: 0 0 24px 48px;
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
  color: #a11f2c;
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
  color: #a11f2c;
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
  line-height: 24px;
}

::v-deep .page-link-item {
  padding: 0 8px;
}

::v-deep .active {
  background-color: orange;
  border-radius: 50%;
  color: #FFFFFF;
  line-height: 24px;
}
::v-deep .prev-item{
  line-height: 24px;
}
::v-deep .next-item{
  line-height: 24px;
}
</style>
