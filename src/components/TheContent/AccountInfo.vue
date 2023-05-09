<template>
    <div class="account-info">
        <div class="w-[1200px] m-auto relative" data-aos="flip-right" data-aos-easing="ease-out-cubic"
            data-aos-duration="1500">
            <div class="account-info-header">
                THÔNG TIN TÀI KHOẢN
            </div>
            <div class="account-info-content">
                <div class="account-menu" data-aos="fade-up">
                    <div class="flex items-center"> <i class="fas fa-user"
                            style="color:#a11f2c; padding-right: 8px;"></i>Tài khoản của tôi</div>
                    <div class="pl-8" @click="mainInfo">Thông tin cá nhân</div>
                    <div class="pl-8" @click="changePassword">Đổi mật khẩu</div>
                    <div @click="myOrder"><i class="fa fa-file" style="color:#a11f2c; padding-right: 8px;"></i> Đơn
                        hàng của tôi</div>
                </div>
                <div class="account-option" data-aos="fade-right">
                    <div v-if="isMainInfo">
                        <div class="option-title">Thông tin tài khoản</div>
                        <div>
                            <div class="account-option-container">
                                <div class="info-content--item">
                                    <i class="fas fa-envelope" style="color:#a11f2c"></i>
                                    <span>Email:</span>
                                    <input type="text" class="input" v-model="customer.email" disabled>
                                </div>
                                <div class="info-content--item">
                                    <i class="fas fa-user" style="color:#a11f2c"></i>
                                    <span>Họ tên:</span>
                                    <input type="text" class="input" v-model="customer.name"
                                        :class="{ 'input-error': !isName.isTrue }" :title="isName.title">
                                </div>
                                <div class="info-content--item">
                                    <i class="fas fa-phone-alt" style="color:#a11f2c"></i>
                                    <span>Số điện thoại:</span>
                                    <input type="text" class="input" v-model="customer.tel"
                                        :class="{ 'input-error': !isTel.isTrue }" :title="isTel.title">
                                </div>
                                <div class="info-content--item">
                                    <i class="fas fa-home" style="color:#a11f2c"></i>
                                    <span>Địa chỉ:</span>
                                    <input type="text" class="input" v-model="customer.address">
                                </div>
                            </div>
                        </div>
                        <div class="account-option-action">
                            <button
                                class="h-[3rem] bg-[#fff] text-[#777E89] border-solid border-[1px] border-[#777E89] flex items-center px-5 rounded-lg"
                                @click="cancelChangeInfo">Hủy bỏ</button>
                            <!-- <button class="button button-secondary" @click="renewInfo">Làm lại</button> -->
                            <button class="h-[3rem] bg-[#C92127] text-white flex items-center px-5 rounded-lg"
                                @click="updateInfo">Cập nhật</button>
                        </div>
                    </div>

                    <div v-if="isChangePassword">
                        <div class="option-title">Đổi mật khẩu</div>
                        <div>
                            <div class="account-option-container" style="min-height: 256px">
                                <div class="info-content--item">
                                    <i class="fas fa-key" style="color:#a11f2c"></i>
                                    <span>Mật khẩu hiện tại:</span>
                                    <input type="text" class="input" placeholder="Mật khẩu hiện tại..." autocomplete="false"
                                        v-model="newPassword.oldPassword">
                                </div>
                                <div class="info-content--item">
                                    <i class="fas fa-key" style="color:#a11f2c"></i>
                                    <span>Mật khẩu mới:</span>
                                    <input type="text" class="input" placeholder="Mật khẩu mới..."
                                        v-model="newPassword.newPassword">
                                </div>
                                <div class="info-content--item">
                                    <i class="fas fa-key" style="color:#a11f2c"></i>
                                    <span>Xác nhận mật khẩu:</span>
                                    <input type="text" class="input" placeholder="Xác nhận mật khẩu..."
                                        v-model="newPassword.confirmPassword">
                                </div>
                            </div>
                        </div>
                        <div class="account-option-action">
                            <button
                                class="h-[3rem] bg-[#fff] text-[#777E89] border-solid border-[1px] border-[#777E89] flex items-center px-5 rounded-lg"
                                @click="renewPassword">Làm mới</button>
                            <button class="h-[3rem] bg-[#C92127] text-white flex items-center px-5 rounded-lg"
                                @click="updatePassword">Cập nhật</button>
                        </div>
                    </div>
                    <div v-if="isMyOrder" class="pl-[48px]">
                        <div class="option-title mb-4">Đơn Hàng</div>
                        <div class="account-option-container h-[500px] overflow-y-scroll" style="justify-content: start;align-items: unset;">
                            <table>
                                <thead class="sticky top-0 bg-[#a11f2c] text-white">
                                    <tr>
                                        <th>STT</th>
                                        <th>Ngày yêu cầu</th>
                                        <th>Ghi chú</th>
                                        <th>Tình trạng</th>
                                        <th>Thao tác</th>
                                    </tr> 
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in orderList" :key="item.id + index">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ item.order_date }}</td>
                                        <td>{{ item.notes }}</td>
                                        <td>{{ item.status }}</td>
                                        <td><span class="delete" @click="deleteOrder(item)">Hủy</span></td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ErrorPopup :title="title" @close="close" v-if="hasError"></ErrorPopup>
        <QuestionPopup :title="title" @close="close" @yes="yes" v-if="hasQuestion"></QuestionPopup>
        <ToastMesage :mesage="title" @closeToast="closeToast" v-if="hasToast"></ToastMesage>
        <Loader v-if="hasLoader"></Loader>
    </div>
