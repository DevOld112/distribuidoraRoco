import { computed, ref, inject } from 'vue'
import { defineStore } from 'pinia'
import { useFirestore, useCollection, useFirebaseStorage } from 'vuefire'
import { collection, addDoc, where, query, limit, orderBy, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import Swal from 'sweetalert2';

export const useProductsStore = defineStore('products', () => {

    const toast = inject('toast')

    const db = useFirestore()
    const storage = useFirebaseStorage()

    const selectedCategory = ref(1)

    const categories = [
        { id: 1, name: 'Agua', icon: 'droplet'},
        { id: 2, name: 'Hielo',  icon: 'snowflake'}
    ]
    
    const q = query( 
        collection(db, 'products'),
        orderBy('availability', 'asc')
    )

    const productsCollection = useCollection( q )

    async function createProduct(product) {
        await addDoc( collection( db, 'products'), product)
    }

    async function updateProduct(docRef, product) {
        const { image, url, ...values} = product
        if(image.length) {
            await updateDoc(docRef, {
                ...values,
                image: url.value
            })
        } else {
            await updateDoc(docRef, values)
        }
    }

    async function deleteProduct(id) {

        try {
            const result = await Swal.fire({
                title: '¿Deseas eliminar esta venta?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
                });

                if(result.isConfirmed){
                    const docRef = doc(db, 'products', id)
                    const docSnap = await getDoc(docRef)
                    const {image} = docSnap.data()
                    const imageRef = storageRef(storage, image)

                await Promise.all([
                    deleteDoc(docRef),
                    deleteObject(imageRef)
                    ])

                return toast.open({
                    message: 'Producto eliminado Correctamente',
                    type: 'success'
                 })
            }


        } catch (error) {
            console.log(error)
        }


        
            
        
    }

    const categoryOptions = computed(() => {
        const options = [
            {label: 'Seleccione', value: '', attrs: {disabled: true } },
            ...categories.map(category => (
                {label: category.name, value: category.id}
            ))
        ]
        return options
    })

    const noResults = computed(() => productsCollection.value.length === 0)

    const filteredProducts = computed(() => {
        return productsCollection.value
            .filter( product => product.category === selectedCategory.value)
            .filter( product => product.availability > 0)
    })

    return {
        createProduct,
        updateProduct,
        deleteProduct,
        productsCollection,
        categories,
        selectedCategory,
        categoryOptions,
        noResults,
        filteredProducts
    }
})