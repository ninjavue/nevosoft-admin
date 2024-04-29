const admin = {
    state: {
        admin: [],
        einAdmin:{}
    },
    getters: {
        admin(state) {
            return state.admin
        },
        einAdmin(state) {
            return state.einAdmin
        },
    },
    mutations: {
        admin(state, payload) {
            state.admin = payload
        },
        einAdmin(state, payload) {
            state.einAdmin = payload
        },
        addAdmin(state, payload) {
            state.admin.push(payload)
        },
        saveAdmin(state, payload) {
            state.admin = state.admin.map(x => {
                if (x._id == payload._id) {
                    return payload
                }
                return x
            })
        },
        deleteAdmin(state, payload) {
            let index = state.admin.findIndex(x => x._id == payload._id)
            state.admin.splice(index, 1)
        }
    },
    actions: {
        allAdmin(context) {
            try {
                context.dispatch('getAxios', 'auth/all').then(res => {
                    context.commit('admin', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        getAdmin(context, payload) {
            try {
                return context.dispatch('getAxios', `auth/${payload}`)
            } catch (error) {
                console.log(error)
            }
        },
        postAdmin(context, payload) {
            try {
                context.dispatch('postAxios', {
                    url: 'auth/create/login',
                    data: payload
                }).then(res => {
                    context.commit('addAdmin', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        editAdmin(context, payload) {
            try {
                context.dispatch('editAxios', {
                    url: `auth/edit/${payload._id}`,
                    data: payload
                }).then(res => {
                    context.commit('saveAdmin', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        deleteAdmin(context, payload) {
            try {
                context.dispatch('deleteAxios', `auth/delete/${payload}`).then(res => {
                    context.commit('deleteAdmin', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
}


export default admin