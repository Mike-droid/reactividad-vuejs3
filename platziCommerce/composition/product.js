app.component("product", {
  template: /* vue-html */ `
  <section class="product">
    <div class="product__thumbnails">
      <div
        v-for="(image, index) in product.images"
        :key="image.thumbnail"
        class="thumb"
        :class="{ active: activeImage === index }"
        :style="{ backgroundImage: 'url(' + product.images[index].thumbnail + ')' }"
        @click="activeImage = index"
      >
      </div>
    </div>
    <div class="product__image">
      <img
        :src="product.images[activeImage].image"
        alt="product.name"
      />
    </div>
    </section>
    <section class="description">
      <h4>{{ product.name.toUpperCase() }} {{ product.stock === 0 ? '😭' : '😎' }}</h4>
      <span
        class="badge new"
        v-if="product.new"
      >
        Nuevo
      </span>
      <span
        class="badge offer"
        v-if="product.offer"
      >
        Oferta
      </span>
      <p
        class="description__status"
        v-if="product.stock <= 10 && product.stock > 1"
      >
        ¡Quedan pocas unidades!
      </p>
      <p
        class="description__status"
        :style="{ color: description_color }"
        v-if="product.stock === 1"
      >
        ¡Queda una unidad!
      </p>
      <p
        class="description__status"
        v-else-if="product.stock === 0"
      >
        ¡El producto está agotado!
      </p>
      <p
        class="description__status"
        v-else
      >
        Quedan {{ product.stock }} unidades disponibles
      </p>
      <p
        class="description__price">
        {{ product.name }} - $ {{ new Intl.NumberFormat("es-MX").format(product.price) }}
      </p>
      <div class="discount">
        <span>Código de descuento: </span>
        <input
          type="text"
          placeholder="Ingresa tu código"
          @keyup.enter="applyDiscount($event)"
        >
      </div>
      <button
        :disabled="product.stock === 0"
        @click="sendtocart"
      >
        Agregar al carrito
      </button>
    </section>
  `,

  props: ["product"],
  emits: ["sendtocart"],

  setup(props, context) {
    const productState = reactive({
      activeImage: 0,
      description_color: computed(() => props.product.stock <= 1 ? "rgb(255, 0, 0)" : "rgb(104, 104, 209)")
      //description_color: "rgb(104, 104, 209)",
    });

    /* const description_color = computed(() => {
      return props.product.stock <= 1 ? "rgb(255, 0, 0)" : "rgb(104, 104, 209)";
    }) */

    function sendtocart() {
      context.emit("sendtocart", props.product);
    }

    const discountCodes = ref(['Platzi20', 'Mike']);
    function applyDiscount(event) {
      const discountCodeIndex = discountCodes.value.indexOf(event.target.value);
      if(discountCodeIndex >= 0) {
        props.product.price *= 50 / 100
        discountCodes.value.splice(discountCodeIndex, 1);
        //! Importante usar value para que se refleje en el DOM
      }
    }

    watch(() => productState.activeImage,
      (newValue, oldValue) => {
        console.log(`${oldValue} => ${newValue}`);
    })

    /* watch(() => props.product.stock,
      (stock) => {
        if(stock <= 1) {
          productState.description_color = 'rgb(255, 0, 0)'
        }
    }) */

    return {
      ...toRefs(productState),
      applyDiscount,
      sendtocart,
      //description_color
    }
  }
})