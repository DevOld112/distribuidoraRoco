import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import { useFirestore, useCollection, useFirebaseStorage } from 'vuefire'
import { collection, addDoc, where, query, limit, orderBy, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import Swal from 'sweetalert2';

export const useSalesStore = defineStore('sales', () => {

    const date = ref('')
    const db = useFirestore()
    const toast = inject('toast')

    const salesSource = computed(() => {
        if(date.value) {
            const q = query(
                collection(db, 'sales'),
                where('date', '==', date.value)
            )
            return q
        }
    })

    const salesCollection = useCollection(salesSource)
    
    
    const isDateSelected = computed(() => date.value)
    
    const noSales = computed(() => !salesCollection.length && date.value )

    const totalSalesOfDay = computed(() => {
        console.log(salesCollection.value.reduce((total, sale) => total + sale.total, 0));
        return salesCollection.value ? salesCollection.value.reduce((total, sale) => total + sale.total, 0) : 0;
    });
    
    const pricePurchaseOfDay = computed(() => {
        const result = salesCollection.value.reduce((total, sale) => {
            const itemTotal = sale.items.reduce(
                (itemSum, item) => itemSum + item.purchasePrice * item.quantity,
                0
            );
            return total + itemTotal;
        }, 0);
    
        console.log(result);
        return result;
    });
    
    const taxesOfDay = computed(() => {
        const result = salesCollection.value.reduce((total, sale) => total + sale.taxes, 0);
    
        console.log(result);
        return result;
    });
    

    async function deleteSale(id) {

        const docRefs = doc(db, 'sales', id)

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
                salesCollection.value = salesCollection.value.filter(sale => sale.id !== id)

                await deleteDoc(docRefs)
   
                return toast.open({
                   message: 'Venta eliminada Correctamente',
                   type: 'success'
                })
            }

        } catch (error) {
            console.log(error);
            toast.open({
                message: 'Ocurrió un error al intentar eliminar la venta.',
                type: 'error'
            });
        }

        
        
    }

    return {
        date,
        isDateSelected,
        salesCollection,
        noSales,
        totalSalesOfDay,
        deleteSale,
        pricePurchaseOfDay,
        taxesOfDay
    }
})