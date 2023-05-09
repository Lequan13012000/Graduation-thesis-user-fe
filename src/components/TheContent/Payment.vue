<template>
    <div class="payment-form">
        <div class="w-[1200px] m-auto relative" data-aos="flip-right" data-aos-easing="ease-out-cubic"
            data-aos-duration="1500">
            <div class="payment-form-content">
                <div class="cart-header">
                </div>
                <div class="form-content">
                    <div class="form-content-info">
                        <div class="text-lg font-bold pb-3">THÔNG TIN NHẬN HÀNG</div>
                        <div class="flex justify-center">
                            <div class="flex flex-col gap-y-8">
                                <div class="flex items-center">
                                    <div class="w-[12rem]">
                                        <i class="fas fa-user"></i>
                                        <span>Họ tên người nhận:</span>
                                    </div>
                                    <div>
                                        <input type="text" class="input" placeholder="Họ tên..." v-model="payMentInfo.name"
                                            :class="{ 'input-error': !isName.isTrue }" @change="ValidateOrder"
                                            :title="isName.title" />
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <div class="w-[12rem]">
                                        <i class="fas fa-phone-alt"></i>
                                        <span>Số điện thoại:</span>
                                    </div>
                                    <div> <input type="text" class="input" placeholder="Số điện thoại..."
                                            v-model="payMentInfo.tel" :class="{ 'input-error': !isTel.isTrue }"
                                            @change="ValidateOrder" :title="isTel.title" /></div>
                                    <div>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <div class="w-[12rem]">
                                        <i class="fas fa-home"></i>
                                        <span>Địa chỉ nhận hàng:</span>
                                    </div>
                                    <input type="text" class="input" placeholder="Địa chỉ..." v-model="payMentInfo.address"
                                        :class="{ 'input-error': !isAddress.isTrue }" @change="ValidateOrder"
                                        :title="isAddress.title" />
                                </div>
                                <div class="flex items-center">
                                    <div class="w-[12rem]">
                                        <i class="fas fa-comment-dots"></i>
                                        <span>Ghi chú:</span>
                                    </div>

                                    <div>
                                        <input type="text" class="input" placeholder="Ghi chú..."
                                            v-model="payMentInfo.notes" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div>
                        <div class="header-cart-item">
                            <div>STT</div>
                            <div style="margin-right: 9rem;margin-left: 2rem;"><span class="num-items-checkbox">Sản
                                    phẩm</span>
                            </div>
                            <div style="margin-left: 10rem;margin-right: 3rem;">Đơn giá</div>
                            <div style="margin-right: 1.2rem;">Số lượng</div>
                            <div>Thành tiền</div>
                            <div></div>
                        </div>
                        <div class="content-card-item">
                            <div class="item-card" v-for="(item, index) in items" :key="item.id + index + item.name">
                                <div style="min-width: 40px">{{ index + 1 }}
                                </div>
                                <div style="display: flex;align-items: center;padding-left: 7rem;">
                                    <img :src="item.image || avatar" alt="" />
                                    <p
                                        style="margin-right: 2rem;text-overflow: ellipsis;word-break: break-word;width: 250px;text-align: left;margin-left: 1rem;">
                                        {{ item.name }}</p>
                                </div>
                                <p class="price"><span>₫</span> {{ item.price }}</p>
                                <div style="padding-left: 9rem;padding-right: 2rem">
                                    <p>{{ item.quantity }}</p>
                                </div>
                                <p class="price" style="min-width: 120px;padding-left: 6rem;"><span>₫</span> {{ item.price *
                                    item.quantity
                                }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="cart-footer">
                        <div class="h-[3rem] bg-[#9b9090] text-white flex items-center px-5 rounded-lg ml-10"> <button
                                class="button" @click="GetDefault()">
                                ĐIỀN MẶC ĐỊNH</button>
                        </div>
                        <div class="flex items-center ">
                            <div class="flex items-center ml-10 text-lg font-bold">Tổng số tiền: <p class="price"
                                    style="font-size: 18px;">
                                    <span>₫</span> {{ totalMoney }}
                                </p>
                            </div>
                            <div class="h-[3rem] bg-[#C92127] text-white flex items-center px-5 rounded-lg mx-[2.5rem]">
                                <button class="button" @click="AddOrder()">ĐẶT HÀNG</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from "@/js/api";
export default {
    data() {
        return {
            items: [],
            customer: {},
            hasError: false,
            hasToast: false,
            title: "",
            payMentInfo: {
                name: "",
                tel: "",
                address: "",
                notes: "",
            },
            isName: { title: "", isTrue: true },
            isTel: { title: "", isTrue: true },
            isAddress: { title: "", isTrue: true },
        };
    },
    created() {
        this.items = this.getPayment;
    },
    computed: {
        getCustomer() {
            return this.$store.state.customer;
        },
        getPayment() {
            return this.$store.state.payment;
        },
        totalMoney() {
            return this.items.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );
        },
    },
    methods: {
        ValidateOrder() {
            let check = 0;
            if (!this.payMentInfo.address) {
                this.isAddress.title = "Địa chỉ nhận hàng không được để trống.";
                this.isAddress.isTrue = false;
                this.title = "Địa chỉ nhận hàng không được để trống.";
                check = check + 1;
            } else {
                this.isAddress.title = "";
                this.isAddress.isTrue = true;
            }
            if (!this.payMentInfo.tel) {
                this.isTel.title = "Số điện thoại không được phép bỏ trống.";
                this.isTel.isTrue = false;
                this.title = "Số điện thoại không được phép bỏ trống.";
                check = check + 1;
            } else {
                this.isTel.title = "";
                this.isTel.isTrue = true;
            }
            if (this.payMentInfo.tel && !/^\d{10}$/.test(this.payMentInfo.tel)) {
                this.isTel.title = "Số diện thoại không đúng định dạng.";
                this.isTel.isTrue = false;
                this.title = "Số điện thoại không đúng định dạng.";
                check = check + 1;
            } else {
                this.isTel.title = "";
                this.isTel.isTrue = true;
            }
            if (!this.payMentInfo.name) {
                this.isName.title = "Họ tên không được phép bỏ trống.";
                this.isName.isTrue = false;
                this.title = "Họ tên không được phép bỏ trống.";
                check = check + 1;
            } else {
                this.isName.title = "";
                this.isName.isTrue = true;
            }
            return check;
        },
        GetDefault() {
            let customer = this.getCustomer;
            this.payMentInfo.name = customer.name;
            this.payMentInfo.tel = customer.tel;
            this.payMentInfo.address = customer.address;
        },
        async AddOrder() {
            if (this.ValidateOrder() > 0) {
                this.hasError = true;
            } else {
                var today = new Date();
                var date =
                    today.getFullYear() +
                    "-" +
                    (today.getMonth() + 1) +
                    "-" +
                    today.getDate();
                let order = {
                    id: 1,
                    cus_id: this.getCustomer.id,
                    order_date: date,
                    status: "Đang chờ xác nhận",
                    notes: this.payMentInfo.notes,
                    address: this.payMentInfo.address,
                    tel: this.payMentInfo.tel,
                    name: this.payMentInfo.name,
                };
                let addedOrder;
                await this.$axios.post(api.OrderApi, order).then((res) => {
                    addedOrder = res.status;
                });
                if (addedOrder == 201) {
                    let orderId = await this.$axios
                        .get(`${api.OrderApi}/newOrder`)
                        .then((res) => res.data);
                    let od = this.items.map((item) => ({
                        prod_id: item.prod_id,
                        order_id: orderId,
                        quantity: item.quantity,
                        price: item.price,
                    }));
                    this.$axios.post(api.OrderDetailApi, od).then((res) => {
                        if (res.status == 201) {
                            this.title = "Tạo đơn hàng thành công!";
                            this.hasToast = true;
                            setTimeout(() => {
                                this.hasToast = false;
                            }, 3000);
                            this.deleteCard();
                            this.$router.replace({ path: "/home" });
                        }
                    });
                }
            }
        },
        deleteCard() {
            this.$axios.delete(`${api.CartApi}/${this.customer.id}`).then((res) => {
                if (res.status == 200) {
                    this.$store.commit("CHANGE_CART", 0);
                }
            });
        },
    }
}
</script>

