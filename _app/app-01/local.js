/*
  Isso mostra que é possível obter um módulo genérico qualquer,
  no caso aqui o "core" do ALC.
  Entretanto, isso não é entendido como o mesmo módulo usado pelos componentes.
  Ou seja, o módulo é carregado/executado duas vezes.
 */
import ALC from "./node_modules/alc/dist/collection/core/alc.js";
console.log(ALC);
