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
      <badge :product="product" />
      <p
        class="description__status"
        v-if="product.stock <= 10 && product.stock > 1"
      >
        ¡Quedan pocas unidades!
      </p>
      <p
        class="description__status"
        v-if="product.stock === 1"
        :style="{color: description_color}"
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
      <p class="description__content">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio vero labore deserunt, incidunt eos, sunt eveniet quidem tempora iste debitis consectetur perferendis ratione velit asperiores mollitia corrupti harum.
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
        @click="sendToCart()"
      >
        Agregar al carrito
      </button>
    </section>
  `,

  props: ["product"],
  emits: ["sendtocart"],

  data() {
    return {
      activeImage: 0,
      discountCodes: ['Platzi20', 'Mike'],
      //description_color: 'rgb(104, 104, 209)'
    }
  },

  methods: {
    applyDiscount(event) {
      const discountCodeIndex = this.discountCodes.indexOf(event.target.value);
      if(discountCodeIndex >= 0) {
        this.product.price *= 50 / 100
        this.discountCodes.splice(discountCodeIndex, 1);
      }
    },

    sendToCart() {
      this.$emit("sendtocart", this.product);
    }
  },

  watch: {
    /* activeImage(Image, oldImage) {
      console.log(Image, oldImage);
    },
    "product.stock"(stock) {
      if(stock <= 1) {
        this.description_color = 'rgb(255, 0, 0)'
      }
    } */
  },

  computed: {
    description_color() {
      return this.product.stock <= 1 ? 'rgb(255, 0, 0)' : 'rgb(104, 104, 209)'
    }
  }
})