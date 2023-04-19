<template>
  <div class="border-b solid #ddd">
    <div class="banner text-white w-[1200px] m-auto relative min-h-[120px]">
      <router-link to="/home">
        <div class="logo" data-aos="zoom-in-right" data-aos-duration="1500">
          <img class="w-[250px]" src="../../assets/image/logo.png" alt="" />
        </div>
      </router-link>

      <div class="search-box">
        <div class="search">
          <input
            class="input"
            placeholder="Tìm kiếm sản phẩm mong muốn..."
            v-model.trim="search"
            @focus="isSearched = false"
            @focusout="onInputBlur"
            @keyup.enter="searchProduct()"
            @input="findProduct()"
            autocomplete="false"
          />
          <button class="absolute right-0 h-[40px] pr-2">
            <div class="flex">
              <span
                class="material-icons text-[#a11f2c]"
                @click="searchProduct()"
                >search</span
              >
            </div>
          </button>
          <div class="search-result" v-if="search && !isSearched">
            <div class="searchTitle" v-if="!items.length">
              Không có kết quả nào trùng khớp
            </div>
            <div class="searchTitle" v-else>
              Hiển thị {{ number }}/{{ total }} kết quả tìm kiếm trùng khớp.
            </div>
            <div ref="exclude">
              <router-link
                :to="`/detail/` + item.id"
                v-for="item in items"
                :key="item.id"
              >
                <div class="search-result-item" @click="showDetails()">
                  <img :src="item.image || avatar" alt="" />
                  <div class="name">{{ item.name }}</div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <router-link to="/cart" class="relative cursor-pointer mr-2">
        <span class="material-icons text-4xl text-[#a11f2c]">
          shopping_cart
        </span>
        <div
          class="absolute px-[0.5rem] rounded-full bg-[#a11f2c] text-center top-[-10px] right-[-10px]"
        >
          {{ qualityCart }}
        </div>
      </router-link>

      <ErrorPopup @close="close" :title="title" v-if="hasError"></ErrorPopup>
    </div>
  </div>
</template>
<script>
import ErrorPopup from "@/components/Bases/BasePopup/ErrorPopup";
import defaultAvatar from "../../assets/image/img_default.jpg";
import api from "@/js/api";

export default {
  components: {
    ErrorPopup,
  },
  data() {
    return {
      items: [],
      total: 0,
      number: 0,
      search: "",
      hasError: false,
      title: "",
      avatar: defaultAvatar,
      closeSearch: true,
      isSearched: false,
      qualityCart: "0",
    };
  },
  computed: {
    cart() {
      return this.$store.state.cart;
    },
  },
  watch: {
    search() {
      this.isSearched = false;
    },
    cart: function (value) {
      this.qualityCart = value;
    },
  },

  methods: {
    onInputBlur(event) {
      if (!this.$refs.exclude.contains(event.relatedTarget)) {
        this.isSearched = true;
      }
    },
    findProduct() {
      if (this.search) {
        this.$axios
          .get(`${api.ProductApi}/search`, {
            params: {
              pageNumber: 1,
              limit: 6,
              search_key: this.search,
            },
          })
          .then((res) => {
            this.items = res.data.data;
            this.number = res.data.data.length;
            this.total = res.data.totalRecord;
          });
      }
    },
    searchProduct() {
      if (this.search) {
        this.isSearched = true;
        this.$router.push({
          path: `/search`,
          query: { search_key: this.convertToSlug(this.search) },
        });
      } else {
        this.title = "Vui lòng điền thông tin tìm kiếm.";
        // this.hasError = true;
      }
    },
    showDetails() {
      this.isSearched = true;
    },
    close() {
      this.hasError = false;
    },
    convertToSlug(str) {
      str = str.trim().replace(/\s/g, "-");
      return str;
    },
  },
};
</script>
<style scoped>
.banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 9997;
}
.search-box {
  display: flex;
  gap: 12px;
}
.search {
  position: relative;
  z-index: 9999;
}
.input {
  width: 765px;
}
.search-result {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 26%);
  border-radius: 4px;
  z-index: 9999;
}
.searchTitle {
  color: #919191;
  font-weight: 600;
  line-height: 30px;
  padding: 0 12px;
}
.search-result-item {
  min-height: 40px;
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 4px 12px;
  color: #333;
  transition: all linear 0.6s;
}
.search-result-item:hover {
  background: #ddd;
  /* color: #3daa12; */
}
.search-result-item img {
  height: 36px;
  width: 36px;
  border-radius: 100%;
}
.search-result-item .name {
  flex-grow: 1;
  text-overflow: ellipsis;
}
</style>