</template>
<script>
import ErrorPopup from '@/components/Bases/BasePopup/ErrorPopup'
import QuestionPopup from '@/components/Bases/BasePopup/QuestionPopup'
import ToastMesage from '@/components/Bases/ToastMesage'
import Loader from '@/components/Bases/Loader'
import api from '@/js/api'
export default {
    components: {
        ErrorPopup,
        QuestionPopup,
        ToastMesage,
        Loader
    },
    data() {
        return {
            isMainInfo: true,
            isChangePassword: false,
            isMyOrder: false,
            customer: {},
            isPassword: { title: "", isTrue: true },
            isName: { title: "", isTrue: true },
            isTel: { title: "", isTrue: true },
            title: "",
            hasError: false,
            hasQuestion: false,
            hasToast: false,
            newPassword: {
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            },
            hasLoader: false,
            orderList: [],
            selectedOrder: ""
        }
    },
    created() {
        this.customer = this.getCustomer;
        if (!this.customer) {
            this.$router.replace({ path: "/home" })
        }
        this.getOrder();
    },
    computed: {
        getCustomer() {
            return this.$store.state.customer;
        },
    },
    methods: {
        mainInfo() {
            this.isMainInfo = true;
            this.isChangePassword = false;
            this.isMyOrder = false;
        },
        changePassword() {
            this.isMainInfo = false;
            this.isChangePassword = true;
            this.isMyOrder = false;
        },
        myOrder() {
            this.isMainInfo = false;
            this.isChangePassword = false;
            this.isMyOrder = true;
        },
        cancelChangeInfo() {
            this.customer = { ...this.getCustomer };
        },
        renewInfo() {
            this.customer.name = ""
            this.customer.tel = ""
            this.customer.address = ""
        },
        async getOrder() {
            await this.$axios.get(`${api.OrderApi}/${this.customer.id}`).then(res => {
                this.orderList = res.data.map(order => {
                    let date = order.order_date.slice(0, 10).split('/');
                    return {
                        id: order.id,
                        order_date: `${date[1]}/${date[0]}/${date[2]}`,
                        notes: order.notes,
                        status: order.status
                    }
                });
            })
        },
        updateInfo() {
            let check = 0;
            if (!this.customer.name) {
                this.isName.title = "Họ tên không được phép bỏ trống.";
                this.isName.isTrue = false;
                this.title = "Họ tên không được phép bỏ trống.";
                check = check + 1;
            }
            else {
                this.isName.title = "";
                this.isName.isTrue = true;

            }
            if (this.customer.tel ? !(/^\d{10}$/.test(this.customer.tel)) : false) {
                this.isTel.title = "Số diện thoại không đúng định dạng.";
                this.isTel.isTrue = false;
                this.title = "Số điện thoại không đúng định dạng.";
                check = check + 1;
            }
            else {
                this.isTel.title = "";
                this.isTel.isTrue = true;
            }
            if (check === 0) {
                this.hasLoader = true;
                this.$axios.put(`${api.CustomerApi}/${this.customer.id}`, this.customer).then(res => {
                    if (res.status === 200) {
                        this.$store.commit("TOGGLE_CUSTOMER", this.customer);
                        this.title = "Cập nhật thành công!"
                        this.hasToast = true;
                        setTimeout(() => {
                            this.hasToast = false;
                        }, 3000);
                    }
                }).finally(() => this.hasLoader = false)
            }
            else {
                this.hasError = true;
            }

        },
        renewPassword() {
            this.newPassword = {};
        },
        updatePassword() {
            if (this.newPassword.oldPassword === this.customer.password) {
                if (!this.newPassword.newPassword) {
                    this.isPassword.title = "Mật khẩu mới không được phép bỏ trống.";
                    this.isPassword.isTrue = false;
                    this.title = "Mật khẩu mới không được phép bỏ trống.";
                    this.hasError = true;
                    return;
                }
                if (this.newPassword.newPassword === this.newPassword.confirmPassword) {
                    this.customer.password = this.newPassword.newPassword;
                    this.hasToast = true
                    this.$axios.put(`${api.CustomerApi}/${this.customer.id}`, this.customer).then(res => {
                        if (res.status === 200) {
                            this.$store.commit("TOGGLE_CUSTOMER", this.customer);
                            this.title = "Cập nhật thành công!"
                            this.hasToast = true;
                            setTimeout(() => {
                                this.hasToast = false;
                            }, 3000);
                            this.newPassword = {}
                        }
                    }).finally(() => this.hasLoader = false)
                }
                else {
                    this.title = "Xác nhận mật khẩu không chính xác, vui lòng nhập lại."
                    this.hasError = true;
                }
            }
            else {
                this.title = "Mật khẩu hiện tại không đúng, vui lòng nhập chính xác."
                this.hasError = true;
            }
        },
        deleteOrder(item) {
            if (item.status == "Đã giao hàng") {
                this.title = "Đơn hàng này đã giao, không thể hủy"
                this.hasError = true;
                return
            }
            this.title = "Bạn có thật sự muốn hủy đơn hàng này không?"
            this.hasQuestion = true;
            this.selectedOrder = item.id;
        },
        close() {
            this.hasError = false;
            this.hasQuestion = false;
        },
        yes() {
            this.hasLoader = true;
            this.$axios.delete(`${api.OrderApi}/${this.selectedOrder}`).then(() => {
                this.title = "Hủy đơn hàng thành công";
                this.hasQuestion = false;
                this.hasToast = true;
                setTimeout(() => {
                    this.hasToast = false
                }, 3000);
                this.getOrder();
            }).finally(() => this.hasLoader = false)
        },
        closeToast() {
            this.hasToast = false;
        }
    },
    watch: {
        getCustomer: function (value) {
            this.customer = value;
        }
    }
}
</script>
<style scoped>
.account-info {
    border-radius: 8px;
    background-color: #f5f5f5;
    min-height: 400px;
    padding-bottom: 24px;
}

