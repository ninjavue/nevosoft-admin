const products = {
    state: {
        products: [],
        product:{}
    },
    getters: {
        products(state) {
            return state.products
        },
        product(state) {
            return state.product
        },
    },
    mutations: {
        products(state, payload) {
            state.products = payload
        },
        product(state, payload) {
            state.product = payload
        },
        addProduct(state, payload) {
            state.products.push(payload)
        },
        saveProduct(state, payload) {
            state.products = state.products.map(x => {
                if (x._id == payload._id) {
                    return payload
                }
                return x
            })
        },
        deleteProduct(state, payload) {
            let index = state.products.findIndex(x => x._id == payload._id)
            state.products.splice(index, 1)
        }
    },
    actions: {
        allProduct(context) {
            try {
                context.dispatch('getAxios', 'product').then(res => {
                    context.commit('products', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        getProduct(context, payload) {
            try {
                return context.dispatch('getAxios', `product/${payload}`)
            } catch (error) {
                console.log(error)
            }
        },
        postProduct(context, payload) {
            try {
                context.dispatch('postAxios', {
                    url: 'product',
                    data: payload
                }).then(res => {
                    context.commit('addProduct', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        editProduct(context, payload) {
            try {
                const formData = new FormData();
                formData.append("title", payload.title);
                formData.append("description", payload.description);
                formData.append("link", payload.link);
                formData.append("image", payload.image[0]);

                context.dispatch('editAxios', {
                    url: `product/edit/${payload._id}`,
                    data: formData
                }).then(res => {
                    context.commit('saveProduct', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        deleteProduct(context, payload) {
            try {
                context.dispatch('deleteAxios', `product/delete/${payload}`).then(res => {
                    context.commit('deleteProduct', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
}


export default products