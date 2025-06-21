// Configuração do Firebase (substitua com suas credenciais)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
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