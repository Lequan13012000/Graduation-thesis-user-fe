<template>
  <div class="bg-content">
    <div
      class="flex flex-col main-content w-[1200px] m-auto relative min-h-[120px]"
    >
      <div class="list-category flex flex-row gap-x-2">
        <NavBar></NavBar>
        <carousel
          :per-page="1"
          :paginationEnabled="false"
          :autoplay="true"
          :autoplayTimeout="5000"
          :loop="true"
          :speed="2000"
        >
          <slide>
            <img
              src="https://www.anlocviet.vn/thumb/930x495/1/upload/hinhanh/642029997375361.jpg"
              alt=""
              class="h-[495px]"
          /></slide>
          <slide>
            <img
              src="https://www.anlocviet.vn/thumb/930x495/1/upload/hinhanh/0363251643821440.png"
              alt=""
              class="h-[495px]"
            />
          </slide>
          <slide>
            <img
              src="https://www.anlocviet.vn/thumb/930x495/1/upload/hinhanh/642029997375361.jpg"
              alt=""
              class="h-[495px]"
            />
          </slide>
          <slide>
            <img
              src="https://www.anlocviet.vn/thumb/930x495/1/upload/hinhanh/9469347715638350.jpg"
              alt=""
              class="h-[495px]"
            />
          </slide>
        </carousel>
      </div>
      <div class="view">
        <div v-for="(product, index) in items" :key="index">
          <ListProduct
            ref="listProduct"
            v-if="showListProduct && product.list.length"
            :data="product"
            :keyList="index"
            class="my-8"
          ></ListProduct>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/TheContent/NavBar";
import ListProduct from "@/components/Bases/ListProduct";
import api from "@/js/api";
import { Carousel, Slide } from "vue-carousel";
export default {
  components: {
    NavBar,
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
      showListProduct: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      await this.$axios.get(`${api.ProductApi}`).then((res) => {
        this.items = res.data;
        this.showListProduct = true;
      });
    },
  },
};
</script>
<style scoped>
.bg-content {
  /* background-image: url("../../assets/image/bg_body.png");
  background-position-x: center;
  background-position-y: top;
  background-size: initial;
  background-attachment: initial;
  background-origin: initial;
  background-clip: initial;
  background-color: initial; */
  background-color: #f5f5f5;
}
.main-content {
  display: flex;
  gap: 12px;
  margin: auto;
}
.list-category {
  padding-bottom: 25px;
  border-top: 3px solid #a11f2c;
  -moz-box-shadow: 0 0 5px 5px #dadada;
  -webkit-box-shadow: 0 0 5px 5px #dadada;
  box-shadow: 0 0 5px 5px #dadada;
  margin-top: 15px;
  background: #fff;
  padding: 10px;
  box-sizing: border-box;
}
.view {
  width: 100%;
  overflow: hidden;
}
</style>
