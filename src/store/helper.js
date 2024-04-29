import axios from 'axios'


const helper = {
    actions: {
        getAxios(context, payload) {
            return axios.get(`${context.getters.url}/${payload}`).catch((error) => {
                console.log(error)
            })
        },
        postAxios(context, payload) {
            try {
                return axios.post(`${context.getters.url}/${payload.url}`, payload.data).catch(err => {
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        },
        editAxios(context, payload) {
            return axios.put(`${context.getters.url}/${payload.url}`, payload.data).catch((error) => {
                console.log(error)
            })
        },
        deleteAxios(context, payload) {
            return axios.delete(`${context.getters.url}/${payload}`).catch((error) => {
                console.log(error)
            })
        }
    }
}


export default helper