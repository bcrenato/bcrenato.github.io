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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referência ao formulário
const form = document.getElementById('cadastroForm');
const status = document.getElementById('status');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const sobrenome = document.getElementById('sobrenome').value;
  const estadoCivil = document.getElementById('estadoCivil').value;

  const novoCadastroRef = database.ref('cadastros').push();

  novoCadastroRef.set({
    nome: nome,
    sobrenome: sobrenome,
    estadoCivil: estadoCivil,
    dataHora: new Date().toISOString()
  })
  .then(() => {
    status.textContent = "Cadastro enviado com sucesso!";
    form.reset();
  })
  .catch((error) => {
    console.error("Erro ao salvar no Firebase:", error);
    status.textContent = "Erro ao cadastrar.";
  });
});
