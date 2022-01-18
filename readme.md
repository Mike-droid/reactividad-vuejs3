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
