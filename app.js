// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
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
