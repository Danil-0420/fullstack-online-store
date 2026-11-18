import {$authHost} from "./index";

export const getBasket = async () => {
    const {data} = await $authHost.get('api/basket')
    return data
}

export const addProductToBasket = async (productId, quantity = 1) => {
    const {data} = await $authHost.post('api/basket', {productId, quantity})
    return data
}

export const deleteProductFromBasket = async (basketItemId) => {
    const {data} = await $authHost.delete('api/basket/' + basketItemId)
    return data
}

export const decreaseProductAmount = async (basketItemId) => {
    const {data} = await $authHost.patch('api/basket/decrease/' + basketItemId)
    return data
}

