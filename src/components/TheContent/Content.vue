<template>
  <div class="bg-content">
    <div
      class="flex flex-col main-content w-[1200px] m-auto relative min-h-[120px]"
    >
      <div class="flex flex-row gap-x-2">
        <NavBar @changeCategory="changeCategory"></NavBar>
        <carousel
          per-page="1"
          :paginationEnabled="false"
          autoplay="true"
          autoplayTimeout="2000"
          loop="true"
        >
          <slide>
            <img
              src="https://www.anlocviet.vn/thumb/930x495/1/upload/hinhanh/642029997375361.jpg"
              alt=""
              class="h-[702px]"
          /></slide>
          <slide>
            <img
              src="https://www.anlocviet.vn/thumb/930x495/1/upload/hinhanh/0363251643821440.png"
              alt=""
              class="h-[702px]"
            />
          </slide>
          <slide>
            <img
              src="https://www.anlocviet.vn/thumb/930x495/1/upload/hinhanh/642029997375361.jpg"
              alt=""
              class="h-[702px]"
            />
          </slide>
          <slide>
            <img
              src="https://www.anlocviet.vn/thumb/930x495/1/upload/hinhanh/9469347715638350.jpg"
              alt=""
              class="h-[702px]"
            />
          </slide>
        </carousel>
      </div>
      <div class="view">
        <ListProduct
          ref="listProduct"
          v-if="!isDetail"
          :title="categoryName"
          :totalItems="totalItems"
          :items="items"
          @pageChange="pageChange"
          @viewDetail="viewDetail"
        ></ListProduct>
        <ProductDetail v-else :item="item"></ProductDetail>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/TheContent/NavBar";
import ListProduct from "@/components/Bases/ListProduct";
import ProductDetail from "@/view/ProductDetail";
import api from "@/js/api";
import { Carousel, Slide } from "vue-carousel";
export default {
  components: {
    NavBar,
    ProductDetail,
    ListProduct,
    Carousel,
    Slide,
  },
  data() {
    return {
      items: [],
      item: {},
      isDetail: false,
      categoryName: "",
      category: 1,
      totalItems: 0,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      await this.$axios
        .get(`${api.ProductApi}/pagination`, {
          params: {
            id: this.category,
            PageNumber: 1,
          },
        })
        .then((res) => {
          this.items = res.data.data;
          console.log(res.data);
          this.totalItems = res.data.totalRecord;
        });
      await this.$axios
        .get(`${api.CategoryApi}/${this.category}`)
        .then((res) => (this.categoryName = res.data.name));
    },
    async changeCategory(value) {
      this.category = value.id;
      this.isDetail = false;
      await this.$axios
        .get(`${api.ProductApi}/pagination`, {
          params: {
            id: value.id,
            PageNumber: 1,
          },
        })
        .then((res) => {
          this.items = res.data.data;
          this.totalItems = res.data.totalRecord;
          this.$refs.listProduct.resetPage();
        });
      await this.$axios
        .get(`${api.CategoryApi}/${this.category}`)
        .then((res) => (this.categoryName = res.data.name));
    },
    async pageChange(value) {
      await this.$axios
        .get(`${api.ProductApi}/pagination`, {
          params: {
            id: this.category,
            PageNumber: value,
          },
        })
        .then((res) => {
          this.items = res.data.data;
          console.log(res.data);
          this.totalItems = res.data.totalRecord;
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
    },
    viewDetail(value) {
      this.isDetail = true;
      this.item = value;
    },
  },
};
</script>
<style scoped>
.bg-content {
  background-image: url("../../assets/image/bg_body.png");
  background-position-x: center;
  background-position-y: top;
  background-size: initial;
  background-attachment: initial;
  background-origin: initial;
  background-clip: initial;
  background-color: initial;
}
.main-content {
  display: flex;
  gap: 12px;
}
.view {
  width: 100%;
  overflow: hidden;
}
</style>