.account-info-header {
    margin: 0px 0 0;
    font-weight: 500;
    color: #333333 !important;
    line-height: 20px;
    font-size: 20px;
    padding-top: 24px;
    padding-bottom: 24px;
}

.account-info-content {
    display: flex;
    padding: 24px 48px;
    /* gap: 36px; */
    background: #fff;
    border-radius: 8px;
}

.account-menu {
    min-width: 300px;
}

.account-menu div {
    height: 40px;
    display: block;
    line-height: 40px;
    cursor: pointer;
}

.account-menu div:hover {
    color: #a11f2c;
}

.account-option {
    flex-grow: 1;
    border-left: 1px solid #ddd;
}

.account-option-container {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.option-title {
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
    font-weight: 600;
}

.info-content {
    display: flex;
    justify-content: center;
}

.info-content--item {
    display: flex;
    gap: 24px;
    justify-items: center;
    margin: 12px 0;
}

.info-content--item i {
    line-height: 40px;
}

.info-content--item span {
    width: 150px;
    line-height: 40px;
}

.info-content--item input {
    width: 400px;
}

.account-option-action {
    display: flex;
    gap: 24px;
    padding: 12px;
    justify-content: center;
}

table {
    border-collapse: collapse;
}

table th {
    padding: 8px 12px;
    border: 1px solid #ccc;
    text-align: center;
    height: 48px;
}

table td {
    padding: 8px 12px;
    border: 1px solid #ccc;
    text-align: center;
}

.delete {
    font-size: 14px;
    line-height: 24px;
    color: #ccc;
    text-align: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
}

.delete:hover {
    color: #a11f2c;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
  border-radius: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>