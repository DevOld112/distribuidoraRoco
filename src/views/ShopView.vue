
<script setup>
    import { storeToRefs } from 'pinia'
    import MainNav from '../components/MainNav.vue';
    import ProductCard from '../components/ProductCard.vue';
    import Footer from '../components/Footer.vue';
    import ShoppingCart from '../components/ShoppingCart.vue';
    import { useProductsStore } from '../stores/products';
    const products = useProductsStore()
    const { filteredProducts, noResults } = storeToRefs(products)
</script>


<template>
    <MainNav />

    <main class="pt-10 lg:flex lg:h-screen lg:overflow-y-hidden p-2 ">
        <div class="lg:w-2/3 lg:screen lg:overflow-y-scroll py-24 px-10">
            <p v-if="noResults" class="text-center text-4xl font-black">No hay Productos</p>

            <div 
                v-else
                class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-5"
            >
                <ProductCard
                    v-for="product in filteredProducts"
                    :key="product.id"
                    :product="product"
                />
            </div>
        </div>

        <aside  class="lg:w-1/3 lg:screen lg:overflow-y-scroll py-24 px-10 mt-10 bg-gray-200 ">
            <ShoppingCart />
        </aside>
    </main>

    <Footer />
</template>
