<script setup>
    import { RouterLink, useRoute} from 'vue-router'
    import Link from './Link.vue';
    import Logo from './Logo.vue';


     const route = useRoute()

</script>


<template>
    <header class="px-10 py-5 bg-gray-700 flex  justify-between absolute top-0 items-center w-full z-10">
        <div>
            <Logo />
        </div>

        <nav class="flex gap-4">
            <RouterLink
                :to="{name: 'products'}"
                :class="route.name == 'products' ? 'rounded-lg text-white font-bold p-2 bg-yellow-800 ' : 'rounded text-white font-bold p-2'">
                Productos
            </RouterLink>
            <RouterLink
                :to="{name: 'sales'}"
                :class="route.name == 'sales' ? 'rounded text-white font-bold p-2 bg-yellow-800' : 'rounded text-white font-bold p-2'">
                Ventas
            </RouterLink>
            <Link
                to="shop"
            >

            <font-awesome-icon :icon="['fas', 'store']" />
                Ir a Tienda
            </Link>
        </nav>
    </header>
</template>

