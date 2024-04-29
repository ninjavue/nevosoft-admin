const auth = {
    state: {
        auth: [],
        einAuth:{}
    },
    getters: {
        auth(state) {
            return state.auth
        },
        einAuth(state) {
            return state.einAuth
        },
    },
    mutations: {
        auth(state, payload) {
            state.auth = payload
        },
        einAuth(state, payload) {
            state.einAuth = payload
        },
        addAuth(state, payload) {
            state.auth.push(payload)
        },
        saveAuth(state, payload) {
            state.auth = state.auth.map(x => {
                if (x.id == payload.id) {
                    return payload
                }
                return x
            })
        },
        deleteAuth(state, payload) {
            let index = state.auth.findIndex(x => x.id == payload.id)
            state.auth.splice(index, 1)
        }
    },
    actions: {
        allAuth(context) {
            try {
                context.dispatch('getAxios', 'auth/all').then(res => {
                    context.commit('auth', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        getAuth(context, payload) {
            try {
                return context.dispatch('getAxios', `auth/${payload}`)
            } catch (error) {
                console.log(error)
            }
        },
        postAuth(context, payload) {
            try {
                context.dispatch('postAxios', {
                    url: 'auth/create/login',
                    data: payload
                }).then(res => {
                    context.commit('addAuth', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        postLogin(context, payload) {
            try {
                return context.dispatch('postAxios', {
                    url: 'auth/login',
                    data: payload
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        editRegion(context, payload) {
            try {
                context.dispatch('editAxios', {
                    url: `auth/edit/${payload.id}`,
                    data: payload
                }).then(res => {
                    context.commit('saveAuth', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        deleteRegion(context, payload) {
            try {
                console.log(payload)
                context.dispatch('deleteAxios', `auth/delete/${payload}`).then(res => {
                    context.commit('deleteAuth', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
}


export default auth