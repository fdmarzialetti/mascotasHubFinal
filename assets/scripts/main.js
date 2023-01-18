const { createApp } = Vue

createApp({
    data() {
        return {
            productos: [],
            carrito: [],
            datos: [],
            valorBusqueda:"",
            modelCategoria:"todas",
            cantidadEnCarrito:0,
            modelPrecio:[],
            loadData: true
        }
    },
    created() {
        fetch("https://mindhub-xj03.onrender.com/api/petshop")
            .then(res => res.json())
            .then(data => {
                this.productos = data
                this.datos = this.productos.forEach(p => p.cantidad = 0)
                this.cargaPorPagina()
                loadData = true
            })
        if (JSON.parse(localStorage.getItem("carrito"))) {
            this.carrito = JSON.parse(localStorage.getItem("carrito"))
        } else {
            localStorage.setItem("carrito", JSON.stringify(this.carrito))
        }

    },
    methods: {
        calcularCantidad:function(){
            let carritoLocal = JSON.parse(localStorage.getItem("carrito"))
            let total=0
            carritoLocal.forEach(p=>{
                total+=p.cantidad
            })
            this.cantidadEnCarrito=total
        },
        cargaPorPagina: function () {
            let cargaProductos = JSON.parse(localStorage.getItem("carrito"))
            let setId = cargaProductos.map(c => c._id)
            this.productos.forEach(p => {
                if (!setId.includes(p._id)) {
                    cargaProductos.push(p)
                }
            })
            cargaProductos.sort((p1, p2) => p2._id - p1._id)
            const titulo = document.querySelector('title')
            if (titulo.innerText.toLowerCase().includes('productos')) {
                this.datos = cargaProductos
            } else if (titulo.innerText.toLowerCase().includes('farmacia')) {
                this.datos = cargaProductos.filter(p => p.categoria === "farmacia")
            } else if (titulo.innerText.toLowerCase().includes('jugueteria')) {
                this.datos = cargaProductos.filter(p => p.categoria === "jugueteria")
            }
        },
        filtroPorCategoria(){
            if (this.modelCategoria!=="todas") {
                this.datos=this.productos.filter(p=>p.categoria===this.modelCategoria)
            }else{
                this.datos=this.productos
            }
        },
        filtroPorPrecio:function(lista){
            if(this.modelPrecio.includes("hastaMil")){
                lista.filter(p=>p.precio<=1000)
            }
            return lista
        },
        filtro: function () {
            let filtroPorBusqueda = this.productos.filter(p => p.producto.toLowerCase().includes(this.valorBusqueda.toLowerCase()))
            
            this.datos=filtroPorBusqueda
        },
        quitarDelCarrito: function (producto) {
            if (this.carrito.some(p => p._id === producto._id)) {
                producto.disponibles++
                producto.cantidad--
                if (producto.cantidad === 0) {
                    let prodAEliminar = this.carrito.find(p => p === producto)
                    let index = this.carrito.indexOf(prodAEliminar)
                    this.carrito.splice(index, 1)

                }
                localStorage.setItem("carrito", JSON.stringify(this.carrito))
            }
            this.calcularCantidad()
        },
        agregarAlCarrito: function (producto) {
            if (producto.disponibles > 0) {
                producto.disponibles--
                producto.cantidad++
            }
            if (!this.carrito.some(p => p._id === producto._id)) {
                this.carrito.push(producto)
            }
            localStorage.setItem("carrito", JSON.stringify(this.carrito))
            datosLocales = JSON.parse(localStorage.getItem("carrito"))
            this.calcularCantidad()
        }
    }
}).mount('#app')
