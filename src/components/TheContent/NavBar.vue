<template>
  <div class="navbar">
    <div v-for="item in list" :key="item.id">
      <router-link
        :to="{
          name: 'productByCategory',
          params: { name: convertToSlug(item.name) },
          query: { id: item.id },
        }"
        class="navbar__item"
        :class="{ 'navbar-active': item.id === idCategory }"
      >
        {{ item.name }}
      </router-link>
    </div>
  </div>
</template>
<script>
import api from "@/js/api";
export default {
  props: ["idCategory"],
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getItems();
  },
  methods: {
    getItems() {
      this.$axios.get(api.CategoryApi).then((res) => {
        this.list = res.data;
      });
    },
    convertToSlug(str) {
      // remove accents
      var from =
          "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
        to =
          "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
      for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], "gi"), to[i]);
      }
      str = str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      return str;
    },
  },
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 0;
  background: transparent;
}
.navbar {
  min-width: 300px;
  overflow-x: hidden;
  overflow-y: scroll;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  height: 495px;
  text-transform: uppercase;
}
.navbar__title {
  display: flex;
  gap: 12px;
  height: 50px;
  padding: 0 24px;
  align-items: center;
}
.navbar__item {
  display: block;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: left;
  padding: 0 24px;
  border-top: 1px solid #ccc;
  /* transition: all linear 1s; */
  cursor: pointer;
  border-bottom: 1px dotted #c7c7c7;
}
.navbar__item:hover {
  background: #f17463;
  color: #fff;
}
.navbar-active {
  background: #a11f2c;
  color: #fff;
}
</style>
