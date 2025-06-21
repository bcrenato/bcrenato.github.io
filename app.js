// Configuração do Firebase (substitua com suas credenciais)
const firebaseConfig = {
  apiKey: "AIzaSyD_hT5Y7g6KS5ABweUKgQoqnXrWQ41v8q8",
  authDomain: "cadastro-usuarios-14175.firebaseapp.com",
  projectId: "cadastro-usuarios-14175",
  storageBucket: "cadastro-usuarios-14175.firebasestorage.app",
  messagingSenderId: "125608119277",
  appId: "1:125608119277:web:2986444e6c3319fcad75e4"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Cadastro de usuários
document.getElementById("formCadastro").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("endereco").value;

    // Salva no Firestore
    db.collection("usuarios").add({
        nome: nome,
        telefone: telefone,
        endereco: endereco,
        dataCadastro: new Date()
    })
    .then(() => {
        document.getElementById("mensagem").innerHTML = "Cadastro realizado com sucesso!";
        document.getElementById("formCadastro").reset();
    })
    .catch((error) => {
        document.getElementById("mensagem").innerHTML = "Erro: " + error.message;
    });
});
