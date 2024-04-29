const type = {
    state: {
        type: [],
        einType:{}
    },
    getters: {
        type(state) {
            return state.type
        },
        einType(state) {
            return state.einType
        },
    },
    mutations: {
        type(state, payload) {
            state.type = payload
        },
        einType(state, payload) {
            state.einType = payload
        },
        addType(state, payload) {
            state.type.push(payload)
        },
        saveType(state, payload) {
            state.type = state.type.map(x => {
                if (x._id == payload._id) {
                    return payload
                }
                return x
            })
        },
        deleteType(state, payload) {
            let index = state.type.findIndex(x => x._id == payload._id)
            state.type.splice(index, 1)
        }
    },
    actions: {
        allType(context) {
            try {
                context.dispatch('getAxios', 'type').then(res => {
                    context.commit('type', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        getType(context, payload) {
            try {
                return context.dispatch('getAxios', `type/${payload}`)
            } catch (error) {
                console.log(error)
            }
        },
        postType(context, payload) {
            try {
                context.dispatch('postAxios', {
                    url: 'type',
                    data: payload
                }).then(res => {
                    context.commit('addType', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        editType(context, payload) {
            try {
                context.dispatch('editAxios', {
                    url: `type/edit/${payload._id}`,
                    data: payload
                }).then(res => {
                    context.commit('saveType', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        deleteType(context, payload) {
            try {
                context.dispatch('deleteAxios', `type/delete/${payload}`).then(res => {
                    context.commit('deleteType', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
}


export default type