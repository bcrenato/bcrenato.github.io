// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAm7J99HoC-_ccqqTL6ORSKe0mPCVebyH8",
  authDomain: "cadastro-firebase-22bb0.firebaseapp.com",
  databaseURL: "https://cadastro-firebase-22bb0-default-rtdb.firebaseio.com",
  projectId: "cadastro-firebase-22bb0",
  storageBucket: "cadastro-firebase-22bb0.firebasestorage.app",
  messagingSenderId: "476708455498",
  appId: "1:476708455498:web:7504f49d3e5829354f52b3"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referências
const form = document.getElementById('cadastroForm');
const status = document.getElementById('status');
const lista = document.getElementById('listaCadastros');

// Enviar dados
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const sobrenome = document.getElementById('sobrenome').value.trim();
  const estadoCivil = document.getElementById('estadoCivil').value;

  if (!nome || !sobrenome || !estadoCivil) {
    status.textContent = "Preencha todos os campos.";
    status.style.color = "red";
    return;
  }

  const ref = database.ref('cadastros').push();
  ref.set({
    nome,
    sobrenome,
    estadoCivil,
    dataHora: new Date().toISOString()
  })
  .then(() => {
    status.textContent = "Cadastro enviado com sucesso!";
    status.style.color = "green";
    form.reset();
  })
  .catch((error) => {
    status.textContent = "Erro ao cadastrar.";
    status.style.color = "red";
    console.error("Erro:", error);
  });
});

// Listar dados
database.ref('cadastros').on('value', (snapshot) => {
  lista.innerHTML = '';
  const dados = snapshot.val();
  if (dados) {
    Object.entries(dados).forEach(([id, item]) => {
      const li = document.createElement('li');
      li.textContent = `${item.nome} ${item.sobrenome} - ${item.estadoCivil}`;
      lista.appendChild(li);
    });
  } else {
    lista.innerHTML = '<li>Nenhum cadastro encontrado.</li>';
  }
});
