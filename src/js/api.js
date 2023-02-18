const api = "http://localhost:5139/api/v1";

const CategoryApi = `${api}/Categories`;
const ProductApi = `${api}/Products`;
const ProductCategory =  `${api}/Products/Category`;
const OrderApi = `${api}/Orders`;
const OrderDetailApi = `${api}/OrderDetails`;
const CustomerApi = `${api}/Customers`;
const CartApi = `${api}/Carts`;

export default {
    CategoryApi,
    ProductApi,
    ProductCategory,
    OrderApi,
    OrderDetailApi,
    CustomerApi,
    CartApi
}