export function ContactForm() {
  const d = document,
    $form = d.createElement("form"),
    $styles = d.getElementById("dynamic-styles");

  $form.classList.add("contact-form");

  $styles.innerHTML = `
  
  /* ************* ContactFrom Validations ********** */
.contact-form {
  --form-ok-color: rgb(58, 187, 58);
  --form-error-color: rgb(255, 60, 0);
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}

.contact-form > * {
  padding: 0.5rem;
  margin: 1rem auto;
  display: block;
  width: 100%;
}

.contact-form textarea {
  resize: none;
}

.contact-form legend,
.contact-form-response {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.contact-form input,
.contact-form textarea {
  font-size: 1rem;
  font-family: sans-serif;
}

.contact-form input[type="submit"] {
  width: 50%;
  font-weight: bold;
  cursor: pointer;
}

.contact-form *::placeholder {
  color: rgba(0, 0, 0, 0.418);
}

.contact-form [required]:valid {
  border: thin solid var(--form-ok-color);
}

.contact-form [required]:invalid {
  border: thin solid var(--form-error-color);
}

.contact-form-error {
  margin-top: -1rem;
  font-size: 80%;
  background-color: var(--form-error-color);
  color: #fff;
  transition: all 800ms ease;
}

.contact-form-error.is-active {
  display: block;
  animation: show-message 1s 1 normal 0s ease-out both;
}

.contact-form-loader {
  text-align: center;
}

.none {
  display: none;
}

@keyframes show-message {
  0% {
    visibility: hidden;
    opacity: 0;
  }

  100% {
    visibility: visible;
    opacity: 1;
  }
}

  `;

  $form.innerHTML = `
  <legend>Escribe tu Mensaje</legend>
          <input type="text" name="name" placeholder="Escribe tu nombre"
            title="Debes ingresar letras y espacios en blanco" pattern="^[A-Z a-z ÑñÁáÉéÍíÓóÚúÚü\\s]+$" required>
          <input type="email" name="email" placeholder="Escribe tu email" title="Email incorrecto"
            pattern="^[a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,15})$" required>
          <input type="text" name="subject" placeholder="Asunto a tratar" title="El asunto es requerido" required>
          <textarea name="comments" cols="50" rows="5 " placeholder="Escribe tus comentarios"
            title="Tu comentario no debe exceder los 255 caracteres" data-pattern="^.{1,255}$" required></textarea>
          <input type="submit" value="Enviar" class="button">
          <div class="contact-form-loader none">
            <img src="app/assets/oval.svg" alt="Cargando">
          </div>
          <div class="contact-form-response none">
            <p>Los datos han sido enviados</p>
          </div>
  `;

  function validationForm() {
    const $form = d.querySelector(".contact-form"),
      $inputs = d.querySelectorAll(".contact-form [required]");

    // console.log($inputs);

    $inputs.forEach((input) => {
      const $span = d.createElement("span");
      $span.id = input.name;
      $span.textContent = input.title;
      $span.classList.add("contact-form-error", "none");
      input.insertAdjacentElement("afterend", $span);
    });

    d.addEventListener("keyup", (e) => {
      if (e.target.matches(".contact-form [required]")) {
        let $input = e.target,
          pattern = $input.pattern || $input.dataset.pattern;

        if (pattern && $input.value !== "") {
          let regex = new RegExp(pattern);
          return !regex.exec($input.value)
            ? d.getElementById($input.name).classList.add("is-active")
            : d.getElementById($input.name).classList.remove("is-active");
        }
        if (!pattern) {
          return $input.value === ""
            ? d.getElementById($input.name).classList.add("is-active")
            : d.getElementById($input.name).classList.remove("is-active");
        }
      }
    });

    d.addEventListener("submit", (e) => {
      e.preventDefault(); // desactiva el comportamiento por default del formulario
      //alert("Enviando Datos");

      const $loader = d.querySelector(".contact-form-loader"),
        $response = d.querySelector(".contact-form-response");

      $loader.classList.remove("none");

      fetch("https://formsubmit.co/ajax/luisfernandolocu@gmail.com", {
        method: "POST",
        body: new FormData(e.target),
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((json) => {
          $loader.classList.add("none");
          $response.classList.remove("none");
          //$response.innerHTML = `<p>${json.message}</p>`;
          $response.innerHTML = "Datos enviados correctamente";
          $form.reset();
        })
        .catch((err) => {
          console.log(err);
          let message =
            err.statusText &&
            "Ocurrio un erros al enviar datos, intenta nuevamente";
          $response.innerHTML = `<p>Error ${err.status} : ${message}</p>`;
        })
        .finally(() =>
          setTimeout(() => {
            $loader.classList.add("none");
            $response.innerHTML = "";
          }, 3000)
        );
    });
  }

  setTimeout(() => validationForm(), 100);

  return $form;
}
