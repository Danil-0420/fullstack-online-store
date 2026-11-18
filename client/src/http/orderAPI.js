import {$authHost} from './index.js'

// admin
export const fetchAllOrders = async () => {
    const {data} = await $authHost.get('api/order/admin/all')
    return data
}

export const fetchAdminOrder = async (id) => {
    const {data} = await $authHost.get('api/order/admin/' + id)
    return data
}


export const updateOrder = async (id, status) => {
    const {data} = await $authHost.patch('api/order/update/' + id, {status})
    return data
}

export const shipOrder = async (id, tracking_number) => {
    const {data} = await $authHost.patch('api/order/update/' + id + "/ship", {tracking_number})
    return data
}

// user

export const fetchUserOrders = async () => {
    const {data} = await $authHost.get('api/order')
    return data
}

export const fetchOneUserOrder = async (id) => {
    const {data} = await $authHost.get('api/order/' + id)
    return data
}

export const createOrder = async (order) => {
    const {data} = await $authHost.post('api/order', order)
    return data
}

export const cancelOrder = async (id) => {
    const {data} = await $authHost.patch('api/order/cancel/' + id)
    return data
}
