const order = {
    state: {
        order: [],
        einOrder:{}
    },
    getters: {
        order(state) {
            return state.order
        },
        einOrder(state) {
            return state.einOrder
        },
    },
    mutations: {
        order(state, payload) {
            state.order = payload
        },
        einOrder(state, payload) {
            state.einOrder = payload
        },
        addOrder(state, payload) {
            state.order.push(payload)
        },
        saveOrder(state, payload) {
            state.order = state.order.map(x => {
                if (x._id == payload._id) {
                    return payload
                }
                return x
            })
        },
        deleteOrder(state, payload) {
            let index = state.order.findIndex(x => x._id == payload._id)
            state.order.splice(index, 1)
        }
    },
    actions: {
        allOrder(context) {
            try {
                context.dispatch('getAxios', 'order').then(res => {
                    context.commit('order', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        getOrder(context, payload) {
            try {
                return context.dispatch('getAxios', `order/${payload}`)
            } catch (error) {
                console.log(error)
            }
        },
        postOrder(context, payload) {
            try {
                context.dispatch('postAxios', {
                    url: 'order',
                    data: payload
                }).then(res => {
                    context.commit('addOrder', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        editOrder(context, payload) {
            try {
                context.dispatch('editAxios', {
                    url: `order/edit/${payload._id}`,
                    data: payload
                }).then(res => {
                    context.commit('saveOrder', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        editStatus(context, payload) {
            try {
                context.dispatch('editAxios', {
                    url: `order/status/${payload._id}`,
                    data: payload
                }).then(res => {
                    context.commit('saveOrder', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        deleteOrder(context, payload) {
            try {
                context.dispatch('deleteAxios', `order/delete/${payload}`).then(res => {
                    context.commit('deleteOrder', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
}


export default order