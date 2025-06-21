// Substitua com seu firebaseConfig
 const firebaseConfig = {
  apiKey: "AIzaSyC3aRZ...suaAPIKEYaqui",
  authDomain: "seu-projeto.firebaseapp.com",
  databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referências
const form = document.getElementById('cadastroForm');
const status = document.getElementById('status');
const lista = document.getElementById('listaCadastros');

// Cadastrar dados
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const sobrenome = document.getElementById('sobrenome').value.trim();
  const estadoCivil = document.getElementById('estadoCivil').value;

  if (!nome || !sobrenome || !estadoCivil) {
    status.textContent = "Preencha todos os campos!";
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
  .catch(error => {
    status.textContent = "Erro ao cadastrar.";
    status.style.color = "red";
    console.error(error);
  });
});

// Listar cadastros em tempo real
database.ref('cadastros').on('value', snapshot => {
  lista.innerHTML = '';
  const dados = snapshot.val();

  if (dados) {
    Object.entries(dados).forEach(([id, info]) => {
      const li = document.createElement('li');
      li.textContent = `${info.nome} ${info.sobrenome} - ${info.estadoCivil}`;
      lista.appendChild(li);
    });
  } else {
    lista.innerHTML = '<li>Nenhum cadastro encontrado.</li>';
  }
});