<style  scoped>
table {
    border: 1px solid #ccc;
    border-collapse: collapse;
}

table tr:nth-child(2n) {
    background: #eee;
}

table th {
    height: 40px;
    line-height: 40px;
    padding: 4px 12px;
    background: #ccc;
}

table img {
    width: 36px;
    height: 36px;
    border-radius: 100%;
}

table td {
    height: 40px;
    line-height: 40px;
    padding: 4px 12px;
    text-align: center;
}

table input {
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

.payment-form {
    border-radius: 8px;
    background-color: #f5f5f5;
    min-height: 400px;
    padding-bottom: 24px;
    padding-top: 24px;
}

.payment-form-content {}

.form-content {
    padding: 12px;
    display: flex;
    justify-content: center;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form-content-info {
    background-color: white;
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 10px;
}

.form-content .table {
    max-height: 200px;
    overflow: auto;
}

.total-money {
    height: 40px;
    font-size: 20px;
    line-height: 40px;
    color: #3daa12;
    font-weight: 600;
}

.input {
    width: 500px;
}


.content-card-item {
    background: #fff;
    border-radius: 8px;
}

.item-card {
    height: 160px;
    line-height: 40px;
    text-align: center;
    border-bottom: 1px solid #ededed;
    display: flex;
    align-items: center;
    padding-left: 5rem;
}

.item-card img {
    width: 119px;
    height: 119px;
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

.price {
    font-size: 14px;
    font-weight: 600;
    color: #d0011b;
    padding: 24px 12px;
    display: flex;
    column-gap: 3px;
    padding-left: 0.5rem;
    min-width: 80px
}
</style>