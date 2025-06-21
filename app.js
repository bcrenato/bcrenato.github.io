// Inicializa Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAm7J99HoC-_ccqqTL6ORSKe0mPCVebyH8",
  authDomain: "cadastro-firebase-22bb0.firebaseapp.com",
  databaseURL: "https://cadastro-firebase-22bb0-default-rtdb.firebaseio.com",
  projectId: "cadastro-firebase-22bb0",
  storageBucket: "cadastro-firebase-22bb0.firebasestorage.app",
  messagingSenderId: "476708455498",
  appId: "1:476708455498:web:7504f49d3e5829354f52b3"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referências
const form = document.getElementById('cadastroForm');
const status = document.getElementById('status');
const lista = document.getElementById('listaCadastros');

// Enviar dados
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const sobrenome = document.getElementById('sobrenome').value;
  const estadoCivil = document.getElementById('estadoCivil').value;

  const ref = database.ref('cadastros').push();
  ref.set({
    nome,
    sobrenome,
    estadoCivil,
    dataHora: new Date().toISOString()
  })
  .then(() => {
    status.textContent = "Cadastro enviado com sucesso!";
    form.reset();
  })
  .catch((error) => {
    status.textContent = "Erro ao cadastrar.";
    console.error("Erro:", error);
  });
});

// Exibir cadastros
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
