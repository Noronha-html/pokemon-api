let pokemonAlvo = null;
let tentativas = 0;
const input = document.getElementById("guessInput");
const tentativasSpan = document.getElementById("tentativas");
const tentativasLista = document.getElementById("tentativasLista");

async function carregarPokemon() {
  const id = Math.floor(Math.random() * 151) + 1;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const dados = await res.json();

  pokemonAlvo = {
    nome: dados.name.toLowerCase(),
    tipos: dados.types.map(t => t.type.name),
    altura: dados.height / 10,
    peso: dados.weight / 10
  };

  tentativas = 0;
  tentativasSpan.textContent = "Tentativas: 0";
  tentativasLista.innerHTML = "";
  input.value = "";
  input.disabled = false;
}

input.addEventListener("keypress", e => {
  if (e.key === "Enter") verificarResposta();
});

async function verificarResposta() {
    const nome = input.value.toLowerCase().trim();
    if (!nome) return;
  
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
    if (!res.ok) {
      alert("Pokémon não encontrado.");
      return;
    }
  
    const dados = await res.json();
  
    // Verificação de geração (somente até o ID 151)
    if (dados.id > 151) {
      alert("Apenas Pokémon da primeira geração são permitidos!");
      return;
    }
  
    const tipos = dados.types.map(t => t.type.name);
    const altura = dados.height / 10;
    const peso = dados.weight / 10;
  
    tentativas++;
    tentativasSpan.textContent = `Tentativas: ${tentativas}`;
    input.value = "";
  
    const div = document.createElement("div");
    div.classList.add("tentativa");
  
    const img = document.createElement("img");
    img.classList.add("img-pokemon");
    img.src = dados.sprites.front_default;
    div.appendChild(img);
  
    const info = document.createElement("div");
    info.classList.add("info");
  
    const nomeEl = document.createElement("div");
    nomeEl.classList.add("nome");
    nomeEl.textContent = dados.name.charAt(0).toUpperCase() + dados.name.slice(1);
    info.appendChild(nomeEl);
  
    const tiposDiv = document.createElement("div");
    tiposDiv.classList.add("tipos");
    tipos.forEach((tipo, i) => {
      const span = document.createElement("span");
      span.classList.add("tipo");
  
      if (pokemonAlvo.tipos[i] === tipo) {
        span.classList.add("tipo-correto");
      } else if (pokemonAlvo.tipos.includes(tipo)) {
        span.classList.add("tipo-parcial");
      } else {
        span.classList.add("tipo-errado");
      }
  
      span.textContent = tipo.toUpperCase();
      tiposDiv.appendChild(span);
    });
    info.appendChild(tiposDiv);
  
    const detalhes = document.createElement("div");
    detalhes.classList.add("detalhes");
  
    const alturaSpan = document.createElement("div");
    alturaSpan.classList.add("dado");
    alturaSpan.innerHTML = `${altura.toFixed(1)} M ` + comparar(altura, pokemonAlvo.altura);
  
    const pesoSpan = document.createElement("div");
    pesoSpan.classList.add("dado");
    pesoSpan.innerHTML = `${peso.toFixed(1)} KG ` + comparar(peso, pokemonAlvo.peso);
  
    detalhes.appendChild(alturaSpan);
    detalhes.appendChild(pesoSpan);
  
    info.appendChild(detalhes);
    div.appendChild(info);
    tentativasLista.prepend(div);
  
    if (nome === pokemonAlvo.nome) {
      input.disabled = true;
      alert(`Parabéns! O Pokémon era ${dados.name.toUpperCase()}!`);
    }
  }
  

function comparar(valor, alvo) {
  if (valor < alvo) return `<span class="seta-vermelha">🔼</span>`;
  if (valor > alvo) return `<span class="seta-vermelha">🔽</span>`;
  return `<span class="seta-verde">✅</span>`;
}

carregarPokemon();