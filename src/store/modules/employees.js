const employees = {
    state: {
        employees: [],
        einEmploye:{}
    },
    getters: {
        employees(state) {
            return state.employees
        },
        einEmploye(state) {
            return state.einEmploye
        },
    },
    mutations: {
        employees(state, payload) {
            state.employees = payload
        },
        einEmploye(state, payload) {
            state.einEmploye = payload
        },
        addEmploye(state, payload) {
            state.employees.push(payload)
        },
        saveEmploye(state, payload) {
            state.employees = state.employees.map(x => {
                if (x._id == payload._id) {
                    return payload
                }
                return x
            })
        },
        deleteEmploye(state, payload) {
            let index = state.employees.findIndex(x => x._id == payload._id)
            state.employees.splice(index, 1)
        }
    },
    actions: {
        allEmploye(context) {
            try {
                context.dispatch('getAxios', 'employees').then(res => {
                    context.commit('employees', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        getEmploye(context, payload) {
            try {
                return context.dispatch('getAxios', `employees/${payload}`)
            } catch (error) {
                console.log(error)
            }
        },
        postEmploye(context, payload) {
            try {
                context.dispatch('postAxios', {
                    url: 'employees',
                    data: payload
                }).then(res => {
                    context.commit('addEmploye', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        editEmploye(context, payload) {
            try {
                const formData = new FormData();
                formData.append("full_name", payload.full_name);
                formData.append("salary", payload.salary);
                formData.append("job", payload.job);
                formData.append("img", payload.img[0]);

                context.dispatch('editAxios', {
                    url: `employees/edit/${payload._id}`,
                    data: formData
                }).then(res => {
                    context.commit('saveEmploye', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        },
        deleteEmploye(context, payload) {
            try {
                context.dispatch('deleteAxios', `employees/delete/${payload}`).then(res => {
                    context.commit('deleteEmploye', res.data)
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
}


export default employees