# Curso de Reactividad con Vue.js 3

## Introducción: fundamentos de Vue.js

### ¿Cómo convertirte en frontend developer con Vue.js?

[Artículo en Platzi](https://platzi.com/clases/2167-vuejs/35415-como-convertirte-en-frontend-developer-con-vuejs/)

### La magia de aprender JavaScript

### ¿Qué es Vue.js? Frameworks, librerías y componentes

| Librería                                  | Framework                                             |
| ----------------------------------------- | ----------------------------------------------------- |
| Herramienta para una utilidad específica. | Conjunto de herramientas que trabajan en un proyecto. |

Ejemplos de librerías:

- [MomentJS (para manejar fechas)](https://momentjs.com/)
- [jQuery (para manipular DOM)](https://jquery.com/)
- [React (UI Components)](https://reactjs.org/)

Ejemplos de frameworks:

- [Angular](https://angular.io/)
- [Laravel](https://laravel.com/)
- [Vue](https://v3.vuejs.org/)

Vue tiene 2 capas principales que usa en todos sus proyectos:

1. Declarative rendering | Conectar la **información** con la **presentación**.
2. Componentes | Encapsular **presentación y lógica** (HTML, CSS, JS)

> La magia es solo ciencia que no entendemos aún. - Arthur C. Clarke

### Declarative rendering con JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hola mundo</title>
</head>
<body>
  <div id="app">
    <span></span>
    <br>
    <input type="text" name="" id="">
  </div>

  <script>
    const data = {
      message: 'Hola mundo desde Vue.js'
    }

    const span = document.querySelector('span')
    span.innerText = data.message

    const input = document.querySelector('input')
    input.value = data.message

    input.addEventListener('keyup', function(e) {
      span.innerText = e.target.value
    })
  </script>
</body>
</html>
```

### Declarative rendering con Vue.js

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hola mundo en VueJS 3</title>
</head>
<body>
  <div id="app">
    <span v-text="message"></span>
    <br>
    <input type="text" name="" id="" v-model="message">
  </div>

  <script src="https://unpkg.com/vue@next"></script>
  <script>
    const { createApp } = Vue

    const app = createApp({
      data() {
        return {
          message: 'Hola mundo desde Vue JS 3'
        }
      }
    })
    app.mount('#app')
  </script>
</body>
</html>
```

## Reactividad a profundidad

### ¿Qué es la reactividad?

La reactivid es un **paradigma**.

Un sistema reactivo tiene que ser resiliente (funciona incluso en situaciones de error) y escalable (puede crecer sin problemas). Es una arquitectura basada en mensajes (tienen destino, comunicación asíncrona).

### ¿Qué es un Proxy?

Los proxys son el fundamento de toda programación reactiva en JavaScript.

Los [Proxys](https://es.wikipedia.org/wiki/Servidor_proxy) son servidores intermedios que se encargar de crear una nueva conexión a través de la conexión original. Normalmente los proxys son muy seguros porque los profesionales de la tecnología de la información se encargan de crear los proxys. Además nos permiten acceder a información de distintas partes del mundo.

El **origen** es la conexión en sí misma, y el **destino** es la misma conexión, pero modificada.

### Crea tu propio miniframework: MiniVue

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hola mundo en VueJS 3</title>
</head>
<body>
  <div id="app">
    <span p-text="message"></span>
    <br>
    <input type="text" name="" id="" p-model="message">
  </div>

  <script src="platzi.js"></script>
  <script>
    const { createApp } = Platzi;

    const app = createApp({
      data() {
        return {
          message: 'Hola mundo desde Vue JS 3'
        }
      }
    })
    app.mount()
  </script>
</body>
</html>
```

```javascript
class PlatziReactive {
  constructor(options) {
    this.origen = options.data();
  }

  mount() {
    document.querySelectorAll("*[p-text]").forEach(element => {
      this.pxText(element, this.origen, element.getAttribute("p-text"));
    })
  }

  pxText(element, target, name) {
    element.innerText = target[name];
  }

  pModel() {}
}

var Platzi = {
  createApp(options) {
    return new PlatziReactive(options);
  }
}
```

### Implementando un Proxy en MiniVue

```javascript
class PlatziReactive {
  constructor(options) {
    this.origen = options.data();

    //* Destino

    this.$data = new Proxy(this.origen, {
      get(target, name) {
        if(name in target) {
          return target[name];
        }
        console.warn(`$La propiedad {name} no existe`);
      }
    })
  }

  mount() {
    document.querySelectorAll("*[p-text]").forEach(element => {
      this.pxText(element, this.$data, element.getAttribute("p-text"));
    })
  }

  pxText(element, target, name) {
    element.innerText = target[name];
  }

  pModel() {}
}

var Platzi = {
  createApp(options) {
    return new PlatziReactive(options);
  }
}
```

### Implementando Reflect en MiniVue

Reflect es un espejo de lo que son las Proxies.

> No se trata de tener código 'inteligente', sino código legible.

```javascript
class PlatziReactive {
  constructor(options) {
    this.origen = options.data();

    //* Destino
    this.$data = new Proxy(this.origen, {
      get(target, name) {
        if(Reflect.has(target, name)) {
          return Reflect.get(target, name);
        }
        console.warn(`$La propiedad {name} no existe`);
        return "";
      },

      set(target, name, value) {
        console.log("modificando")
        Reflect.set(target, name, value);
      }
    })
  }

  mount() {
    document.querySelectorAll("*[p-text]").forEach(element => {
      this.pText(element, this.$data, element.getAttribute("p-text"));
    })

    document.querySelectorAll("*[p-model]").forEach(element => {
      const name = element.getAttribute("p-model");
      this.pModel(element, this.$data, name);

      element.addEventListener("input", () => {
        Reflect.set(this.$data, name, element.value);
      })
    })
  }

  pText(element, target, name) {
    element.innerText = Reflect.get(target, name);
  }

  pModel(element, target, name) {
    element.value = target[name];
  }
}

var Platzi = {
  createApp(options) {
    return new PlatziReactive(options);
  }
}
```

### Reactividad con effect, track y trigger

- effect: Es todo aquello que efectua un cambio en tu app.
- track: Son los encargados de seguir las depedendencias dinámicas y sus efectos.
- trigger: Son los disparadores de los efectos de las dependencias.

### Implementando effect, track y trigger en MiniVue

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hola mundo en VueJS 3</title>
</head>
<body>
  <div id="app">
    <span p-text="message"></span>
    <br>
    <input type="text" name="" id="" p-model="message">
    <br>
    <img p-bind="src:image" width="400px">
  </div>

  <script src="platzi.js"></script>
  <script>
    const { createApp } = Platzi;

    const app = createApp({
      data() {
        return {
          message: 'Hola mundo desde Vue JS 3',
          image: 'https://static-cse.canva.com/blob/666309/bestfreestockphotos.jpg'
        }
      }
    })
    app.mount()
  </script>
</body>
</html>
```

```javascript
class PlatziReactive {
  dependencies = new Map();

  constructor(options) {
    this.origen = options.data();

    const self = this;

    //* Destino
    this.$data = new Proxy(this.origen, {
      get(target, name) {
        if(Reflect.has(target, name)) {
          self.track(target, name);
          return Reflect.get(target, name);
        }
        console.warn(`$La propiedad {name} no existe`);
        return "";
      },

      set(target, name, value) {
        Reflect.set(target, name, value);
        self.trigger(name)
      }
    })
  }

  track(target, name) {
    if(!this.dependencies.has(name)) {
      const effect = () => {
        document.querySelectorAll(`*[p-text="${name}"]`).forEach(element => {
          this.pText(element, target, name);
        })
      }
      this.dependencies.set(name, effect);
    }
  }

  trigger(name) {
    const effect = this.dependencies.get(name);
    effect();
  }

  mount() {
    document.querySelectorAll("*[p-text]").forEach(element => {
      this.pText(element, this.$data, element.getAttribute("p-text"));
    })

    document.querySelectorAll("*[p-model]").forEach(element => {
      const name = element.getAttribute("p-model");
      this.pModel(element, this.$data, name);

      element.addEventListener("input", () => {
        Reflect.set(this.$data, name, element.value);
      })
    })

    document.querySelectorAll("*[p-bind]").forEach(element => {
      const [attr, name] = element.getAttribute("p-bind").match(/(\w+)/g);
      this.pBind(element, this.$data, name, attr);
    })
  }

  pText(element, target, name) {
    element.innerText = Reflect.get(target, name);
  }

  pModel(element, target, name) {
    element.value = target[name];
  }

  pBind(element, target, name) {
    element.src = target[name];
  }
}

var Platzi = {
  createApp(options) {
    return new PlatziReactive(options);
  }
}
```

## Templates de Vue.js

### Disclaimer sobre los Templates

[Artículo en Platzi](https://platzi.com/clases/2167-vuejs/34743-disclaimer-sobre-los-templates/)

### Proyecto: PlatziCommerce con Vue.js

### Expresiones

[Buenas prácticas de Vue JS](https://learnvue.co/2020/01/12-vuejs-best-practices-for-pro-developers/)

### Atributos

`v-bind` o acortado `:`

### Conditional rendering

### List rendering

### Template

## APIs internas de Vue.js

### Options API vs Composition API

| Options API                                                        | Composition API                                                               |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Objeto de opciones para configurar nuestra aplicación o componente | Funcionalidad interna para componer y organizar por características(features) |

Una *ventaja* del options API es que es muy fácil para iniciar y crear cosas simples.

Composition API es mejor para proyectos grandes y escalables.

### data() y ref()

ref nos permite crear nueva información reactiva en nuestro proyecto.

```javascript
const { createApp, ref } = Vue;
    const app = createApp({
      setup(){
        const product = ref({
          name: 'Camara',
          price: 1000,
          stock: 11,
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio vero labore deserunt, incidunt eos, sunt eveniet quidem tempora iste debitis consectetur perferendis ratione velit asperiores mollitia corrupti harum. Error, ab!',
          images: [
            {
              image: "./images/camara.jpg",
              thumbnail: "./images/camara-thumb.jpg",
            },
            {
              image: "./images/camara-2.jpg",
              thumbnail: "./images/camara-2-thumb.jpg",
            }
          ],
          new: true,
          offer: false,
        });

        const activeImage = ref(0);

        const cartOpen = ref(false);

        const cart = ref([]);

        setTimeout(() => {
          activeImage.value = 1;
        }, 2000);

        return {
          product,
          activeImage,
          cartOpen,
          cart,
        };
      },
    });
    app.mount("#app");
```

### Métodos personalizados con Options API

```javascript
methods: {
  applyDiscount(event) {
    const discountCodeIndex = this.discountCodes.indexOf(event.target.value);
    if(discountCodeIndex >= 0) {
      this.product.price *= 50 / 100
      this.discountCodes.splice(discountCodeIndex, 1);
    }
  },

  addToCart() {
    const productIndex = this.cart.findIndex(product => product.name === this.product.name);
    if(productIndex >= 0) {
      this.cart[productIndex].quantity += 1;
    } else {
      this.cart.push(this.product);
    }
    this.product.stock -= 1;
  }
}
```

### Métodos personalizados con Composition API

```javascript
const cart = ref([]);
function addToCart() {
  const productIndex = cart.value.findIndex(product => product.name === product.value.name);
  if(productIndex >= 0) {
    cart.value[productIndex].quantity += 1;
  } else {
    cart.value.push(product.value);
  }
  product.value.stock -= 1;
}

const discountCodes = ref(['Platzi20', 'Mike']);
function applyDiscount(event) {
  const discountCodeIndex = discountCodes.value.indexOf(event.target.value);
  if(discountCodeIndex >= 0) {
    product.value.price *= 50 / 100
    discountCodes.value.splice(discountCodeIndex, 1);
    //! Importante usar value para que se refleje en el DOM
  }
}
```

### reactive()

```javascript
const { createApp, ref, reactive, toRefs } = Vue;
  const app = createApp({
    setup(){
      const productState = reactive({
        product: {
          name: 'Camara',
          price: 1000,
          stock: 11,
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio vero labore deserunt, incidunt eos, sunt eveniet quidem tempora iste debitis consectetur perferendis ratione velit asperiores mollitia corrupti harum. Error, ab!',
          images: [
            {
              image: "./images/camara.jpg",
              thumbnail: "./images/camara-thumb.jpg",
            },
            {
              image: "./images/camara-2.jpg",
              thumbnail: "./images/camara-2-thumb.jpg",
            }
          ],
          new: true,
          offer: false,
          quantity: 1,
        },
        activeImage: 0
      });

      const cartState = reactive({
        cartOpen: false,
        cart: [],
      });

      function addToCart() {
        const productIndex = cartState.cart.findIndex(product => product.name === productState.product.name);
        if(productIndex >= 0) {
          cartState.cart[productIndex].quantity += 1;
        } else {
          cartState.cart.push(productState.product);
        }
        productState.product.stock -= 1;
      }

      const discountCodes = ref(['Platzi20', 'Mike']);
      function applyDiscount(event) {
        const discountCodeIndex = discountCodes.value.indexOf(event.target.value);
        if(discountCodeIndex >= 0) {
          productState.product.price *= 50 / 100
          discountCodes.value.splice(discountCodeIndex, 1);
          //! Importante usar value para que se refleje en el DOM
        }
      }

      return {
        ...toRefs(productState),
        ...toRefs(cartState),
        addToCart,
        applyDiscount,
      };
    },
  });
app.mount("#app");
```

## Segunda capa: componentes de Vue.js

### Componentes de Vue con Options API

### Componentes de Vue con Composition API y props

El flujo de información de Vue solamente puede ir de padre a hijo.

### Reto con componentes

[Artículo en Platzi](https://platzi.com/clases/2167-vuejs/34757-reto-con-componentes/)

### Custom events o eventos personalizados con Options API

Eventos de hijos a padres:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platzi Commerce</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <header>
      <h3>Platzi Commerce</h3>
      <button
        class="cart"
        @click="cartOpen = !cartOpen"
      >
        Carro ({{ cart.length }})
      </button>
      <div class="cart-content"  v-show="cartOpen">
        <div
          class="cart-content__product"
          v-for="(product, index) in cart"
          :key="product.name"
          :class="{ 'bg-gray': index & 1 }"
        >
          <img
            :src="product.images[index].image"
            :alt="product.name"
          >
          <span>
            {{ product.name }} -
            ${{ new Intl.NumberFormat("es-MX").format(product.price) }}
            ({{ product.quantity }})
          </span>
        </div>
      </div>
    </header>
    <main>
      <product
        v-for="product in products"
        :key="product.name"
        :product="product"
        @sendtocart="addToCart($event)"
      >
      </product>
    </main>
  </div>
  <script src="https://unpkg.com/vue@next"></script>
  <script>
    const { createApp } = Vue;

    const app = createApp({
      data() {
        return {
          products: [
            {
              name: 'Camara',
              price: 1000,
              stock: 11,
              content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio vero labore deserunt, incidunt eos, sunt eveniet quidem tempora iste debitis consectetur perferendis ratione velit asperiores mollitia corrupti harum. Error, ab!',
              images: [
                {
                  image: "./images/camara.jpg",
                  thumbnail: "./images/camara-thumb.jpg",
                },
                {
                  image: "./images/camara-2.jpg",
                  thumbnail: "./images/camara-2-thumb.jpg",
                }
              ],
              new: true,
              offer: false,
              quantity: 1,
            },
          ],
          cartOpen: true,
          cart: [],
        }
      },

      methods: {
        addToCart(product) {
          const productIndex = this.cart.findIndex(product => product.name === product.name);
          if(productIndex >= 0) {
            this.cart[productIndex].quantity += 1;
          } else {
            this.cart.push(product);
          }
          product.stock -= 1;
        },
      }
    });
    </script>

  <script src="badge.js"></script>
  <script src="product.js"></script>

  <script>
    app.mount("#app");
  </script>
</body>
</html>
```

```javascript
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
        v-else>Quedan {{ product.stock }} unidades disponibles
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
  }
})
```

### Custom events o eventos personalizados con Composition API

Pasar eventos de hijos a padres:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platzi Commerce</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <header>
      <h3>Platzi Commerce</h3>
      <button
        class="cart"
        @click="cartOpen = !cartOpen"
      >
        Carro ({{ cart.length }})
      </button>
      <div class="cart-content"  v-show="cartOpen">
        <div
          class="cart-content__product"
          v-for="(product, index) in cart"
          :key="product.name"
          :class="{ 'bg-gray': index & 1 }"
        >
          <img
            :src="product.images[index].image"
            :alt="product.name"
          >
          <span>
            {{ product.name }} -
            ${{ new Intl.NumberFormat("es-MX").format(product.price) }}
            ({{ product.quantity }})
          </span>
        </div>
      </div>
    </header>
    <main>
      <product
        v-for="product in products"
        :key="product.name"
        :product="product"
        @sendtocart="addToCart($event)"
      >
      </product>
    </main>
  </div>
  <script src="https://unpkg.com/vue@next"></script>
  <script>
    const { createApp, ref, reactive, toRefs } = Vue;
    const app = createApp({
      setup(){
        const products = ref([
          {
            name: 'Camara',
            price: 1000,
            stock: 11,
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio vero labore deserunt, incidunt eos, sunt eveniet quidem tempora iste debitis consectetur perferendis ratione velit asperiores mollitia corrupti harum. Error, ab!',
            images: [
              {
                image: "./images/camara.jpg",
                thumbnail: "./images/camara-thumb.jpg",
              },
              {
                image: "./images/camara-2.jpg",
                thumbnail: "./images/camara-2-thumb.jpg",
              }
            ],
            new: true,
            offer: false,
            quantity: 1,
          },
        ])

        const cartState = reactive({
          cartOpen: false,
          cart: [],
        });

        function addToCart(product) {
          const productIndex = cartState.cart.findIndex(product => product.name === product.name);
          if(productIndex >= 0) {
            cartState.cart[productIndex].quantity += 1;
          } else {
            cartState.cart.push(product);
          }
          product.stock -= 1;
        }

        return {
          ...toRefs(cartState),
          addToCart,
          products,
        };
      },
    });
  </script>

  <script src="product.js"></script>

  <script>
    app.mount("#app");
  </script>
</body>
</html>
```

```javascript
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
        v-else>Quedan {{ product.stock }} unidades disponibles
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
      activeImage: 0
    });

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

    return {
      ...toRefs(productState),
      applyDiscount,
      sendtocart,
    }
  }
})
```

### Watchers con Options API

```javascript
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
      description_color: 'rgb(104, 104, 209)'
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
    activeImage(Image, oldImage) {
      console.log(Image, oldImage);
    },
    "product.stock"(stock) {
      if(stock <= 1) {
        this.description_color = 'rgb(255, 0, 0)'
      }
    }
  }
})
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platzi Commerce</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <header>
      <h3>Platzi Commerce</h3>
      <button
        class="cart"
        @click="cartOpen = !cartOpen"
      >
        Carro ({{ cart.length }})
      </button>
      <div class="cart-content"  v-show="cartOpen">
        <div
          class="cart-content__product"
          v-for="(product, index) in cart"
          :key="product.name"
          :class="{ 'bg-gray': index & 1 }"
        >
          <img
            :src="product.images[index].image"
            :alt="product.name"
          >
          <span>
            {{ product.name }} -
            ${{ new Intl.NumberFormat("es-MX").format(product.price) }}
            ({{ product.quantity }})
          </span>
        </div>
        <p>Total ${{ new Intl.NumberFormat("es-MX").format(total) }}</p>
      </div>
    </header>
    <main>
      <product
        v-for="product in products"
        :key="product.name"
        :product="product"
        @sendtocart="addToCart($event)"
      >
      </product>
    </main>
  </div>
  <script src="https://unpkg.com/vue@next"></script>
  <script>
    const { createApp } = Vue;

    const app = createApp({
      data() {
        return {
          products: [
            {
              name: 'Camara',
              price: 1000,
              stock: 11,
              content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio vero labore deserunt, incidunt eos, sunt eveniet quidem tempora iste debitis consectetur perferendis ratione velit asperiores mollitia corrupti harum. Error, ab!',
              images: [
                {
                  image: "./images/camara.jpg",
                  thumbnail: "./images/camara-thumb.jpg",
                },
                {
                  image: "./images/camara-2.jpg",
                  thumbnail: "./images/camara-2-thumb.jpg",
                }
              ],
              new: true,
              offer: false,
              quantity: 1,
            },
          ],
          cartOpen: true,
          cart: [],
          total: 0,
        }
      },

      methods: {
        addToCart(product) {
          const productIndex = this.cart.findIndex(product => product.name === product.name);
          if(productIndex >= 0) {
            this.cart[productIndex].quantity += 1;
          } else {
            this.cart.push(product);
          }
          product.stock -= 1;
        },
      },

      watch: {
        cart: {
          handler(cart) {
            this.total = cart.reduce((previous, current) => {
              const previousPrice = previous.price || previous;
              const previousQuantity = previous.quantity || 1;
              return previousPrice * previousQuantity + current.price * current.quantity;
            }, 0);
          },
          deep: true,
        }
      }
    });
    </script>

  <script src="badge.js"></script>
  <script src="product.js"></script>

  <script>
    app.mount("#app");
  </script>
</body>
</html>
```

### Watchers con Composition API

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platzi Commerce</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <header>
      <h3>Platzi Commerce</h3>
      <button
        class="cart"
        @click="cartOpen = !cartOpen"
      >
        Carro ({{ cart.length }})
      </button>
      <div class="cart-content"  v-show="cartOpen">
        <div
          class="cart-content__product"
          v-for="(product, index) in cart"
          :key="product.name"
          :class="{ 'bg-gray': index & 1 }"
        >
          <img
            :src="product.images[index].image"
            :alt="product.name"
          >
          <span>
            {{ product.name }} -
            ${{ new Intl.NumberFormat("es-MX").format(product.price) }}
            ({{ product.quantity }})
          </span>
        </div>
        <p>Total ${{ new Intl.NumberFormat("es-MX").format(total) }}</p>
      </div>
    </header>
    <main>
      <product
        v-for="product in products"
        :key="product.name"
        :product="product"
        @sendtocart="addToCart($event)"
      >
      </product>
    </main>
  </div>
  <script src="https://unpkg.com/vue@next"></script>
  <script>
    const { createApp, ref, reactive, toRefs, watch } = Vue;
    const app = createApp({
      setup(){
        const products = ref([
          {
            name: 'Camara',
            price: 1000,
            stock: 11,
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio vero labore deserunt, incidunt eos, sunt eveniet quidem tempora iste debitis consectetur perferendis ratione velit asperiores mollitia corrupti harum. Error, ab!',
            images: [
              {
                image: "./images/camara.jpg",
                thumbnail: "./images/camara-thumb.jpg",
              },
              {
                image: "./images/camara-2.jpg",
                thumbnail: "./images/camara-2-thumb.jpg",
              }
            ],
            new: true,
            offer: false,
            quantity: 1,
          },
        ])

        const cartState = reactive({
          cartOpen: false,
          cart: [],
          total: 0,
        });

        function addToCart(product) {
          const productIndex = cartState.cart.findIndex(product => product.name === product.name);
          if(productIndex >= 0) {
            cartState.cart[productIndex].quantity += 1;
          } else {
            cartState.cart.push(product);
          }
          product.stock -= 1;
        }

        watch(cartState.cart, (value, oldValue) => {
          cartState.total = cartState.cart.reduce((previous, current) => {
              const previousPrice = previous.price || previous;
              const previousQuantity = previous.quantity || 1;
              return previousPrice * previousQuantity + current.price * current.quantity;
            }, 0);
        })

        return {
          ...toRefs(cartState),
          addToCart,
          products,
        };
      },
    });
  </script>

  <script src="product.js"></script>

  <script>
    app.mount("#app");
  </script>
</body>
</html>
```

```javascript
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
      description_color: "rgb(104, 104, 209)",
    });

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

    watch(() => props.product.stock,
      (stock) => {
        if(stock <= 1) {
          productState.description_color = 'rgb(255, 0, 0)'
        }
      })

    return {
      ...toRefs(productState),
      applyDiscount,
      sendtocart,
    }
  }
})
```

### Computed properties con Options API

Las computed properties son aquellas que se encargan de crear un nuevo tipo de propiedades reactiva basada en sus depedencias.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platzi Commerce</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <header>
      <h3>Platzi Commerce</h3>
      <button
        class="cart"
        @click="cartOpen = !cartOpen"
      >
        Carro ({{ cart.length }})
      </button>
      <div class="cart-content"  v-show="cartOpen">
        <div
          class="cart-content__product"
          v-for="(product, index) in cart"
          :key="product.name"
          :class="{ 'bg-gray': index & 1 }"
        >
          <img
            :src="product.images[index].image"
            :alt="product.name"
          >
          <span>
            {{ product.name }} -
            ${{ new Intl.NumberFormat("es-MX").format(product.price) }}
            ({{ product.quantity }})
          </span>
        </div>
        <p>Total ${{ new Intl.NumberFormat("es-MX").format(total) }}</p>
      </div>
    </header>
    <main>
      <product
        v-for="product in products"
        :key="product.name"
        :product="product"
        @sendtocart="addToCart($event)"
      >
      </product>
    </main>
  </div>
  <script src="https://unpkg.com/vue@next"></script>
  <script>
    const { createApp } = Vue;

    const app = createApp({
      data() {
        return {
          products: [
            {
              name: 'Camara',
              price: 1000,
              stock: 11,
              content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio vero labore deserunt, incidunt eos, sunt eveniet quidem tempora iste debitis consectetur perferendis ratione velit asperiores mollitia corrupti harum. Error, ab!',
              images: [
                {
                  image: "./images/camara.jpg",
                  thumbnail: "./images/camara-thumb.jpg",
                },
                {
                  image: "./images/camara-2.jpg",
                  thumbnail: "./images/camara-2-thumb.jpg",
                }
              ],
              new: true,
              offer: false,
              quantity: 1,
            },
          ],
          cartOpen: true,
          cart: [],
          //total: 0,
        }
      },

      methods: {
        addToCart(product) {
          const productIndex = this.cart.findIndex(product => product.name === product.name);
          if(productIndex >= 0) {
            this.cart[productIndex].quantity += 1;
          } else {
            this.cart.push(product);
          }
          product.stock -= 1;
        },
      },

      watch: {
        /* cart: {
          handler(cart) {
            this.total = cart.reduce((previous, current) => {
              const previousPrice = previous.price || previous;
              const previousQuantity = previous.quantity || 1;
              return previousPrice * previousQuantity + current.price * current.quantity;
            }, 0);
          },
          deep: true,
        } */
      },

      computed: {
        total() {
          return this.cart.reduce((previous, current) => {
            const previousPrice = previous.price || previous;
            const previousQuantity = previous.quantity || 1;
            return previousPrice * previousQuantity + current.price * current.quantity;
          }, 0);
        },
      }
    });
    </script>

  <script src="badge.js"></script>
  <script src="product.js"></script>

  <script>
    app.mount("#app");
  </script>
</body>
</html>
```

```javascript
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
```

### Computed properties con Composition API

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platzi Commerce</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <header>
      <h3>Platzi Commerce</h3>
      <button
        class="cart"
        @click="cartOpen = !cartOpen"
      >
        Carro ({{ cart.length }})
      </button>
      <div class="cart-content"  v-show="cartOpen">
        <div
          class="cart-content__product"
          v-for="(product, index) in cart"
          :key="product.name"
          :class="{ 'bg-gray': index & 1 }"
        >
          <img
            :src="product.images[index].image"
            :alt="product.name"
          >
          <span>
            {{ product.name }} -
            ${{ new Intl.NumberFormat("es-MX").format(product.price) }}
            ({{ product.quantity }})
          </span>
        </div>
        <p>Total ${{ new Intl.NumberFormat("es-MX").format(total) }}</p>
      </div>
    </header>
    <main>
      <product
        v-for="product in products"
        :key="product.name"
        :product="product"
        @sendtocart="addToCart($event)"
      >
      </product>
    </main>
  </div>
  <script src="https://unpkg.com/vue@next"></script>
  <script>
    const { createApp, ref, reactive, toRefs, watch, computed } = Vue;
    const app = createApp({
      setup(){
        const products = ref([
          {
            name: 'Camara',
            price: 1000,
            stock: 11,
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio vero labore deserunt, incidunt eos, sunt eveniet quidem tempora iste debitis consectetur perferendis ratione velit asperiores mollitia corrupti harum. Error, ab!',
            images: [
              {
                image: "./images/camara.jpg",
                thumbnail: "./images/camara-thumb.jpg",
              },
              {
                image: "./images/camara-2.jpg",
                thumbnail: "./images/camara-2-thumb.jpg",
              }
            ],
            new: true,
            offer: false,
            quantity: 1,
          },
        ])

        const cartState = reactive({
          cartOpen: false,
          cart: [],
          total: computed(() => {
            return cartState.total = cartState.cart.reduce((previous, current) => {
                const previousPrice = previous.price || previous;
                const previousQuantity = previous.quantity || 1;
                return previousPrice * previousQuantity + current.price * current.quantity;
            }, 0);
          }),
        });

        /* const total = computed(() => {
          return cartState.total = cartState.cart.reduce((previous, current) => {
              const previousPrice = previous.price || previous;
              const previousQuantity = previous.quantity || 1;
              return previousPrice * previousQuantity + current.price * current.quantity;
            }, 0);
        }); */

        function addToCart(product) {
          const productIndex = cartState.cart.findIndex(product => product.name === product.name);
          if(productIndex >= 0) {
            cartState.cart[productIndex].quantity += 1;
          } else {
            cartState.cart.push(product);
          }
          product.stock -= 1;
        }

        /* watch(cartState.cart, (value, oldValue) => {
          cartState.total = cartState.cart.reduce((previous, current) => {
              const previousPrice = previous.price || previous;
              const previousQuantity = previous.quantity || 1;
              return previousPrice * previousQuantity + current.price * current.quantity;
            }, 0);
        }) */

        return {
          ...toRefs(cartState),
          addToCart,
          products,
          //total,
        };
      },
    });
  </script>

  <script src="product.js"></script>

  <script>
    app.mount("#app");
  </script>
</body>
</html>
```

```javascript
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
```

### Ciclos de vida de un componente: Options API

Analogía de ciclo de vida con una receta:

- beforeCreate() - comprar
- created() - cocinar
- mounted() - emplatar

[Lifecycle hooks](https://v3.vuejs.org/api/options-lifecycle-hooks.html)

[My JSON Serve](https://my-json-server.typicode.com/) sirve para simular una API

```javascript
async created() {
  try {
    const response = await fetch('https://my-json-server.typicode.com/iosamuel/demo/products');
    this.products = data;
    const data = await response.json();
  } catch (error) {
    console.error('Error al hacer la petición: ', error);
  }
},
```

### Ciclos de vida de un componente: Composition API

setup === created

```javascript
fetch('https://my-json-server.typicode.com/iosamuel/demo/products')
  .then(response => response.json())
  .then(data => {
    products.value = data;
})
```
