const form = document.getElementById("formAgendamento");

const inputNome = document.getElementById("nome");
const inputServico = document.getElementById("servico");
const inputData = document.getElementById("data");
const inputHora = document.getElementById("hora");

const telefone = "5563992131295";

// 🔥 Lista fixa de horários
const horariosFixos = ["13:00", "16:00", "19:00"];

// Quando escolher data, atualizar horários disponíveis
inputData.addEventListener("change", atualizarHorarios);

function atualizarHorarios() {
  const data = inputData.value;

  // Se não escolheu data ainda, não faz nada
  if (!data) return;

  // Bloquear domingo
  const dataEscolhida = new Date(data + "T00:00:00");
  const diaSemana = dataEscolhida.getDay();

  if (diaSemana === 0) {
    alert("A barbearia não atende no domingo. Escolha outra data.");
    inputData.value = "";
    return;
  }

  // Pegar horários ocupados daquela data
  const ocupados = pegarHorariosOcupados(data);

  // Limpar select
  inputHora.innerHTML = <option value="">Selecione...</option>;

  // Recriar opções
  horariosFixos.forEach((hora) => {
    const option = document.createElement("option");
    option.value = hora;

    if (ocupados.includes(hora)) {
      option.textContent = ${hora} (Indisponível);
      option.disabled = true;
    } else {
      option.textContent = hora;
    }

    inputHora.appendChild(option);
  });
}

// Salvar horário como ocupado no navegador
function salvarHorarioOcupado(data, hora) {
  const chave = agenda_${data};

  let horarios = JSON.parse(localStorage.getItem(chave)) || [];

  if (!horarios.includes(hora)) {
    horarios.push(hora);
    localStorage.setItem(chave, JSON.stringify(horarios));
  }
}

// Buscar horários ocupados daquela data
function pegarHorariosOcupados(data) {
  const chave = agenda_${data};
  return JSON.parse(localStorage.getItem(chave)) || [];
}

// Quando enviar formulário
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = inputNome.value.trim();
  const servico = inputServico.value;
  const data = inputData.value;
  const hora = inputHora.value;

  if (!nome || !servico || !data || !hora) {
    alert("Preencha tudo certinho!");
    return;
  }

  // Verificar se horário já está ocupado
  const ocupados = pegarHorariosOcupados(data);
  if (ocupados.includes(hora)) {
    alert("Esse horário já foi agendado. Escolha outro.");
    atualizarHorarios();
    return;
  }

  // Formatar data
  const [ano, mes, dia] = data.split("-");
  const dataFormatada = ${dia}/${mes}/${ano};

  // Mensagem WhatsApp
  const mensagem =
    Olá! Quero agendar um horário na Barbearia Paulo Silva.%0A%0A +
    👤 Nome: ${nome}%0A +
    ✂️ Serviço: ${servico}%0A +
    📅 Data: ${dataFormatada}%0A +
    🕒 Horário: ${hora}%0A%0A +
    Pode confirmar pra mim?;

  // 🔥 SALVAR HORÁRIO COMO OCUPADO
  salvarHorarioOcupado(data, hora);

  // Atualizar lista de horários
  atualizarHorarios();

  // Abrir WhatsApp
  const link = https://wa.me/${telefone}?text=${mensagem};
  window.open(link, "_blank");

  // Limpar nome e serviço (mantém data)
  inputNome.value = "";
  inputServico.value = "";
});
